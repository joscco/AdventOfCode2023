import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Set} from "../../types/Set";
import {Dict} from "../../types/Dict";

type Node = string

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "54";
    }

    getSecondExampleSolution(): string {
        return "NONE";
    }

    solveFirst(input: Str, test: boolean): string {
        let nodes = new Set<Node>(node => node)
        let neighborMap = new Dict<Node, Node[]>(node => node)

        for (let row of input.parseRows().map(row => row.toString().replace(":", "").split(" ")).toArray()) {
            let source = row[0]
            nodes.add(source)
            for (let i = 1; i < row.length; i++) {
                let aim = row[i]
                nodes.add(aim)
                let sourceNeighbors = neighborMap.get(source) ?? []
                sourceNeighbors.push(aim)
                let aimNeighbors = neighborMap.get(aim) ?? []
                aimNeighbors.push(source)

                neighborMap.set(source, sourceNeighbors)
                neighborMap.set(aim, aimNeighbors)
            }
        }

        let S = nodes.copy()
        let S_C = new Set<Node>(n => n)
        while (S.values().map(s => this.countNeighborsIn(s, S_C, neighborMap)).reduce((a, b) => a + b) != 3) {
            let maxNeighborNode = S.values()
                .map(s => [s, this.countNeighborsIn(s, S_C, neighborMap)] as [Node, number])
                .sort(([, u], [, v]) => v - u)[0][0]
            S.remove(maxNeighborNode)
            S_C.add(maxNeighborNode)
        }

        return (S.values().length * S_C.values().length).toString()
    }

    solveSecond(input: Str, test: boolean): string {
        return "NONE"
    }

    private countNeighborsIn(s: Node, G: Set<Node>, neighborMap: Dict<Node, Node[]>): number {
        return neighborMap.get(s)!.filter(g => G.has(g)).length
    }
}