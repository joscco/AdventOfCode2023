import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr} from "../../types/Arr";
import {range_lcm} from "../../types/MathUtils";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "6";
    }

    getSecondExampleSolution(): string {
        return "6";
    }

    solveFirst(input: Str): string {
        let lines = input.parseRows();
        let firstRow = lines.get(0)
        let dict = this.buildDict(lines.filter((line, index) => index > 1))
        return this.findFastestWayFrom("AAA", "ZZZ", firstRow, dict).toString()
    }

    solveSecond(input: Str): string {
        let lines = input.parseRows();
        let firstRow = lines.get(0)
        let dict = this.buildDict(lines.filter((line, index) => index > 1))
        let periods = new Arr([...dict.keys()])
            .filter(key => key.charAt(2) === "A")
            .map(starter => this.findSmallestPeriod(starter, firstRow, dict))

        console.log(firstRow.length(), periods.map(period => period % firstRow.length()))
        return range_lcm(periods.toArray()).toString()
    }

    private buildDict(strArr: Arr<Str>): Map<string, [string, string]> {
        let dict = new Map();
        for (let [start, left, right] of strArr.map(row => {
            let matches = row.match(/([0-9A-Z]+) = \(([0-9A-Z]+), ([0-9A-Z]+)\)/)!
            return [matches[1], matches[2], matches[3]]
        }).toArray()) {
            dict.set(start, [left, right])
        }
        return dict
    }

    private findFastestWayFrom(start: string, end: string, command: Str, dict: Map<string, [string, string]>): number {
        let current = start
        let steps = 0
        let commandIndex = 0
        while (current != end) {
            let currentLeft = command.charAt(commandIndex) === "L"
            current = currentLeft ? dict.get(current)![0] : dict.get(current)![1]
            commandIndex = (commandIndex + 1) % command.length()
            steps++
        }

        return steps
    }

    private findSmallestPeriod(starter: string, command: Str, dict: Map<string, [string, string]>) {
        let current = starter
        let steps = 0
        let commandIndex = 0
        let visited = new Set<string>()
        while (!((current.charAt(2) === "Z") && visited.has(current + "_" + commandIndex))) {
            let isLeft = command.charAt(commandIndex) === "L"
            current = isLeft ? dict.get(current)![0] : dict.get(current)![1]
            commandIndex = (commandIndex + 1) % command.length()
            // Do not include A Start here!
            visited.add(current + "_" + commandIndex)
            steps++
        }

        console.log(visited)

        return steps
    }
}