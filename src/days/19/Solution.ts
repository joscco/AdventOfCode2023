import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Arr, NumArr} from "../../types/Arr";
import {IDENTITY} from "../../types/General";

type Workflow = {
    rules: Rule[],
    fallback: string
}

type Item = number[]

type Rule = [number, string, number, string]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "19114";
    }

    getSecondExampleSolution(): string {
        return "167409079868000";
    }

    solveFirst(input: Str): string {
        let [wfs, vs] = input.parseRows()
            .map(s => s.toString())
            .groupSplit("")
            .toArray();

        let items: Item[] = vs.map(set => set.match(/\d+/g)!.map(s => parseInt(s))).toArray()
        let workflows: Map<string, Workflow> = new Map()

        for (let workflow of wfs.toArray()) {
            let [name, ending] = workflow.split("{")

            let rules = ending.slice(0, ending.length - 1).split(",")
            let newWorkflow: Workflow = {rules: [], fallback: rules.pop()!}
            for (let rule of rules) {
                let [start, aim] = rule.split(":")
                let key = ["x", "m", "a", "s"].indexOf(start.charAt(0))
                let compareOperator = start.charAt(1)
                let value = parseInt(start.slice(2))
                newWorkflow.rules.push([key, compareOperator, value, aim])
            }

            workflows.set(name, newWorkflow)
        }

        let result = 0

        for (let item of items) {
            if (this.isAccepted(workflows, item, "in")) {
                result += new NumArr(item).sum()
            }
        }

        return result.toString()
    }

    solveSecond(input: Str): string {
        let [wfs, _] = input.parseRows()
            .map(s => s.toString())
            .groupSplit("")
            .toArray();

        let workflows: Map<string, Workflow> = new Map()

        for (let workflow of wfs.toArray()) {
            let [name, ending] = workflow.split("{")

            let rules = ending.slice(0, ending.length - 1).split(",")
            let newWorkflow: Workflow = {rules: [], fallback: rules.pop()!}
            for (let rule of rules) {
                let [start, aim] = rule.split(":")
                let key = ["x", "m", "a", "s"].indexOf(start.charAt(0))
                let compareOperator = start.charAt(1)
                let value = parseInt(start.slice(2))
                newWorkflow.rules.push([key, compareOperator, value, aim])
            }

            workflows.set(name, newWorkflow)
        }

        return this.count(workflows, [[1, 4000], [1, 4000], [1, 4000], [1, 4000]], "in").toString()
    }

    isAccepted(workflows: Map<string, Workflow>, item: number[], flow: string): boolean {
        if (flow === "R") {
            return false
        }
        if (flow === "A") {
            return true
        }

        let workflow = workflows.get(flow)!

        for (let [key, cmp, n, target] of workflow.rules) {
            if ((cmp === ">" && item[key] > n) || (cmp === "<" && item[key] < n)) {
                return this.isAccepted(workflows, item, target)
            }
        }

        return this.isAccepted(workflows, item, workflow.fallback)
    }

    count(workflows: Map<string, Workflow>, itemIntervall: number[][], flow: string): number {
        if (flow === "R") {
            return 0
        }

        if (flow === "A") {
            return new Arr(itemIntervall.map(([a, b]) => b - a + 1)).toNumArr().multiply()
        }

        let workflow = workflows.get(flow)!

        let result = 0

        for (let [key, cmp, n, target] of workflow.rules) {
            let [left, right] = itemIntervall[key]
            let accepted: number[]
            let rejected: number[]
            if (cmp === "<") {
                accepted = [left, Math.min(n - 1, right)]
                rejected = [Math.max(n, left), right]
            } else {
                accepted = [Math.max(n + 1, left), right]
                rejected = [left, Math.min(n, right)]
            }

            if (this.isInterval(accepted)) {
                let acceptedItems = itemIntervall.map(IDENTITY)
                acceptedItems[key] = accepted
                result += this.count(workflows, acceptedItems, target)
            }

            if (this.isInterval(rejected)) {
                itemIntervall = itemIntervall.map(IDENTITY)
                itemIntervall[key] = rejected
            }
        }

        result += this.count(workflows, itemIntervall, workflow.fallback)

        return result
    }



    private isInterval(int: number[]) {
        return int[1] - int[0] >= 0
    }
}