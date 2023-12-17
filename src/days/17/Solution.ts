import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2} from "../../types/Dict";
import {Heap} from "../../types/Heap";

// length, x, y, directionX, directionY, stepNumberInDirection
export type Node = [number, number, number, number, number]
export type NodeWithLength = [number, number, number, number, number, number]

const UP: Vector2 = [0, -1]
const DOWN: Vector2 = [0, 1]
const LEFT: Vector2 = [-1, 0]
const RIGHT: Vector2 = [1, 0]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "102";
    }

    getSecondExampleSolution(): string {
        return "94";
    }

    solveFirst(input: Str): string {
        let fields = this.parseField(input)
        let path = this.findCheapestValidWayFromTo(fields, 0, 3, [0, 0], [fields[0].length - 1, fields.length - 1])
        return path.toString()
    }

    solveSecond(input: Str): string {
        let fields = this.parseField(input)
        let path = this.findCheapestValidWayFromTo(fields, 4, 10, [0, 0], [fields[0].length - 1, fields.length - 1])
        return path.toString()
    }

    private parseField(input: Str): number[][] {
        return input.parseRows().toArray()
            .map(row => row.toString().split("").map(s => parseInt(s)));
    }

    private findCheapestValidWayFromTo(fields: number[][], minStraight: number, maxStraight: number, start: Vector2, end: Vector2): number {
        let visited: Set<string> = new Set()
        let nextNodes: Heap<NodeWithLength> = new Heap((a, b) => b[0] - a[0])
        nextNodes.insert([0, ...start, 0, 0, 0])
        let fieldWidth = fields[0].length
        let fieldHeight = fields.length

        while (nextNodes.count !== 0) {
            let curNode = nextNodes.remove()!
            let [len, x, y, vx, vy, step] = curNode
            let nodeKey = this.nodeToString([x, y, vx, vy, step])

            if (this.vector2Equals(end, [x, y])) {
                return len
            }

            if (visited.has(nodeKey)) {
                continue
            }

            visited.add(nodeKey)

            // Straight steps
            if (step < maxStraight && !this.vector2Equals([vx, vy], [0, 0])) {
                let nextX = x + vx
                let nextY = y + vy

                if (0 <= nextX && (nextX < fieldWidth) && (0 <= nextY) && (nextY < fieldHeight)) {
                    nextNodes.insert([len + fields[nextY][nextX], nextX, nextY, vx, vy, step + 1])
                }
            }

            // Curves
            if (step >= minStraight || this.vector2Equals([vx, vy], [0, 0])) {
                for (let newDir of [UP, DOWN, LEFT, RIGHT]) {
                    if (!this.vector2Equals(newDir, [vx, vy]) && !this.vector2Equals(newDir, [-vx, -vy])) {
                        let nextX = x + newDir[0]
                        let nextY = y + newDir[1]
                        if ((0 <= nextX) && (nextX < fieldWidth) && (0 <= nextY) && (nextY < fieldHeight)) {
                            nextNodes.insert([len + fields[nextY][nextX], nextX, nextY, ...newDir, 1])
                        }
                    }
                }
            }
        }
        return -1
    }

    private vector2Equals(a: Vector2, b: Vector2): boolean {
        return a[0] === b[0] && a[1] === b[1]
    }

    private nodeToString(node: Node): string {
        return node.join("_")
    }
}