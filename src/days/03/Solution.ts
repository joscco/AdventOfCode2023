import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2} from "../../types/Dict";
import {Arr, NumArr} from "../../types/Arr";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "4361";
    }

    getSecondExampleSolution(): string {
        return "467835";
    }

    solveFirst(input: Str): string {
        let specialCharIndices = input.parseRows()
            .flatMap((row, rowIndex) => row.split("")
                .map((char, colIndex) => [char, [rowIndex, colIndex]] as [Str, Vector2]))
            .filter(entry => /[^\d.]/.test(entry[0].toString()))

        return input.parseRows()
            .flatMap((row, rowIndex) => this.getNumbersFromRow(row, rowIndex))
            .filter(numberEntry => this.hasNeighborIndex(numberEntry, specialCharIndices.map(v => v[1])))
            .map(entry => entry[0])
            .toNumArr()
            .add()
            .toString();
    }

    solveSecond(input: Str): string {
        let stars = input.parseRows()
            .flatMap((row, rowIndex) => row.split("")
                .map((char, colIndex) => [char, [rowIndex, colIndex]] as [Str, Vector2]))
            .filter(entry => "*" === entry[0].toString())

        let numberList = input.parseRows()
            .flatMap((row, rowIndex) => this.getNumbersFromRow(row, rowIndex))

        return stars
            .map(star => numberList.filter(numberEntry => this.hasNeighborIndex(numberEntry, new Arr([star[1]])))
                    .map(val => val[0]))
            .filter(list => list.length() == 2)
            .map(arr => arr.get(0) * arr.get(1))
            .toNumArr()
            .add()
            .toString();
    }

    private getNumbersFromRow(row: Str, rowIndex: number): Arr<[number, Vector2, Vector2]> {
        return new Arr(Array.from(row.matchAll(/\d+/g))
            .map(match => [
                parseInt(match.toString()),
                [rowIndex, match.index!],
                [rowIndex, match.index! + match.toString().length - 1]
            ]))
    }

    private hasNeighborIndex(numberEntry: [number, Vector2, Vector2], indicesToCheck: Arr<Vector2>) {
        let neighborIndices = this.getNeighborIndicesFor(numberEntry[1], numberEntry[2]);
        return indicesToCheck.some(index => neighborIndices
            .some(other => other[0] === index[0] && other[1] === index[1]))
    }

    private getNeighborIndicesFor(a: Vector2, b: Vector2): Arr<Vector2> {
        return new Arr<Vector2>([[a[0], a[1] - 1], [a[0], b[1] + 1]])
            .pushArr(Arr.zip(new NumArr([a[0] - 1]), NumArr.interval(a[1] - 1, b[1] + 1)))
            .pushArr(Arr.zip(new NumArr([a[0] + 1]), NumArr.interval(a[1] - 1, b[1] + 1)))
    }
}