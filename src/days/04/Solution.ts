import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {NumArr} from "../../types/Arr";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "13";
    }

    getSecondExampleSolution(): string {
        return "30";
    }

    solveFirst(input: Str): string {
        return this.getMatchesPerCard(input)
            .map(duplicates => Math.floor(Math.pow(2, duplicates - 1)))
            .toNumArr()
            .sum()
            .toString()
    }

    solveSecond(input: Str): string {
        let matchesPerCard = this.getMatchesPerCard(input)
        return this.addUpCardNumbers(matchesPerCard.toNumArr())
            .sum()
            .toString()
    }

    private addUpCardNumbers(matchesPerCard: NumArr): NumArr {
        let cards = [...Array(matchesPerCard.length()).keys()].fill(1)
        for (let i = 0; i < matchesPerCard.length(); i++) {
            let matches = matchesPerCard.get(i)
            for (let j = i + 1; j <= i + matches; j++) {
                cards[j] = cards[j] + cards[i]
            }
        }
        return new NumArr(cards);
    }

    private getMatchesPerCard(input: Str) {
        return input.parseRows()
            .map(row => row.match(/(?<=:)(?<first> +\d+)+|(?<=\|)(?<second> +\d+)+/g))
            .map(row => {
                let [winNumbers, allNumbers] = [row![0].trim().split(/ +/), row![1].trim().split(/ +/)]
                // Use floor to turn 1/2 into a 0 in case of zero matches
                return this.getDuplicateNumber(winNumbers, allNumbers)
            });
    }

    private getDuplicateNumber(first: string[], second: string[]): number {
        return first.filter(el => second.includes(el)).length
    }
}