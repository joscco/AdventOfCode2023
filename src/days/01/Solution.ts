import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";

const DIGIT_MAP: Map<string, string> = new Map([
    ["one", "1"],
    ["two", "2"],
    ["three", "3"],
    ["four", "4"],
    ["five", "5"],
    ["six", "6"],
    ["seven", "7"],
    ["eight", "8"],
    ["nine", "9"]
])

const PURE_DIGIT_REGEX = /([1-9])/g
const DIGIT_REGEX = /([1-9]|one|two|three|four|five|six|seven|eight|nine)/g

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "142";
    }

    getSecondExampleSolution(): string {
        return "281";
    }

    solveFirst(input: Str): string {
        return input.parseRows()
            .map(row => row.match(PURE_DIGIT_REGEX))
            .map(matches => Str.concat(matches.first(), matches.last()).parseInt())
            .toNumArr()
            .add()
            .toString();
    }

    solveSecond(input: Str): string {
        return input.parseRows()
            .map(row => row.match(DIGIT_REGEX))
            .map(matches => matches.map(match => this.replaceDigit(match.toString())))
            .map(matches => Str.concat(matches.first(), matches.last()).parseInt())
            .toNumArr()
            .add()
            .toString();
    }

    private replaceDigit(match: string): Str {
        let val = DIGIT_MAP.has(match) ? DIGIT_MAP.get(match) ?? '' : match;
        return new Str(val)
    }
}