import {AbstractSolution} from "./types/AbstractSolution";
import {readFileSync} from "fs";
import {Str} from "./types/Str";

class SolutionManager {
    async getSolution(dayNumber: string): Promise<AbstractSolution> {
        const solutionFolderPath = `src/days/${dayNumber}`;
        let input = readFileSync(`${solutionFolderPath}/input.txt`, "utf-8");
        let exampleInput = readFileSync(`${solutionFolderPath}/exampleInput.txt`, "utf-8");
        let exampleInput2 = readFileSync(`${solutionFolderPath}/exampleInput2.txt`, "utf-8");

        const classImportWrapper: { Solution: any } = await import(
            `./days/${dayNumber}/Solution`
            );

        return new (classImportWrapper.Solution.prototype.constructor)(new Str(input), new Str(exampleInput), new Str(exampleInput2));
    }
}

export default new SolutionManager()