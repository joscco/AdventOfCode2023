import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr, NumArr} from "../../types/Arr";

export class Solution extends AbstractSolution {

    cache: Map<string, number> = new Map()

    getFirstExampleSolution(): string {
        return "21";
    }

    getSecondExampleSolution(): string {
        return "525152";
    }

    solveFirst(input: Str): string {
        return input.parseRows()
            .map(row => {
                let split = row.split(" ");
                return [split.get(0), split.get(1).split(",").map(v => v.parseInt())] as [Str, Arr<number>]
            })
            .map(arr => this.countPossibilities(arr[0], arr[1].toNumArr()))
            .toNumArr()
            .add()
            .toString()
    }

    solveSecond(input: Str): string {
        return input.parseRows()
            .map(row => {
                let split = row.split(" ").map((str, i) => this.repeat(str, 5, i === 0 ? "?" : ","));
                return [split.get(0), split.get(1).split(",").map(v => v.parseInt())] as [Str, Arr<number>]
            })
            .map(arr => this.countPossibilities(arr[0], arr[1].toNumArr()))
            .toNumArr()
            .add()
            .toString()

        // 4573476551615 too high
    }

    private countPossibilities(config: Str, nums: NumArr): number {

        if (config.toString() === "") {
            return nums.length() === 0 ? 1 : 0
        }

        if (nums.length() === 0) {
            return config.contains("#") ? 0 : 1
        }

        let key = config.toString() + nums.toArray()

        if (this.cache.has(key)) {
            return this.cache.get(key)!
        }

        let result = 0

        if (config.charAt(0) != "#") {
            // ? or ., add point possibilities

            result += this.countPossibilities(config.dropFirstChars(1), nums)
        }

        if (config.charAt(0) != ".") {
            // ? or #, add hash possibilities
            let firstNumber = nums.first()

            if (firstNumber <= config.length()
                && !config.slice(1, firstNumber).contains(".")
                && ((firstNumber === config.length()) || (config.charAt(firstNumber) !== "#"))) {
                // Think of that +1 to include the next ? or . !
                result += this.countPossibilities(config.dropFirstChars(firstNumber + 1), nums.dropFirst(1).toNumArr())
            }
        }

        this.cache.set(key, result)

        return result
    }

    private repeat(str: Str, number: number, join: string): Str {
        return new Str(new Array(number).fill(str.toString()).join(join))
    }
}