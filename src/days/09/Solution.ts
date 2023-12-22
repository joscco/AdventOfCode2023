import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr} from "../../types/Arr";
import {range_lcm} from "../../types/MathUtils";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "114";
    }

    getSecondExampleSolution(): string {
        return "2";
    }

    solveFirst(input: Str): string {
        return input.parseRows()
            .map(row => this.findFollowing(row.split(" ").map(num => num.parseInt())))
            .toNumArr()
            .sum()
            .toString()
    }

    solveSecond(input: Str): string {
        return input.parseRows()
            .map(row => this.findPrevious(row.split(" ").map(num => num.parseInt())))
            .toNumArr()
            .sum()
            .toString()
    }

    private findFollowing(numberArr: Arr<number>): number {
        if (numberArr.all(el => el === 0)) {
            return 0
        }

        let differences = numberArr.slideWindow(2).map(arr => arr.get(1) - arr.get(0))

        return numberArr.last() + this.findFollowing(differences)
    }

    private findPrevious(numberArr: Arr<number>): number {
        if (numberArr.all(el => el === 0)) {
            return 0
        }

        let differences = numberArr.slideWindow(2).map(arr => arr.get(1) - arr.get(0))

        return numberArr.first() - this.findPrevious(differences)
    }
}