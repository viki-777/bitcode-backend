import BaseRepository from "./base.repository";
import Solution from "../models/solution";
import { ISolution } from "../types/solution.types";

export class SolutionRepository extends BaseRepository<ISolution> {
    constructor() {
        super(Solution);
    }

    async findByProblemId(problemId: string) {
        return await Solution.find({ problemId }).sort({ upvotes: -1, createdAt: -1 });
    }
}
