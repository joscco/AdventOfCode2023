import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr} from "../../types/Arr";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "405";
    }

    getSecondExampleSolution(): string {
        return "400";
    }

    solveFirst(input: Str): string {
        return input.parseRows()
            .map(row => row.toString())
            .groupSplit("")
            .map(group => this.findReflectionValue(group))
            .toNumArr()
            .add()
            .toString()
    }

    solveSecond(input: Str): string {
        return input.parseRows()
            .map(row => row.toString())
            .groupSplit("")
            .map(group => this.findPseudoReflectionValue(group))
            .toNumArr()
            .add()
            .toString()
    }

    private findReflectionValue(group: Arr<string>): number {
        // console.log(group)
        for (let row = 0; row < group.length(); row++) {
            if (this.isReflectiveRow(group, row)) {
                return (row + 1) * 100
            }
        }

        for (let col = 0; col < group.get(0).length; col++) {
            if (this.isReflectiveCol(group, col)) {
                return col + 1
            }
        }

        throw new Error("No Reflection Found for group: " + group)
    }

    private findPseudoReflectionValue(group: Arr<string>): number {
        for (let row = 0; row < group.length(); row++) {
            if (this.isPseudoReflectiveRow(group, row)) {
                return (row + 1) * 100
            }
        }

        for (let col = 0; col < group.get(0).length; col++) {
            if (this.isPseudoReflectiveCol(group, col)) {
                return col + 1
            }
        }

        throw new Error("No Reflection Found for group: " + group)
    }

    private isReflectiveRow(group: Arr<string>, row: number) {
        if (row === group.length() - 1) {
            return false
        }
        for (let i = 0; i <= Math.min(row, group.length() - row - 2); i++) {
            if (group.get(row - i) !== group.get(row + 1 + i)) {
                return false
            }
        }
        return true
    }

    private isReflectiveCol(group: Arr<string>, col: number) {
        if (col === group.get(0).length - 1) {
            return false
        }
        for (let i = 0; i <= Math.min(col, group.get(0).length - col - 2); i++) {
            for (let j = 0; j < group.length(); j++) {
                if (group.get(j)[col - i] !== group.get(j)[col + 1 + i]) {
                    return false
                }
            }
        }
        return true
    }

    private isPseudoReflectiveRow(group: Arr<string>, row: number) {
        if (row === group.length() - 1) {
            return false
        }

        let differences = 0
        for (let i = 0; i <= Math.min(row, group.length() - row - 2); i++) {
            differences += this.countDifferences(group.get(row - i), group.get(row + 1 + i))
        }
        return differences === 1
    }

    private isPseudoReflectiveCol(group: Arr<string>, col: number) {
        if (col === group.get(0).length - 1) {
            return false
        }

        let differences = 0
        for (let i = 0; i <= Math.min(col, group.get(0).length - col - 2); i++) {
            for (let j = 0; j < group.length(); j++) {
                if (group.get(j)[col - i] !== group.get(j)[col + 1 + i]) {
                    differences += 1
                }
            }
        }
        return differences === 1
    }

    private countDifferences(a: string, b: string): number {
        let differences = 0;
        for (let i = 0; i < a.length; i++) {
            if (a.charAt(i) !== b.charAt(i)) {
                differences++
            }
        }
        return differences
    }
}