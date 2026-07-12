import axios from "axios";
import { serverConfig } from "../config";
import logger from "../config/logger.config";

export async function notifyUserActivity(userId: string) {
    try {
        const url = `${serverConfig.USER_SERVICE}/users/${userId}/activity`;
        await axios.post(url, {});
        logger.info('User activity recorded', { userId });
    } catch (error: any) {
        logger.error(`Error notifying user activity: ${error.message}`, error.response?.data);
    }
}

export async function notifyUserStreak(userId: string) {
    try {
        const url = `${serverConfig.USER_SERVICE}/users/${userId}/streak`;
        await axios.post(url, {});
        logger.info('User streak updated', { userId });
    } catch (error: any) {
        logger.error(`Error notifying user streak: ${error.message}`, error.response?.data);
    }
}

export async function notifyUserSolved(userId: string, problemId: string, difficulty: string) {
    try {
        const url = `${serverConfig.USER_SERVICE}/users/${userId}/solved`;
        await axios.post(url, { problemId, difficulty });
        logger.info('User solved status updated', { userId, problemId, difficulty });
    } catch (error: any) {
        logger.error(`Error notifying user solved: ${error.message}`, error.response?.data);
    }
}
