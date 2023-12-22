import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr} from "../../types/Arr";
import {ORDER_NATURAL} from "../../types/General";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "8";
    }

    getSecondExampleSolution(): string {
        return "2286";
    }

    solveFirst(input: Str): string {
        return this.parseGame(input)
            .getIndicesWith(game => this.gameIsPossible(game))
            .map(index => index + 1)
            .toNumArr()
            .sum()
            .toString()
    }

    solveSecond(input: Str): string {
        return this.parseGame(input)
            .map(game => this.getGamePower(game))
            .toNumArr()
            .sum()
            .toString()
    }

    private parseGame(input: Str): Arr<[number, string][]> {
        let DICE_REGEX = /((\d+) (blue|red|green))/g
        return input.parseRows()
            .map(row => row.match(DICE_REGEX))
            .map(game => game!.map(part => {
                let [num, col] = part.split(" ")
                return [parseInt(num), col] as [number, string]
            }))
    }

    private getGamePower(game: [number, string][]): number {
        return this.getMaxValueFor("red", game)
            * this.getMaxValueFor("blue", game)
            * this.getMaxValueFor("green", game)
    }

    private gameIsPossible(game: [number, string][]): boolean {
        return game.every(([val, col]) => {
            if (col === "red") {
                return val <= 12
            } else if (col === "green") {
                return val <= 13
            }
            return val <= 14
        })
    }

    private getMaxValueFor(value: string, game: [number, string][]) {
        return new Arr(game)
            .filter(([_, str]) => str === value)
            .map(([num, _]) => num)
            .toNumArr()
            .max(ORDER_NATURAL)
    }
}