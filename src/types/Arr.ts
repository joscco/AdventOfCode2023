import {IDENTITY} from "./General";
import {Str} from "./Str";

export class Arr<T> {
    elements: T[]

    constructor(elements?: T[]) {
        this.elements = elements ?? []
    }

    length() {
        return this.elements.length
    }

    push(...arr: T[]): Arr<T> {
        this.elements.push(...arr)
        return this;
    }

    map<U>(callback: (value: T) => U): Arr<U> {
        return new Arr(this.elements.map(callback))
    }

    filter(callback: (value: T) => boolean): Arr<T> {
        return new Arr(this.elements.filter(callback))
    }

    reduce<U>(callbackfn: (previousValue: U, currentValue: T) => U, initialValue: U): U {
        return this.elements.reduce(callbackfn, initialValue)
    }

    count(value: T): number {
        let filtered = this.elements.filter(val => value === val)
        return filtered.length
    }

    contains(element: T): boolean {
        return this.elements.indexOf(element) > -1
    }

    containsRepeatingElements(): boolean {
        return new Set(this.elements).size !== this.length()
    }

    get(index: number): T {
        return this.elements[index];
    }

    set(index: number, other: T) {
        this.elements[index] = other
    }

    getMultiple(indices: number[]): Arr<T> {
        return new Arr(indices.map(index => this.elements[index]));
    }

    getFirstThat(condition: (element: T) => boolean): T | undefined {
        for (let element of this.elements) {
            if (condition(element)) {
                return element
            }
        }
        return undefined
    }

    first(): T {
        return this.get(0)
    }

    last(): T {
        return this.get(this.length() - 1)
    }

    groupSplit(separator: T): Arr2D<T> {
        let groups: Arr2D<T> = new Arr2D<T>();
        let currentGroup: Arr<T> = new Arr<T>();
        for (let i = 0; i < this.length(); i++) {
            if (this.elements[i] === separator || Str.equals(this.elements[i], separator)) {
                groups.push(currentGroup)
                currentGroup = new Arr<T>()
            } else {
                currentGroup.push(this.elements[i])
            }
        }
        // Don't forget the last group!
        groups.push(currentGroup)
        return groups
    }

    offset(positions: number): Arr<T> {
        while (positions < 0 || positions >= this.length()) {
            positions = (this.length() + positions) % this.length()
        }
        return new Arr([...this.elements.slice(positions, this.length()), ...this.elements.slice(0, positions)])
    }

    rotate(positions: number): T[] {
        while (positions < 0) {
            positions += this.length()
        }

        if (positions > this.length()) {
            positions %= this.length()
        }

        return [...this.elements.slice(this.length() - positions, this.length()), ...this.elements.slice(0, this.length() - positions)]
    }

    groupSplitBySize(size: number): Arr2D<T> {
        let groups: Arr2D<T> = new Arr2D<T>();
        for (let i = 0; i < this.length() / size; i++) {
            groups.push(new Arr([...this.elements.slice(size * i, size * (i + 1))]))
        }
        return groups
    }

    toArray(): T[] {
        return this.elements;
    }

    toNumArr(): NumArr {
        if (typeof this.get(0) === 'number') {
            return new NumArr(this.elements as number[])
        }
        return new NumArr()
    }

    max(sortFn: (a: T, b: T) => number): T {
        let currentMax = this.elements[0]
        for (let i = 1; i < this.length(); i++) {
            if (sortFn(currentMax, this.elements[i]) <= 0) {
                currentMax = this.elements[i]
            }
        }
        return currentMax
    }

    min(sortFn: (a: T, b: T) => number): T {
        return this.max((a, b) => -sortFn(a, b))
    }

    maxN(n: number, sortFn: (a: T, b: T) => number): T[] {
        let sorted = Object.assign([], this).sort(sortFn)
        return sorted.slice(this.length() - n, this.length())
    }


    reverse(): Arr<T> {
        let result = []
        for (let i = this.length() - 1; i >= 0; i--) {
            result.push(this.elements[i])
        }
        return new Arr(result)
    }

    slideWindow(width: number): T[][] {
        let result = [];
        for (let i = width - 1; i < this.length(); i++) {
            result.push(this.elements.slice(i - width + 1, i + 1))
        }
        return result
    }

    log(lambda?: (item: T) => any[]): Arr<T> {
        if (lambda) {
            this.elements.forEach(item => console.log(...lambda(item)))
        } else {
            this.elements.forEach(item => console.log(item))
        }

        return this
    }

    copy() {
        return this.map(IDENTITY)
    }

    slice(from?: number, to?: number): Arr<T> {
        return new Arr(this.elements.slice(from, to))
    }
}

export class NumArr extends Arr<number> {

    constructor(elements?: number[]) {
        super(elements ?? []);
    }

    add(): number {
        return this.elements.reduce((a, b) => a + b, 0)
    }

    multiply(): number {
        return this.elements.reduce((a, b) => a * b, 1)
    }
}

export class Arr2D<T> extends Arr<Arr<T>> {
    transpose(): Arr2D<T> {
        let result: Arr2D<T> = new Arr2D<T>()
        for (let i = 0; i < this.length(); i++) {
            for (let j = 0; j < this.get(0).length(); j++) {
                result.get(j).push(this.get2D(i, j))
            }
        }
        return result
    }

    get2D(row: number, col: number): T {
        return this.get(row).get(col);
    }

    getFirsts(): Arr<T> {
        return this.map(el => el.get(0))
    }

    static empty<U>(length: number): Arr2D<U> {
        let result = new Arr2D<U>()
        for (let i = 0; i < length; i++) {
            result.push(new Arr<U>())
        }
        return result
    }

    static copy<U>(stacks: Arr2D<U>) {
        let result = new Arr2D<U>()
        for (let i = 0; i < stacks.length(); i++) {
            result.push(stacks.get(i).copy())
        }
        return result
    }
}