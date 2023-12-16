import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2} from "../../types/Dict";
import {Arr} from "../../types/Arr";
import {ORDER_NATURAL} from "../../types/General";

type Beam = {
    index: Vector2,
    direction: Vector2
}

const UP: Vector2 = [0, -1]
const DOWN: Vector2 = [0, 1]
const LEFT: Vector2 = [-1, 0]
const RIGHT: Vector2 = [1, 0]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "46";
    }

    getSecondExampleSolution(): string {
        return "145";
    }

    solveFirst(input: Str): string {
        let fields = this.parseField(input)
        let firstBeam: Beam = {index: [-1, 0], direction: [1, 0]}
        return this.getEnergizedFields(fields, firstBeam);
    }

    private parseField(input: Str) {
        return input.parseRows().toArray()
            .map(row => row.toString().split(""));
    }

    solveSecond(input: Str, testMode?: boolean): string {
        let fields = this.parseField(input)

        let firstBeams: Beam[] = []
        firstBeams.push(...this.getVertBeams(-1, 0, fields.length - 1, [1, 0]))
        firstBeams.push(...this.getVertBeams(fields.length, 0, fields.length - 1, [-1, 0]))
        firstBeams.push(...this.getHorBeams(-1, 0, fields[0].length - 1, [0, 1]))
        firstBeams.push(...this.getHorBeams(fields[0].length, 0, fields[0].length - 1, [0, -1]))

        return new Arr(firstBeams)
            .map(startBeam => this.getEnergizedFields(fields, startBeam))
            .toNumArr()
            .max(ORDER_NATURAL)
            .toString()
    }

    private getEnergizedFields(fields: string[][], firstBeam: Beam) {
        let fieldHeight = fields.length

        let fieldWidth = fields[0].length
        let allBeams: Set<string> = new Set<string>()
        let newBeams: Arr<Beam> = new Arr<Beam>([firstBeam])

        while (newBeams.length() !== 0) {
            let tempNewBeams: Arr<Beam> = new Arr()
            for (let beam of newBeams.toArray()) {
                let nextIndex = this.vectorAdd(beam.index, beam.direction)
                if (nextIndex[0] < 0 || nextIndex[0] >= fieldWidth || nextIndex[1] < 0 || nextIndex[1] >= fieldHeight) {
                    continue
                }
                let field = fields[nextIndex[1]][nextIndex[0]]
                let nextBeams = this.getNewBeams(field, nextIndex, beam.direction)
                    .filter(beam => !allBeams.has(this.beamToString(beam)))
                newBeams.push(...nextBeams)
                for (let beamy of nextBeams.map(beam => this.beamToString(beam))) {
                    allBeams.add(beamy)
                }
            }
            newBeams = tempNewBeams
        }

        return new Set([...allBeams.values()]
            .map(beam => beam.split("_")[0]))
            .size
            .toString()
    }

    beamToString(beam: Beam): string {
        return beam.index + "_" + beam.direction
    }

    private vectorAdd(index: Vector2, direction: Vector2): Vector2 {
        return [index[0] + direction[0], index[1] + direction[1]]
    }

    private getNewBeams(field: string, nextIndex: Vector2, direction: Vector2): Beam[] {
        if (field === "/") {
            if (this.dirEquals(direction, UP)) {
                return [{index: nextIndex, direction: RIGHT}]
            }
            if (this.dirEquals(direction, DOWN)) {
                return [{index: nextIndex, direction: LEFT}]
            }
            if (this.dirEquals(direction, LEFT)) {
                return [{index: nextIndex, direction: DOWN}]
            }
            if (this.dirEquals(direction, RIGHT)) {
                return [{index: nextIndex, direction: UP}]
            }
        }

        if (field === "\\") {
            if (this.dirEquals(direction, UP)) {
                return [{index: nextIndex, direction: LEFT}]
            }
            if (this.dirEquals(direction, DOWN)) {
                return [{index: nextIndex, direction: RIGHT}]
            }
            if (this.dirEquals(direction, LEFT)) {
                return [{index: nextIndex, direction: UP}]
            }
            if (this.dirEquals(direction, RIGHT)) {
                return [{index: nextIndex, direction: DOWN}]
            }
        }

        if (field === "-") {
            if (direction[1] === 0) {
                return [{index: nextIndex, direction: direction}]
            }
            return [{index: nextIndex, direction: LEFT}, {index: nextIndex, direction: RIGHT}]
        }

        if (field === "|") {
            if (direction[0] === 0) {
                return [{index: nextIndex, direction: direction}]
            }
            return [{index: nextIndex, direction: UP}, {index: nextIndex, direction: DOWN}]
        }

        return [{index: nextIndex, direction: direction}]
    }

    private dirEquals(a: Vector2, b: Vector2): boolean {
        return a[0] === b[0] && a[1] === b[1]
    }

    private getVertBeams(x: number, yStart: number, yEnd: number, direction: Vector2): Beam[] {
        return [...Array(yEnd - yStart + 1).keys()].map(i => {
            return {index: [x, yStart + i], direction: direction}
        })
    }

    private getHorBeams(y: number, xStart: number, xEnd: number, direction: Vector2): Beam[] {
        return [...Array(xEnd - xStart + 1).keys()].map(i => {
            return {index: [xStart + i, y], direction: direction}
        })
    }
}