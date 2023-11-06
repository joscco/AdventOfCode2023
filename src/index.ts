import SolutionManager from "./SolutionManager";
import "./types/Array"
import "./types/String"

const args = process.argv.slice(2);
const dayNumber = args[0];

if (!dayNumber) {
    console.error('No day specified run with npm run day {dayNumber}');
    process.exit(1);
}

(async () => {
    console.log(`Solving Day ${dayNumber}:`)
    let startTime = new Date().getTime()
    const solution = await SolutionManager.getSolution(args[0]);
    solution.solve()
    let endTime = new Date().getTime()
    console.log(`Total Time with parsing: ${endTime - startTime} ms`)
})();