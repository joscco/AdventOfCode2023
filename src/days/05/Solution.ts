import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr} from "../../types/Arr";
import {ORDER_NATURAL} from "../../types/General";
import {start} from "repl";

export type MapInterval = {
    start: number,
    mappedStart: number
    width: number,
}
export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "35";
    }

    getSecondExampleSolution(): string {
        return "46";
    }

    solveFirst(input: Str): string {
        let {seeds, maps} = this.parseSeedsAndMaps(input);

        return seeds.map(seed => maps.reduce(
            (prev, newMap) => this.applyMapTo(prev, newMap),
            seed
        ))
            .toNumArr()
            .min(ORDER_NATURAL)
            .toString()
    }

    solveSecond(input: Str): string {
        let {seeds, maps} = this.parseSeedsAndMaps(input);

        return this.findLeftIntervallBorders(seeds, maps)
            .map(seed => maps.reduce(
                (prev, newMap) => this.applyMapTo(prev, newMap),
                seed
            ))
            .toNumArr()
            .min(ORDER_NATURAL)
            .toString()

    }

    private parseSeedsAndMaps(input: Str) {
        let seeds: Arr<number> = new Arr()
        let maps: Arr<Arr<[number, number, number]>> = new Arr()
        let mapIndex = -1

        input.parseRows()
            .map(row => {
                    if (/^seeds:/.test(row.toString())) {
                        seeds = row.split(": ").get(1).split(" ").map(str => str.parseInt())
                    } else if (/^[a-z]/.test(row.toString())) {
                        mapIndex += 1
                        maps.set(mapIndex, new Arr())
                    } else if (/[0-9 ]+/.test(row.toString())) {
                        let numberValues = row.split(" ").map(str => str.parseInt()).toArray()
                        maps.get(mapIndex).push([numberValues[0], numberValues[1], numberValues[2]])
                    }
                }
            )
        return {seeds, maps};
    }

    private applyMapTo(prev: number, map: Arr<[number, number, number]>): number {
        for (let entry of map.toArray()) {
            let dist = prev - entry[1]
            if (dist >= 0 && dist < entry[2]) {
                return entry[0] + dist
            }
        }
        return prev
    }

    private findLeftIntervallBorders(seeds: Arr<number>, maps: Arr<Arr<[number, number, number]>>): Arr<number> {
        return seeds.groupSplitBySize(2)
            .flatMap(interval => {
                let init: Arr<MapInterval> = new Arr([{start: interval.get(0), width: interval.get(1), mappedStart: interval.get(0)} as MapInterval])
                let list = maps.reduce((previousIntervals, currentMap) => previousIntervals.flatMap(interval => this.getIntervals(interval, currentMap)), init)
                return list
            })
            .map(interval => this.getLeftBorder(interval))
    }

    private getIntervals(interval: MapInterval, map: Arr<[number, number, number]>): Arr<MapInterval> {
        let result: Arr<MapInterval> = new Arr()
        for (let entry of map.toArray()) {
            let [mappedStart, start, width] = entry
            let entryResult = this.mapInterval(interval, mappedStart, start, width)
            if (entryResult) {
                result.push(entryResult)
            }
        }

        if (result.length() === 0) {
            return new Arr([interval])
        }

        // Don't forget left and right!
        let minLeft = result.map(val => val.start).min(ORDER_NATURAL);
        let maxRight = result.map(val => val.start + val.width - 1).max(ORDER_NATURAL);

        if (minLeft !== interval.start) {
            result.push({
                start: interval.start,
                width: minLeft - interval.start,
                mappedStart: interval.mappedStart
            })
        }

        if (maxRight !== interval.start + interval.width - 1) {
            result.push({
                start: maxRight + 1,
                width: interval.start + interval.width - 1 - maxRight,
                mappedStart: interval.mappedStart - interval.start + maxRight + 1
            })
        }

        return result
    }

    private getLeftBorder(interval: MapInterval): number {
        return interval.start
    }


    // Deckt dieses mapInterval einen Teil vom EingabeInterval an erster Stelle ab?
    private mapInterval(interval: MapInterval, mappedStart: number, start: number, width: number): MapInterval | undefined {
        let intersection = this.findIntersection(interval.mappedStart, interval.width, start, width)
        if (intersection) {
            return {
                start: intersection[0] + interval.start - interval.mappedStart,
                width: intersection[1],
                mappedStart:  intersection[0] + mappedStart - start
            }
        }
        return undefined
    }

    private findIntersection(start1: number, width1: number, start2: number, width2: number): [number, number] | undefined {
        if (start1 > start2) {
            return this.findIntersection(start2, width2, start1, width1)
        }

        if (start1 + width1 >= start2) {
            // Intervals intersect!
            let rightEndInterval1 = start1 + width1
            return [start2, Math.min(rightEndInterval1 - start2 + 1, width2)]
        }

        return undefined
    }
}