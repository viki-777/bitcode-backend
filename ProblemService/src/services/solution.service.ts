import { CreateSolutionDTO } from "../dto/solution.dto";
import { SolutionRepository } from "../repositories/solution.repository";
import { Types } from "mongoose";

const solutionRepository = new SolutionRepository();

export async function createSolutionService(solutionDto: CreateSolutionDTO) {
    const data = {
        ...solutionDto,
        problemId: new Types.ObjectId(solutionDto.problemId)
    } as any;
    const solution = await solutionRepository.create(data);
    return solution;
}

export async function getSolutionsByProblemIdService(problemId: string) {
    const solutions = await solutionRepository.findByProblemId(problemId);
    return solutions;
}
