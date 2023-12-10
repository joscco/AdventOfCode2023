import {Vector2} from "./Dict";

export function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
    return a * (b / gcd(a, b));
}

export function range_lcm(arr: number[]): number {
    return arr.reduce((currentLcm, newVal) => lcm(currentLcm, newVal), arr[0])
}

export function add(a: Vector2, b: Vector2): Vector2 {
    return [a[0] + b[0], a[1] + b[1]]
}