import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr} from "../../types/Arr";

type Vector2 = [number, number]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "1320";
    }

    getSecondExampleSolution(): string {
        return "145";
    }

    solveFirst(input: Str): string {
        return input.split(",")
            .map(str => this.hash(str))
            .toNumArr()
            .add()
            .toString()
    }

    solveSecond(input: Str): string {
        let boxes: Arr<Arr<string>> = new Arr([...Array(256).keys()]).map(_ => new Arr())
        let focalLengthForLabel: Map<string, number> = new Map()

        for (let instruction of input.split(",").toArray()) {
            if (instruction.contains("-")) {
                let label = instruction.dropLastChars(1)
                let stringLabel = label.toString()
                let index = this.hash(label)
                let box = boxes.get(index)
                if (box.contains(stringLabel)) {
                    box.remove(stringLabel)
                }

            } else {
                let [label, strLength] = instruction.split("=").toArray()
                let length = strLength.parseInt()

                let index = this.hash(label)
                let box = boxes.get(index)
                let stringLabel = label.toString()
                if (!box.contains(stringLabel)) {
                    box.push(stringLabel)
                }

                focalLengthForLabel.set(stringLabel, length)
            }

        }

        let total = 0

        boxes.map((box, boxIndex) => {
            box.map((label, slotIndex) => {
                total += (boxIndex + 1) * (slotIndex + 1) * focalLengthForLabel.get(label.toString())!
            })
        })

        return total.toString()
    }

    private hash(str: Str): number {
        let result = 0
        for (let i = 0; i < str.length(); i++) {
            result += str.charCodeAt(i)
            result *= 17
            result %= 256
        }
        return result
    }
}