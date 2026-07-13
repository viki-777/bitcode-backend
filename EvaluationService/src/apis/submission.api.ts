import axios from "axios";
import { serverConfig } from "../config";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";

export async function updateSubmission(submissionId: string, status: string, output: Record<string, any>) {
    try {
        console.log('output', output);
        const url = `${serverConfig.SUBMISSION_SERVICE}/submissions/${submissionId}/status`;

        logger.info(`Getting problem by ID`, { url });

        const response = await axios.patch(url, {
            status,
            submissionData: output,
        });

        if(response.status !== 200) {
            throw new InternalServerError("Failed to update submission status");
        }

        console.log("Submission updated successfully", response.data);
        return;
    } catch (error: any) {
        logger.error(`Error updating submission status: ${error.message}`, error.response?.data);
        return null;
    }
}

export async function updateProblemStats(problemId: string, allAC: boolean) {
    try {
        const url = `${serverConfig.PROBLEM_SERVICE}/problems/${problemId}/stats`;
        const payload = {
            totalSubmissions: 1,
            ...(allAC ? { totalAccepted: 1 } : {})
        };

        const response = await axios.patch(url, payload);

        if(response.status !== 200) {
            throw new InternalServerError("Failed to update problem stats");
        }

        console.log("Problem stats updated successfully", response.data);
    } catch (error: any) {
        logger.error(`Error updating problem stats: ${error.message}`, error.response?.data);
    }
}