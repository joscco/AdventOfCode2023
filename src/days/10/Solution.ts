import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr, NumArr} from "../../types/Arr";
import {add} from "../../types/MathUtils";
import {Vector2} from "../../types/Dict";
import {ORDER_NATURAL} from "../../types/General";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "8";
    }

    getSecondExampleSolution(): string {
        return "10";
    }

    solveFirst(input: Str): string {
        let pipes = input.parseRows()
            .map(val => val.toString())
            .map(row => row.split(""))
            .toArray()

        let startIndex = this.getFirstIndexWith(pipes, val => val === "S")!
        return ((this.findLoop(startIndex, pipes).length - 1) / 2).toString()

    }

    solveSecond(input: Str): string {
        let pipes = input.parseRows()
            .map(val => val.toString())
            .map(row => row.split(""))
            .toArray()

        let startIndex = this.getFirstIndexWith(pipes, val => val === "S")!
        let loop = this.findLoop(startIndex, pipes)

        let [minX, maxX] = new Arr(loop.map(([i, _]) => i[0])).minMax(ORDER_NATURAL)
        let [minY, maxY] = new Arr(loop.map(([i, _]) => i[1])).minMax(ORDER_NATURAL)
        let numberOfInners = 0

        for (let y = minY + 2; y < maxY; y++) {
            for (let x = minX + 1; x < maxX; x++) {
                if (this.isInner(loop, [x, y])) {
                    numberOfInners++
                }
            }

        }

        return numberOfInners.toString()
    }

    private isInner(loop: [Vector2, string][], index: Vector2) {
        let isNotInLoop = loop.every(([i, _]) => !(i[0] === index[0] && i[1] === index[1]))
        let foundMatches = loop.filter(([i, _]) => (i[0] >= index[0] && i[1] >= index[1] && i[1] - index[1] === i[0] - index[0]))
            .map(([i, val]) => this.getAmountForVal(val))
            .reduce((a, b) => a + b, 0)
        let foundMatchesOdd = foundMatches % 2 === 1

        return isNotInLoop && foundMatchesOdd
    }

    private findLoop(startIndex: Vector2, pipes: string[][]): [Vector2, string][] {
        let neighbors: (Vector2 | undefined)[] = this.getNeighborIndices(startIndex).toArray()
        for (let neighbor of neighbors) {
            let path = [[startIndex, "S"]] as [Vector2, string][]
            let prev = startIndex
            let current = neighbor
            let val = pipes[current![1]][current![0]]
            path.push([current!, val])
            while (current && val != "S") {
                let tmp = current
                current = this.getNextIndexForChar(val, prev, current)
                prev = tmp
                if (current) {
                    val = pipes[current[1]][current[0]]
                    path.push([current, val] as [Vector2, string])
                }
            }
            if (current) {
                return path
            }
        }

        return []
    }

    private getNeighborIndices(index: Vector2): Arr<Vector2> {
        return new Arr<Vector2>([[-1, 0], [1, 0], [0, -1], [0, 1]])
            .map(offset => add(offset, index))
    }

    private getNextIndexForChar(val: string, prevIndex: Vector2, thisIndex: Vector2): Vector2 | undefined {
        switch (val) {
            case "|":
                if (prevIndex[1] < thisIndex[1]) {
                    return add(thisIndex, [0, 1])
                } else if (prevIndex[1] > thisIndex[1]) {
                    return add(thisIndex, [0, -1])
                }
                break
            case "-":
                if (prevIndex[0] < thisIndex[0]) {
                    return add(thisIndex, [1, 0])
                } else if (prevIndex[0] > thisIndex[0]) {
                    return add(thisIndex, [-1, 0])
                }
                break
            case "L":
                if (prevIndex[1] < thisIndex[1]) {
                    return add(thisIndex, [1, 0])
                } else if (prevIndex[0] > thisIndex[0]) {
                    return add(thisIndex, [0, -1])
                }
                break
            case "J":
                if (prevIndex[1] < thisIndex[1]) {
                    return add(thisIndex, [-1, 0])
                } else if (prevIndex[0] < thisIndex[0]) {
                    return add(thisIndex, [0, -1])
                }
                break
            case "7":
                if (prevIndex[1] > thisIndex[1]) {
                    return add(thisIndex, [-1, 0])
                } else if (prevIndex[0] < thisIndex[0]) {
                    return add(thisIndex, [0, 1])
                }

                break
            case "F":
                if (prevIndex[1] > thisIndex[1]) {
                    return add(thisIndex, [1, 0])
                } else if (prevIndex[0] > thisIndex[0]) {
                    return add(thisIndex, [0, 1])
                }

                break
        }

        return undefined
    }

    private getFirstIndexWith(pipes: string[][], lambda: (val: string, i: Vector2) => boolean) {
        for (let rowI = 0; rowI < pipes.length; rowI++) {
            let row = pipes[rowI]
            for (let colI = 0; colI < row.length; colI++) {
                let val = row[colI]
                let index = [colI, rowI] as Vector2
                if (lambda(val, index)) {
                    return index
                }
            }
        }
        return undefined
    }

    private getAmountForVal(val: string): number{
        switch (val) {
            case "|":
            case "-":
            case "J":
            case "F":
                return 1
            case "L":
            case "7":
                return 0
        }
        return 0
    }
}