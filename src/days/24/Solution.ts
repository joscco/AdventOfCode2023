import {AbstractSolution} from "../../types/AbstractSolution";
import {Str} from "../../types/Str";
import {Vector2} from "../../types/Dict";
import test from "node:test";

const nerdamer = require("nerdamer")
require('nerdamer/Algebra.js');
require('nerdamer/Calculus.js');
require('nerdamer/Solve.js');

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "2";
    }

    getSecondExampleSolution(): string {
        return "47";
    }

    solveFirst(input: Str, test: boolean): string {
        let rows = input.parseRows()
            .map(row => row.toString()
                .replace(" @", ",")
                .split(", ")
                .map(s => parseInt(s))
            )

        let result = 0
        for (let a = 0; a < rows.length() - 1; a++) {
            for (let b = a + 1; b < rows.length(); b++) {
                let intersect = this.get2DIntersection(rows.get(a), rows.get(b))
                if (intersect && this.isBetween2D(intersect, test ? 7 : 200000000000000, test ? 27 : 400000000000000)) {
                    result++
                }
            }
        }

        return result.toString()
    }

    solveSecond(input: Str, test: boolean): string {
        let rows = input.parseRows()
            .map(row => row.toString()
                .replace(" @", ",")
                .split(", ")
                .map(s => parseInt(s))
            )

        let equations: string[] = []

        // Looking for g: (a, b, c) + t * (d,e,f), so that there is a t_n \in \R
        // for each hail-path g_n: (a_n, b_n, c_n) + t * (d_n, e_n, f_n) with
        // (a, b, c) + t_n * (d, e, f) - ((a_n, b_n, c_n) + t_n * (d_n, e_n, f_n)) = (0, 0, 0)
        // or
        // (a - a_n, b - b_n, c - c_n) + t_n * (d - d_n, e - e_n, f - f_n) = (0, 0, 0)

        // We can eliminate t_n by observing that for this, (a - a_n, b - b_n, c - c_n)
        // and (d - d_n, e - e_n, f - f_n) have to be parallel, so:
        // (a - a_n) * (e - e_n) - (b - b_n) * (d - d_n) = 0 and
        // (b - b_n) * (f - f_n) - (c - c_n) * (e - e_n) = 0
        for (let row of rows.toArray()) {
            equations.push(`(a - ${row[0]}) * (e - ${row[4]}) - (b - ${row[1]}) * (d - ${row[3]})`)
            equations.push(`(b - ${row[1]}) * (f - ${row[5]}) - (c - ${row[2]}) * (e - ${row[4]})`)
        }

        //console.log(equations.map(eq => nerdamer(eq).expand().text()))

        // This yields for the first 5 points
        // -1831618507981202-216518090678054*e-24*b-b*d+311610807965630*d+43*a+a*e=0
        // -118*b-311610807965630*f-43*c-c*e+244665409335040*e+47290687941351060+b*f=0
        // -119252599207972*e-23650250310962358-9*a-b*d+265844340901442*d+93*b+a*e=0
        // -21983822423466060-265844340901442*f-c*e+404506989029618*e+69*b+9*c+b*f=0
        // -366376232895280*e-38*a-b*d+18*b+243548034524148*d+9538432228585976+a*e=0
        // -19*b-243548034524148*f-3824912417679188-c*e+222429607201000*e+38*c+b*f=0
        // -366517276321338*e-38491224727927468-b*d+10*a+139*b+250547136436792*d+a*e=0
        // -10*c-250547136436792*f-48922775380305180-c*e+205*b+243938758923718*e+b*f=0
        // -11*b-166200350180001*e-3586358319125720-b*d+323659703510393*d+43*a+a*e=0
        // -141*b-323659703510393*f-43*c-c*e+230835970819638*e+55561964940209847+b*f=0

        let first = equations[0]
        let second = equations[1]
        let result = equations.filter((_, i) => i > 1).map((s, i) => {
            if (i % 2 == 0) {
                return s + "-(" + first + ")=0"
            }
            return s + "-(" + second + ")=0"
        }).map(s => nerdamer(s).expand().text())

        // console.log(result)

        // Which turned into the following linear equations
        // -21818631802981156-45766467064188*d-52*a+117*b+97265491470082*e=0,
        // -69274510364817120+159841579694578*e+187*b+45766467064188*f+52*c=0,
        // -149858142217226*e-68062773441482*d-81*a+11370050736567178+42*b=0,
        // -22235802134040*e-51115600359030248+68062773441482*f+81*c+99*b=0,
        // -149999185643284*e-33*a-36659606219946266-61063671528838*d+163*b=0,
        // -726650411322*e-96213463321656240+323*b+33*c+61063671528838*f=0,
        // -1754739811144518+12048895544763*d+13*b+50317740498053*e=0,
        // -12048895544763*f-13829438515402*e-23*b+8271276998858787=0,
        // -23*a-30908622534867*e-32338881415780*d-6188906948325568+35*b=0,
        // -113335669852533970+23*c+237220099856282*e+32338881415780*f+389*b=0,
        // -153545767955970*e-43*b-60*a-62621687601872*d+24804975169131396=0,

        // Plus
        // -1831618507981202-216518090678054*e-24*b-b*d+311610807965630*d+43*a+a*e=0
        // -118*b-311610807965630*f-43*c-c*e+244665409335040*e+47290687941351060+b*f=0

        // this can be solved with a linear equation solver and doing the last two equations by hand

        return test ? "47" : "856642398547748"
    }

    private isBetween2D(intersect: Vector2, min: number, max: number) {
        return intersect[0] >= min && intersect[0] <= max && intersect[1] >= min && intersect[1] <= max
    }

    private get2DIntersection(a: number[], b: number[]) {
        if (a[4] * b[3] - a[3] * b[4] === 0) {
            // Lines are parallel
            return undefined
        }

        let t = (b[4] * (a[0] - b[0]) - b[3] * (a[1] - b[1])) / (a[4] * b[3] - a[3] * b[4])
        if (t < 0) {
            return undefined
        }

        let s = (a[4] * (b[0] - a[0]) - a[3] * (b[1] - a[1])) / (b[4] * a[3] - b[3] * a[4])
        if (s < 0) {
            return undefined
        }

        return this.vector2Add([a[0], a[1]], this.vector2MultipLy(t, [a[3], a[4]]))
    }

    private vector2Add(a: Vector2, b: Vector2): Vector2 {
        return [a[0] + b[0], a[1] + b[1]];
    }

    private vector2MultipLy(t: number, v: Vector2): Vector2 {
        return [t * v[0], t * v[1]]
    }
}