import axios from "axios";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";

// Updates the submission status and execution result in the Submission Service.
export async function updateSubmission(submissionId: string, status: string, output: Record<string, any>) {
    try {
        console.log('output', output);

        // Submission Service endpoint.
        const url = `${serverConfig.SUBMISSION_SERVICE}/submissions/${submissionId}/status`;

        logger.info(`Getting problem by ID`, { url });

        // Send updated submission data.
        const response = await axios.patch(url, {
            status,
            submissionData: output,
        });

        // Ensure the request completed successfully.
        if(response.status !== 200) {
            throw new InternalServerError("Failed to update submission status");
        }

        console.log("Submission updated successfully", response.data);
        return;
    } catch (error: any) {
        // Log update failure.
        logger.error(`Error updating submission status: ${error.message}`, error.response?.data);
        return null;
    }
}

// Updates submission statistics for a problem.
export async function updateProblemStats(problemId: string, allAC: boolean) {
    try {
        // Problem Service endpoint.
        const url = `${serverConfig.PROBLEM_SERVICE}/problems/${problemId}/stats`;

        // Increment submission count and accepted count if applicable.
        const payload = {
            totalSubmissions: 1,
            ...(allAC ? { totalAccepted: 1 } : {})
        };

        // Send statistics update.
        const response = await axios.patch(url, payload);

        // Ensure the request completed successfully.
        if(response.status !== 200) {
            throw new InternalServerError("Failed to update problem stats");
        }

        console.log("Problem stats updated successfully", response.data);
    } catch (error: any) {
        // Log update failure.
        logger.error(`Error updating problem stats: ${error.message}`, error.response?.data);
    }
}