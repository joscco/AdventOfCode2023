import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";

export type MapInterval = {
    start: number,
    mappedStart: number
    width: number,
}

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "288";
    }

    getSecondExampleSolution(): string {
        return "71503";
    }

    solveFirst(input: Str): string {
        let rows = input.parseRows();
        let times = this.parseRowToNumbers(rows.get(0));
        let bests = this.parseRowToNumbers(rows.get(1))

        let result = 1
        for (let i = 0; i < times.length(); i++) {
            let time = times.get(i)
            let best = bests.get(i)
            let rad = Math.sqrt(time * time / 4 - best)
            result *= this.getNumberOfIntegersStrictlyBetween(time / 2 - rad, time / 2 + rad)
        }

        return result.toString()
    }

    solveSecond(input: Str): string {
        let rows = input.parseRows();
        let time = this.parseRowToNumber(rows.get(0))
        let best = this.parseRowToNumber(rows.get(1))
        let rad = Math.sqrt(time * time / 4 - best)

        return this.getNumberOfIntegersStrictlyBetween(time / 2 - rad, time / 2 + rad)
            .toString()
    }

    private parseRowToNumbers(row: Str) {
        return row.split(/\s+/)
            .getElementsWith((_, i) => i > 0)
            .map(el => el.trim().parseInt())
            .toNumArr();
    }

    private parseRowToNumber(row: Str) {
        return parseInt(row.match(/\d/g)?.reduce((a, b) => a + b)!);
    }

    private getNumberOfIntegersStrictlyBetween(a: number, b: number) {
        let a_new = Math.floor(a) === a ? a + 1 : Math.ceil(a)
        let b_new = Math.floor(b) === b ? b - 1 : Math.floor(b)
        return b_new - a_new + 1
    }
}