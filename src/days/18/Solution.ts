import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2} from "../../types/Dict";
import {Arr} from "../../types/Arr";

const DIRS: { [key: string]: Vector2 } = {"U": [0, -1], "D": [0, 1], "L": [-1, 0], "R": [1, 0]}

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "62";
    }

    getSecondExampleSolution(): string {
        return "952408144115";
    }

    solveFirst(input: Str): string {
        let commands = input.parseRows().map(s => {
            let [dir, steps, _] = s.toString().split(" ")
            return [dir, parseInt(steps)] as [string, number]
        }).toArray()

        return this.solveDay(commands).toString()
    }

    solveSecond(input: Str): string {
        let commands = input.parseRows().map(s => {
            let [, , color] = s.toString().split(" ")
            let steps: number = parseInt(color.slice(2, 7), 16)
            let dirIndex = parseInt(color.charAt(7))
            let dirSymbol: string = ["R", "D", "L", "U"][dirIndex]
            return [dirSymbol, steps] as [string, number]
        }).toArray()

        return this.solveDay(commands).toString();
    }

    private solveDay(commands: [string, number][]): number {
        let borderLength = 0
        let points: Arr<Vector2> = new Arr([[0, 0]])
        for (let [dirSym, steps] of commands) {
            let [vx, vy] = DIRS[dirSym]
            borderLength += steps
            let [lastX, lastY] = points.last()
            points.push([lastX + vx * steps, lastY + vy * steps])
        }

        let numberOfPoints = points.length()

        // Calculate area via polygon formula
        let area = 0
        // [0, 0] is contained twice!
        for (let i = 0; i < numberOfPoints - 1; i++) {
            area += (points.get(i)[0] * (points.get(i + 1)[1]) - points.get(i)[1] * points.get(i + 1)[0]) / 2
        }

        // Problem: this formula would give a nxm rectangle an area of just (n-1)*(m-1) instead of nxm
        // So for every rectangle involved we add:
        // n*m - (n-1)*(m-1)
        // = m + n - 1
        // = (2*(m-1) + 2*(n-1)) / 2 + 1
        // = borderLength / 2 + 1
        return area + borderLength / 2 + 1
    }
}