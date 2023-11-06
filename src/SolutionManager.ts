import {AbstractSolution} from "./types/AbstractSolution";
import {readFileSync} from "fs";

class SolutionManager {
    async getSolution(dayNumber: string): Promise<AbstractSolution> {
        const solutionFolderPath = `src/days/${dayNumber}`;
        let input = readFileSync(`${solutionFolderPath}/input.txt`, "utf-8");
        let exampleInput = readFileSync(`${solutionFolderPath}/exampleInput.txt`, "utf-8");

        // const constructor: { new: (input: string, exampleInput: string) => AbstractSolution }
        const classImportWrapper: {Solution: any} = await import(
            `./days/${dayNumber}/Solution`
            );

        return new (classImportWrapper.Solution.prototype.constructor)(input, exampleInput);
    }
}

export default new SolutionManager()