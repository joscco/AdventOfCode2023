export abstract class AbstractSolution {
    input: string
    exampleInput: string

    constructor(input: string, exampleInput: string) {
        this.input = input
        this.exampleInput = exampleInput
    }

    abstract solveFirst(input: string, testMode?: boolean): string

    abstract solveSecond(input: string, testMode?: boolean): string

    abstract getFirstExampleSolution(): string

    abstract getSecondExampleSolution(): string

    solve() {
        console.log("----------------------------")
        console.log(`First Puzzle:`)
        let firstExampleSolution = this.getFirstExampleSolution()
        let myFirstExampleSolution = this.solveFirst(this.exampleInput, true)
        console.log(
            `Example Solution | My Solution: ${firstExampleSolution} | ${myFirstExampleSolution}`,
            "<--",
            firstExampleSolution === myFirstExampleSolution ? "Correct! ✅" : "Wrong! ❌")

        let firstStartTime = new Date().getTime()
        let myRealFirstSolution = this.solveFirst(this.input, false)
        let firstEndTime = new Date().getTime()
        console.log("Solution for real input:", myRealFirstSolution, `(in ${firstEndTime - firstStartTime} ms w/o parsing)`)

        console.log(`\nSecond Puzzle:`)
        let secondExampleSolution = this.getSecondExampleSolution()
        let mySecondExampleSolution = this.solveSecond(this.exampleInput, true)
        console.log(`Example Solution | My Solution: ${secondExampleSolution} | ${mySecondExampleSolution}`,
            "<--",
            secondExampleSolution === mySecondExampleSolution ? "Correct! ✅" : "Wrong! ❌")

        let secondStartTime = new Date().getTime()
        let myRealSecondSolution = this.solveSecond(this.input, false)
        let secondEndTime = new Date().getTime()
        console.log("Solution for real input:", myRealSecondSolution, `(in ${secondEndTime - secondStartTime} ms w/o parsing)`)
        console.log("----------------------------")
    }
}