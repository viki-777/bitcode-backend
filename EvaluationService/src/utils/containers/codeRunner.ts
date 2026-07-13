import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.util";
import { createNewDockerContainer } from "./createContainer.util";

const allowListedLanguage = ["python", "cpp"];

export interface RunCodeOptions {
  code: string;
  language: "python" | "cpp";
  timeout: number;
  imageName: string;
  input?: string;
}

export async function runCode(options: RunCodeOptions) {
  const { code, language, timeout, imageName, input } = options;

  if (!allowListedLanguage.includes(language)) {
    throw new InternalServerError(`Language ${language} is not supported.`);
  }

  const container = await createNewDockerContainer({
    imageName: imageName,
    cmdExecutable: commands[language](code, input),
    memoryLimit: 1024 * 1024 * 1024, // 1GB
  });

  let isTimeLimitExceeded = false;
  const timeLimitExceededTimeout = setTimeout(() => {
    console.log("Time limit exceeded");
    isTimeLimitExceeded = true;
    container?.kill();
  }, timeout);

  console.log("Container created successfully", container?.id);

  const startTime = Date.now();
  await container?.start();

  const status = await container?.wait();
  
  const executionTime = Date.now() - startTime;

  if (isTimeLimitExceeded) {
    await container?.remove();
    return {
      status: "time_limit_exceeded",
      output: "Time limit exceeded",
      executionTime,
    };
  }

  console.log("Container status", status);

  const logs = await container?.logs({
    stdout: true,
    stderr: true,
  });

  const containerLogs = processLogs(logs);

  await container?.remove();

  clearTimeout(timeLimitExceededTimeout);

  if (status.StatusCode == 0) {
    // success
    return {
      status: "success",
      output: containerLogs,
      executionTime,
    };
  } else {
    return {
        status: "failed",
        output: containerLogs,
        executionTime,
    }
  }
}

function processLogs(logs: Buffer | undefined) {
  return logs
    ?.toString("utf-8")
    .replace(/\x00/g, "") // Remove null bytes
    .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "") // Remove control characters except \n (0x0A)
    .trim();
}
