import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2} from "../../types/Dict";
import {mod} from "../../types/MathUtils";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "16";
    }

    getSecondExampleSolution(): string {
        return "668697";
    }

    solveFirst(input: Str, test: boolean): string {
        let steps = test ? 6 : 64;
        let field = input.parseRows()
            .map(row => row.toString().split(""))
            .toArray();

        return this.doSolve(field, steps)
    }

    solveSecond(input: Str, test: boolean): string {
        let field = input.parseRows()
            .map(row => row.toString().split(""))
            .toArray();

        let n = field.length

        console.log(field.length, field[0].length)
        console.log(Math.floor(26501365 / n), mod(26501365, n))
        console.log(mod(26501365, n), this.doSolve(field, mod(26501365, n)))
        console.log(mod(26501365, n) + n, this.doSolve(field, mod(26501365, n) + n))
        // console.log(mod(26501365, n) + 2 * n, this.doSolve(field, mod(26501365, n) + 2 * n))
        // console.log(mod(26501365, n) + 3 * n, this.doSolve(field, mod(26501365, n) + 3 * n))

        // Quadratic approximation works
        console.log(15287 * 202300 * 202300 + 15388 * 202300 + 3874)

        return "nah"
    }

    private doSolve(field: string[][], steps: number) {
        let startIndex: Vector2 = [-1, -1];
        outer:
            for (let row = 0; row < field.length; row++) {
                for (let col = 0; col < field[0].length; col++) {
                    if (field[row][col] === "S") {
                        startIndex = [row, col]
                        break outer
                    }
                }
            }

        let takenIndices: Set<string> = new Set()
        takenIndices.add(this.indexToString(startIndex))
        for (let i = 0; i < steps; i++) {
            takenIndices = new Set([...takenIndices.values()].flatMap(index => this.getNeighbors(field, index)))
        }

        return takenIndices.size.toString()
    }

    private indexToString(index: Vector2): string {
        return index[0] + "_" + index[1]
    }

    private getNeighbors(field: string[][], index: string): string[] {
        let [fLength, fWidth] = [field.length, field[0].length]
        let [row, col]: number[] = index.split("_").map(s => parseInt(s))
        let result = []
        for (let [nrow, ncol] of [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]) {
            if (field[mod(nrow, fLength)][mod(ncol, fWidth)] != "#") {
                result.push(this.indexToString([nrow, ncol]))
            }
        }
        return result
    }
}