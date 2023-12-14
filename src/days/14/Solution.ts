import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "136";
    }

    getSecondExampleSolution(): string {
        return "64";
    }

    solveFirst(input: Str): string {
        let field = input.parseRows()
            .toArray()
            .map(row => row.split("").toArray().map(s => s.toString()))

        field = this.tilt(field)

        return this.getFieldValue(field);
    }

    private getFieldValue(field: string[][]) {
        let result = 0
        for (let col = 0; col < field[0].length; col++) {
            result += this.getRowValue(field.reduce((prev, row) => [...prev, row[col]], []))
        }
        return result.toString()
    }

    private getRowValue(arr: string[]) {
        let result = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "O") {
                result += arr.length - i
            }
        }
        return result
    }

    solveSecond(input: Str): string {
        // Let's hope this is periodic...
        let field = input.parseRows()
            .toArray()
            .map(row => row.split("").map(s => s.toString()).toArray())

        let cache = new Set(this.print(field))
        let history = [this.print(field)]
        let history2 = [field]
        let iteration = 0

        while (true) {
            field = this.cycle(field)
            iteration++
            if (cache.has(this.print(field))) {
                break
            }

            let printed = this.print(field)

            cache.add(printed)
            history.push(printed)
            history2.push(field)
        }

        let first = history.indexOf(this.print(field))
        console.log("Iteration: ", first, iteration)

        field = history2[(1000000000 - first) % (iteration - first) + first]

        return this.getFieldValue(field)

    }

    private print(field: string[][]) {
        return field.map(row => row.join("")).join("\n")
    }

    private cycle(field: string[][]) {
        for (let _ = 0; _ < 4; _++) {
            field = this.tilt(field)
            field = this.turnClockwise(field)
        }

        return field
    }

    private turnClockwise(field: string[][]) {
        let rows = field.length
        let cols = field[0].length
        let result: string[][] = [...Array(cols).keys()].map(_ => [])

        for (let row = rows - 1; row >= 0; row--) {
            let rowVals = field[row]
            for (let col = 0; col < cols; col++) {
                result[col].push(rowVals[col])
            }
        }

        return result
    }

    private tilt(field: string[][]) {
        let rows = field.length
        let cols = field[0].length;
        let result: string[][] = [...Array(rows).keys()].map(_ => [])

        for (let i = 0; i < cols; i++) {
            let column = field.map(row => row[i])
            let orderedColumn = this.orderColumn(column)
            for (let j = 0; j < rows; j++) {
                result[j].push(orderedColumn[j])
            }
        }
        return result
    }

    private orderColumn(column: string[]): string[] {
        let result = []
        let rocks: string[] = []
        let frees: string[] = []
        for (let i = 0; i<column.length; i++) {
            if (column[i] === "#") {
                result.push(...rocks)
                result.push(...frees)
                result.push("#")

                rocks = []
                frees = []
            } else if (column[i] === "O") {
                rocks.push("O")
            } else {
                frees.push(".")
            }
        }

        result.push(...rocks)
        result.push(...frees)

        return result
    }
}