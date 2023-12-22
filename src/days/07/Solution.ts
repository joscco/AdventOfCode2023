import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";

const VALUES = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
const VALUES_WITH_JOKER = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "6440";
    }

    getSecondExampleSolution(): string {
        return "5905";
    }

    solveFirst(input: Str): string {
        return this.solveDay(input, VALUES, false)
    }

    solveSecond(input: Str): string {
        return this.solveDay(input, VALUES_WITH_JOKER, true)
    }

    private solveDay(input: Str, valueList: String[], includeJokers: boolean) {
        return input.parseRows()
            .map(row => {
                let split = row.split(" ");
                return [split.get(0), split.get(1).parseInt()] as [Str, number]
            })
            .sort((a, b) => this.compareHands(a[0], b[0], valueList, includeJokers))
            .map(([_, rank], index) => rank * (index + 1))
            .toNumArr()
            .sum()
            .toString();
    }

    private compareHands(a: Str, b: Str, charList: String[], withJokers: boolean) : number {
        // Ist a größer B, so ist der Typ von a Größer
        let aType = withJokers ? this.getHighestTypeOfHand(a) : this.getTypeOfHand(a)
        let bType = withJokers ? this.getHighestTypeOfHand(b) : this.getTypeOfHand(b)

        if (aType == bType) {
            return this.lexCompare(a, b, charList)
        }

        return aType - bType
    }

    private getTypeOfHand(a: Str): number {
        let numberOfChars = this.charDistribution(a)
        if (numberOfChars.size == 1) {
            // Five of a kind
            return 6
        } else if (numberOfChars.size == 2) {
            if ([...numberOfChars.entries()].some(([_, amount]) => amount === 4)) {
                // Four of a kind
                return 5
            }
            // Full house
            return 4
        } else if (numberOfChars.size == 3) {
            if ([...numberOfChars.entries()].some(([_, amount]) => amount === 3)) {
                // Three of a kind
                return 3
            }

            // Two pair
            return 2
        } else if (numberOfChars.size == 4) {
            // One Pair
            return 1
        }

        return 0
    }

    private getHighestTypeOfHand(a: Str): number {
        let numberOfChars = this.charDistribution(a)
        if (numberOfChars.size == 1 || (numberOfChars.size == 2 && numberOfChars.get("J"))) {
            // Five of a kind
            return 6
        } else if (numberOfChars.size == 2 || (numberOfChars.size == 3 && numberOfChars.get("J"))) {
            let jokers = numberOfChars.get("J") ?? 0
            if ([...numberOfChars.entries()].some(([_, amount]) => amount + jokers >= 4)) {
                // Four of a kind
                return 5
            }
            // Full house
            return 4
        } else if (numberOfChars.size == 3 || (numberOfChars.size == 4 && numberOfChars.get("J"))) {
            let jokers = numberOfChars.get("J") ?? 0
            if ([...numberOfChars.entries()].some(([_, amount]) => amount + jokers >= 3)) {
                // Three of a kind
                return 3
            }

            // Two pair
            return 2
        } else if (numberOfChars.size == 4 || (numberOfChars.size == 5 && numberOfChars.get("J"))) {
            // One Pair is possible
            return 1
        }
        return 0
    }

    private charDistribution(a: Str): Map<string, number> {
        let map = new Map()
        for (let char of a.split("").toArray()) {
            let prevValue = map.get(char.toString())
            map.set(char.toString(), prevValue ? prevValue + 1 : 1)
        }
        return map
    }

    private lexCompare(a: Str, b: Str, charList: String[]) : number {
        let firstAValue = charList.indexOf(a.charAt(0))
        let firstBValue = charList.indexOf(b.charAt(0))
        if (firstAValue === firstBValue) {
            return this.lexCompare(a.dropFirstChars(1), b.dropFirstChars(1), charList)
        }

        return firstBValue - firstAValue
    }

}