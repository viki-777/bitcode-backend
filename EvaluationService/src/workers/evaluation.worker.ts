import { Job, Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission, updateProblemStats } from "../apis/submission.api";

function matchTestCasesWithResults(testCases: TestCase[], results: EvaluationResult[]) {
    const output: Record<string, { verdict: string, executionTime: number, expected?: string, actual?: string }> = {};
    if(results.length !== testCases.length) {
        console.log("WA - test cases length mismatch");
        return;
    }

    testCases.forEach((testCase, index) => {
        let verdict = "";
        const result = results[index];
        const executionTime = result.executionTime;

        if(result.status === "time_limit_exceeded") {
            verdict = "TLE";
        } else if (result.status === "failed") {
            verdict = "RE";
        } else {
            if(result.output === testCase.output) {
                verdict = "AC";
            } else {
                verdict = "WA";
            }
        }

        output[testCase._id] = {
            verdict,
            executionTime,
            ...(verdict === "WA" || verdict === "RE" ? { expected: testCase.output, actual: result.output } : {})
        };
    });

    return output;
}

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job: Job) => {
        logger.info(`Processing job ${job.id}`);
        const data: EvaluationJob = job.data;

        console.log("data", data);
        console.log("data.problem.testcases", data.problem.testcases);

        try {
            const testCasesRunnerPromise = data.problem.testcases.map(testcase => {
                
                return runCode({
                    code: data.code,
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    imageName: LANGUAGE_CONFIG[data.language].imageName,
                    input: testcase.input,
                });
            });

            const testCasesRunnerResults: EvaluationResult[] = await Promise.all(testCasesRunnerPromise);

            console.log("testCasesRunnerResults", testCasesRunnerResults);

            const output = matchTestCasesWithResults(data.problem.testcases, testCasesRunnerResults);

            console.log("output", output);

            await updateSubmission(data.submissionId, "completed", output || {});
            
            // Check if all testcases were AC
            const allAC = output ? Object.values(output).every(tc => tc.verdict === "AC") : false;
            const problemId = (data.problem as any)._id || data.problem.id;
            await updateProblemStats(problemId, allAC);
        } catch (error) {
            logger.error(`Evaluation job failed: ${job}`, error);
            return;
        }
    }, {
        connection: createNewRedisConnection(),
    });

    worker.on("error", (error) => {
        logger.error(`Evaluation worker error: ${error}`);
    });

    worker.on("completed", (job) => {
        logger.info(`Evaluation job completed: ${job}`);
    });

    worker.on("failed", (job, err) => {
        logger.error(`Evaluation job failed: ${job}, error: ${err}`);
    });

    return worker;
}

export default async function initEvaluationWorker() {
    await setupEvaluationWorker();
}