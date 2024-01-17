import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Set} from "../../types/Set";
import {Arr} from "../../types/Arr";

type Node = string
type Edge = [Node, Node]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "54";
    }

    getSecondExampleSolution(): string {
        return "NONE";
    }

    solveFirst(input: Str, test: boolean): string {
        let nodes = new Set<Node>(node => node)
        let edges = new Set<Edge>(edge => edge[0] + "_" + edge[1])

        for (let row of input.parseRows().map(row => row.toString().replace(":", "").split(" ")).toArray()) {
            let source = row[0]
            nodes.add(source)
            for (let i = 1; i < row.length; i++) {
                let aim = row[i]
                nodes.add(aim)
                edges.add([source, aim])
            }
        }

        let S = nodes.copy()
        let S_C = new Set<Node>(n => n)
        while (new Arr(S.values().map(s => this.countNeighborsIn(s, S_C, edges))).toNumArr().sum() != 3) {
            let maxNeighborNode = S.values().map(s => [s, this.countNeighborsIn(s, S_C, edges)] as [Node, number]).sort(([x, u], [y, v]) => v - u)[0][0]
            S.remove(maxNeighborNode)
            S_C.add(maxNeighborNode)
            console.log(S_C.values().length)
        }

        return (S.values().length * S_C.values().length).toString()
    }

    solveSecond(input: Str, test: boolean): string {
        return "NONE"
    }

    private countNeighborsIn(s: Node, G: Set<Node>, edges: Set<Edge>): number {
        return G.values().filter(g => edges.has([s, g]) || edges.has([g, s])).length
    }
}