import { CPP_IMAGE, PYTHON_IMAGE } from "../utils/constants";

export const LANGUAGE_CONFIG = {
    python: {
        timeout: 10000,
        imageName: PYTHON_IMAGE,
    },
    cpp: {
        timeout: 12000,
        imageName: CPP_IMAGE,
    }
}