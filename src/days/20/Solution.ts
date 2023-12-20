import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {NumArr} from "../../types/Arr";
import {lcm} from "../../types/MathUtils";

type Modul = FlipFlopModule | ConjunctionModule | BaseModule
type ModuleType = "flipflop" | "conjunction" | "none"
type FlipFlopModule = BaseModule & { on: boolean }
type ConjunctionModule = BaseModule & { onMap: Map<string, string> }
type BaseModule = { name: string, type: ModuleType, next: string[] }

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "11687500";
    }

    getSecondExampleSolution(): string {
        return "NONE";
    }

    solveFirst(input: Str): string {
        let modules = new Map<string, Modul>()
        let rows = input.parseRows();

        for (let row of rows.toArray()) {
            if (row.charAt(0) === "&") {
                let [name, nextAsString] = row.toString().slice(1).split(" -> ")
                modules.set(name, {
                    name: name,
                    type: "conjunction",
                    onMap: new Map<string, string>(),
                    next: nextAsString.split(", ")
                })
            } else if (row.charAt(0) === "%") {
                let [name, nextAsString] = row.toString().slice(1).split(" -> ")
                modules.set(name, {name: name, type: "flipflop", on: false, next: nextAsString.split(", ")})
            } else {
                let [name, nextAsString] = row.toString().split(" -> ")
                modules.set(name, {
                    name: name,
                    type: "none",
                    next: nextAsString.split(", ")
                })
            }
        }

        // Init maps for conjunctions
        for (let module of modules.values()) {
            for (let followingModuleName of module.next) {
                let nextModule = modules.get(followingModuleName)
                if (nextModule && nextModule.type === "conjunction") {
                    (nextModule as ConjunctionModule).onMap.set(module.name, "low")
                }
            }
        }

        let lows = 0;
        let highs = 0;
        for (let i = 1; i <= 1000; i++) {
            lows += 1
            let queue = modules.get("broadcaster")!.next.map(moduleName => ["broadcaster", moduleName, "low"])
            while (queue.length > 0) {
                let [prevModuleName, moduleName, pulse] = queue.shift()!
                if (pulse === "low") {
                    lows++
                } else {
                    highs++
                }

                if (!modules.has(moduleName)) {
                    continue
                }

                let module = modules.get(moduleName)!

                if (module.type === "flipflop") {
                    if (pulse === "low") {
                        let moduleAsFlip = (module as FlipFlopModule)
                        moduleAsFlip.on = !moduleAsFlip.on
                        let nextPulse = moduleAsFlip.on ? "high" : "low"
                        for (let nextModuleName of module.next) {
                            queue.push([moduleName, nextModuleName, nextPulse])
                        }
                    }
                } else {
                    // Is Conjunction
                    let moduleAsConj = (module as ConjunctionModule)
                    moduleAsConj.onMap.set(prevModuleName, pulse)
                    let nextPulse = [...moduleAsConj.onMap.values()].every(lastPulse => lastPulse === "high") ? "low" : "high"
                    for (let nextModuleName of module.next) {
                        queue.push([moduleName, nextModuleName, nextPulse])
                    }
                }
            }
        }

        return (lows * highs).toString();
    }

    solveSecond(input: Str): string {
        // 1000 times
        let modules = new Map<string, Modul>()

        for (let row of input.parseRows().toArray()) {
            if (row.charAt(0) === "&") {
                let [name, nextAsString] = row.toString().slice(1).split(" -> ")
                modules.set(name, {
                    name: name,
                    type: "conjunction",
                    onMap: new Map<string, string>(),
                    next: nextAsString.split(", ")
                })
            } else if (row.charAt(0) === "%") {
                let [name, nextAsString] = row.toString().slice(1).split(" -> ")
                modules.set(name, {name: name, type: "flipflop", on: false, next: nextAsString.split(", ")})
            } else {
                let [name, nextAsString] = row.toString().split(" -> ")
                modules.set(name, {
                    name: name,
                    type: "none",
                    next: nextAsString.split(", ")
                })
            }
        }

        // Init maps for conjunctions
        for (let module of modules.values()) {
            for (let followingModuleName of module.next) {
                let nextModule = modules.get(followingModuleName)
                if (nextModule && nextModule.type === "conjunction") {
                    (nextModule as ConjunctionModule).onMap.set(module.name, "low")
                }
            }
        }

        // This is a conjunction
        let ancessorOfRx = [...modules.values()].find(module => module.next.includes("rx"))?.name

        if (!ancessorOfRx) {
            return "NONE"
        }

        // These are the ancessors to this
        let ancessorsOfAncessor = [...modules.values()].filter(module => module.next.includes(ancessorOfRx!)).map(s => s.name)
        let buttonPushes = 0
        let numberOfAppearances: Map<string, number> = new Map(ancessorsOfAncessor.map(a => [a, 0]))
        let cycleLengths: Map<string, number> = new Map()

        while (true) {
            buttonPushes++
            let queue = modules.get("broadcaster")!.next.map(moduleName => ["broadcaster", moduleName, "low"])
            while (queue.length > 0) {
                let [prevModuleName, moduleName, pulse] = queue.shift()!

                if (!modules.has(moduleName)) {
                    continue
                }

                let module = modules.get(moduleName)!

                if (ancessorOfRx === moduleName && pulse === "high") {
                    // Update lists!
                    numberOfAppearances.set(prevModuleName, numberOfAppearances.get(prevModuleName)! + 1)

                    if (!cycleLengths.has(prevModuleName)) {
                        cycleLengths.set(prevModuleName, buttonPushes)
                    }

                    if ([...numberOfAppearances.values()].every(value => value > 0)) {
                        return new NumArr([...cycleLengths.values()]).reduce((a, b) => lcm(a, b), 1).toString()
                    }
                }

                if (module.type === "flipflop") {
                    if (pulse === "low") {
                        let moduleAsFlip = (module as FlipFlopModule)
                        moduleAsFlip.on = !moduleAsFlip.on
                        let nextPulse = moduleAsFlip.on ? "high" : "low"
                        for (let nextModuleName of module.next) {
                            queue.push([moduleName, nextModuleName, nextPulse])
                        }
                    }
                } else {
                    // Is Conjunction
                    let moduleAsConj = (module as ConjunctionModule)
                    moduleAsConj.onMap.set(prevModuleName, pulse)
                    let nextPulse = [...moduleAsConj.onMap.values()].every(lastPulse => lastPulse === "high") ? "low" : "high"
                    for (let nextModuleName of module.next) {
                        queue.push([moduleName, nextModuleName, nextPulse])
                    }
                }
            }
        }
    }
}