import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2, Vector2Dict} from "../../types/Dict";
import {Vector2ArrSet, Vector2Set} from "../../types/Set";
import {ORDER_NATURAL} from "../../types/General";
import {Arr} from "../../types/Arr";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "94";
    }

    getSecondExampleSolution(): string {
        return "154";
    }

    solveFirst(input: Str): string {
        let field = input.parseRows().map(row => row.toString().split("")).toArray();

        let start: Vector2 = [0, 1]
        let end: Vector2 = [field.length - 1, field[0].length - 2]
        return this.fieldLongestPathFromTo(field, start, end, true).toString()
    }

    solveSecond(input: Str): string {
        let field = input.parseRows().map(row => row.toString().split("")).toArray();
        let start: Vector2 = [0, 1]
        let end: Vector2 = [field.length - 1, field[0].length - 2]
        return this.fieldLongestPathFromTo(field, start, end, false).toString()
    }

    private fieldLongestPathFromTo(field: string[][], start: Vector2, end: Vector2, slopesAreANoGo: boolean): number {
        // Only works when graph is cycle free

        let cornerPointSet = new Vector2Set([start, end])
        for (let row = 0; row < field.length; row++) {
            for (let col = 0; col < field[0].length; col++) {
                let index: Vector2 = [row, col]
                let neighbors = this.getPossibleNeighborsOf(field, index, false)
                if (neighbors.map(neigh => field[neigh[0]][neigh[1]]).filter(s => s != ".").length > 1) {
                    cornerPointSet.add(index)
                }
            }
        }

        // Find pathLengths between corner Points
        let cornerPointNeighborMap: Vector2Dict<Vector2Dict<number>> = new Vector2Dict()

        for (let cornerPoint of cornerPointSet) {
            let paths = new Vector2ArrSet([[cornerPoint]])
            let mapEntry: Vector2Dict<number> = new Vector2Dict<number>()
            while (paths.values().length > 0) {
                let newPaths = new Vector2ArrSet()
                for (let path of paths) {
                    let lastOfPath = path[path.length - 1]
                    let neighbors = this.getPossibleNeighborsOf(field, lastOfPath, slopesAreANoGo)
                    for (let neighbor of neighbors) {
                        if (cornerPointSet.has(neighbor) && !this.vector2Equals(neighbor, cornerPoint)) {
                            mapEntry.set(neighbor, path.length)
                        } else if (!this.pathIncludes(path, neighbor)) {
                            newPaths.add([...path, neighbor])
                        }
                    }
                }
                paths = newPaths
            }
            cornerPointNeighborMap.set(cornerPoint, mapEntry)
        }

        // Find longest path with cornerPoints
        let seen = new Vector2Set()
        return this.findLargestPath(start, end, cornerPointNeighborMap, seen);
    }

    private findLargestPath(start: Vector2, end: Vector2, cornerPointNeighborMap: Vector2Dict<Vector2Dict<number>>, seen: Vector2Set) {
        if (this.vector2Equals(start, end)) {
            return 0
        }

        let result = -10000

        seen.add(start)
        for (let neighbor of cornerPointNeighborMap.get(start)!.keys()) {
            if (!seen.has(neighbor)) {
                result = Math.max(result, this.findLargestPath(neighbor, end, cornerPointNeighborMap, seen) + cornerPointNeighborMap.get(start)!.get(neighbor)!)
            }
        }
        seen.remove(start)

        return result
    }

    private getPossibleNeighborsOf(field: string[][], index: Vector2, slopesAreANoGo: boolean) {
        if (field[index[0]][index[1]] === "#") {
            return []
        }
        return ([[-1, 0], [1, 0], [0, -1], [0, 1]] as Vector2[])
            .map(i => this.vector2Add(i, index))
            .filter(index => index[0] >= 0 && index[0] < field.length && index[1] >= 0 && index[1] < field[0].length)
            .filter(newIndex => this.isValidNextSymbol(index, newIndex, field[newIndex[0]][newIndex[1]], slopesAreANoGo))
    }

    private isValidNextSymbol(index: Vector2, newIndex: Vector2, symb: string, slopesAreANoGo: boolean) {
        if (!slopesAreANoGo) {
            return symb !== "#"
        }
        return symb === "."
            || (newIndex[0] > index[0] && symb === "v")
            || (newIndex[0] < index[0] && symb === "^")
            || (newIndex[1] > index[1] && symb === ">")
            || (newIndex[1] < index[1] && symb === "<")
    }

    private vector2Add(a: Vector2, b: Vector2): Vector2 {
        return [a[0] + b[0], a[1] + b[1]];
    }

    private vector2Equals(a: Vector2, b: Vector2): boolean {
        return a[0] === b[0] && a[1] === b[1]
    }

    private pathIncludes(path: Vector2[], neighbor: Vector2) {
        return path.some(i => this.vector2Equals(i, neighbor))
    }

    private getPossibleNeighborsWithinCornersOf(map: Vector2Dict<Vector2Dict<number>>, index: Vector2): Vector2[] {
        return map.get(index)!.keys()
    }

    private getPathLength(map: Vector2Dict<Vector2Dict<number>>, path: Vector2[]): number {
        let result = 0;
        for (let i = 0; i < path.length - 1; i++) {
            result += map.get(path[i])!.get(path[i + 1])!
        }
        return result
    }
}