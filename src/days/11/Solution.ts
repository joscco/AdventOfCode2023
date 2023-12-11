import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr, Arr2D} from "../../types/Arr";
import {Vector2} from "../../types/Dict";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "374";
    }

    getSecondExampleSolution(): string {
        // Test results were for factor 100 only
        // For factor 1_000_000 the result would be...
        return "82000210";
    }

    solveFirst(input: Str): string {
        return this.solveDay(input, 2);
    }

    solveSecond(input: Str): string {
        return this.solveDay(input, 1000000);
    }

    private solveDay(input: Str, factor: number) {
        let field = Arr2D.from(input.parseRows()
            .map(row => row.split("").map(str => str.toString())))

        let emptyRowIndices = field.map((row, i) => [row, i] as [Arr<string>, number])
            .filter(([row, _]) => !row.contains("#"))
            .map(([_, i]) => i)

        let emptyColIndices = new Arr([...Array(field.get(0).length()).keys()])
            .filter(colI => field.all(row => row.get(colI) === "."))

        let galaxyIndices = field.filter2D(field => field === "#")
            .map(([val, i]) => i)

        let result = 0
        for (let a = 0; a < galaxyIndices.length(); a++) {
            for (let b = a + 1; b < galaxyIndices.length(); b++) {
                let indA = galaxyIndices.get(a)
                let indB = galaxyIndices.get(b)
                let dist = this.getShortestPath(indA, indB, emptyRowIndices, emptyColIndices, factor)
                result += dist
            }
        }

        return result.toString()
    }

    private getShortestPath(a: Vector2, b: Vector2, emptyRows: Arr<number>, emptyCols: Arr<number>, factor: number) {
        let emptyColsIncluded = this.valuesBetween(emptyCols, a[0], b[0])
        let emptyRowsIncluded = this.valuesBetween(emptyRows, a[1], b[1])
        return Math.abs(a[0] - b[0]) + emptyColsIncluded * (factor - 1)
            + Math.abs(a[1] - b[1]) + emptyRowsIncluded * (factor - 1);
    }

    private valuesBetween(values: Arr<number>, a: number, b: number): number {
        if (a > b) {
            return this.valuesBetween(values, b, a)
        }

        return values.filter(num => num > a && num < b).length()

    }
}