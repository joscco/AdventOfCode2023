import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";

type Brick = [number, number, number, number, number, number]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "5";
    }

    getSecondExampleSolution(): string {
        return "7";
    }

    solveFirst(input: Str): string {
        let {bricks, isSupporterFor, isSupportedBy} = this.prepareBrickAndSupporters(input);

        return bricks.filter((_, i) => isSupporterFor.get(i)!.every(num => isSupportedBy.get(num)!.length > 1))
            .length
            .toString()
    }

    solveSecond(input: Str): string {
        let {bricks, isSupporterFor, isSupportedBy} = this.prepareBrickAndSupporters(input);

        return bricks.map((_, i) => this.getNumberOfBricksToFallIfRemoved(i, isSupporterFor, isSupportedBy))
            .reduce((a, b) => a + b)
            .toString()
    }

    private getNumberOfBricksToFallIfRemoved(
        brickIndex: number,
        isSupporterFor: Map<number, number[]>,
        isSupportedBy: Map<number, number[]>
    ) {
        let nextBricksInFallChain = isSupporterFor.get(brickIndex)!.filter(j => isSupportedBy.get(j)!.length == 1)
        let allThatWillFall = new Set([...nextBricksInFallChain, brickIndex])
        while (nextBricksInFallChain.length > 0) {
            let nextBrickInFallChain = nextBricksInFallChain.pop()!
            for (let nextThatCouldFall of isSupporterFor.get(nextBrickInFallChain)!.filter(i => !allThatWillFall.has(i))) {
                // Check if Supporters for nextThatCould Fall are only those in allThatWillFall
                if (isSupportedBy.get(nextThatCouldFall)!.filter(supporter => !allThatWillFall.has(supporter)).length === 0) {
                    nextBricksInFallChain.push(nextThatCouldFall)
                    allThatWillFall.add(nextThatCouldFall)
                }
            }
        }
        return allThatWillFall.size - 1
    }

    private prepareBrickAndSupporters(input: Str) {
        let bricks: Brick[] = input.parseRows()
            .map(row => row.toString()
                .replace("~", ",")
                .split(",")
                .map(n => parseInt(n)) as Brick)
            .toArray()

        // Sort bricks by z
        bricks = bricks.sort((a, b) => a[2] - b[2])

        // Let bricks fall down
        bricks.forEach((brick, index) => {
            let maxZ = 1
            for (let i = 0; i < index; i++) {
                let brickBelow = bricks[i]
                if (this.bricksOverlapInXOrY(brickBelow, brick)) {
                    maxZ = Math.max(maxZ, brickBelow[5] + 1)
                }
            }
            brick[5] = maxZ + (brick[5] - brick[2])
            brick[2] = maxZ
        })

        // Sort bricks by z again
        bricks = bricks.sort((a, b) => a[2] - b[2])
        let numberOfBricks = bricks.length

        // Figure out which supports which
        let isSupporterFor = new Map<number, number[]>([...Array(numberOfBricks).keys()].map(key => [key, []]))
        let isSupportedBy = new Map<number, number[]>([...Array(numberOfBricks).keys()].map(key => [key, []]))

        bricks.forEach((brickAbove, iAbove) => {
            for (let iBelow = 0; iBelow < iAbove; iBelow++) {
                let brickBelow = bricks[iBelow]
                if (this.bricksOverlapInXOrY(brickBelow, brickAbove) && brickAbove[2] === brickBelow[5] + 1) {
                    isSupportedBy.get(iAbove)?.push(iBelow)
                    isSupporterFor.get(iBelow)?.push(iAbove)
                }
            }
        })
        return {bricks, isSupporterFor, isSupportedBy};
    }

    bricksOverlapInXOrY(a: Brick, b: Brick): boolean {
        return Math.max(a[0], b[0]) <= Math.min(a[3], b[3]) && Math.max(a[1], b[1]) <= Math.min(a[4], b[4])
    }
}