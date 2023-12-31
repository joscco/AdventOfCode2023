import {IDENTITY} from "./General";
import {Str} from "./Str";
import {Vector2} from "./Dict";

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

    pushArr(arr: Arr<T>): Arr<T> {
        this.elements.push(...arr.elements)
        return this;
    }

    except(el: T): Arr<T> {
        return this.filter(val => val != el)
    }

    map<U>(callback: (value: T, index: number) => U): Arr<U> {
        return new Arr(this.elements.map(callback))
    }

    filter(callback: (value: T, index: number) => boolean): Arr<T> {
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

    getIndicesWith(lambda: (val: T) => boolean): NumArr {
        let result = []
        for (let i = 0; i < this.length(); i++) {
            if (lambda(this.elements[i])) {
                result.push(i)
            }
        }
        return new NumArr(result)
    }

    getElementsWith(lambda: (val: T, index: number) => boolean): Arr<T> {
        let result = []
        for (let i = 0; i < this.length(); i++) {
            if (lambda(this.elements[i], i)) {
                result.push(this.elements[i])
            }
        }
        return new Arr<T>(result)
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

    sort(compare?: ((a: T, b: T) => number) | undefined): Arr<T> {
        return new Arr(this.elements.sort(compare))
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

    minMax(sortFn: (a: T, b: T) => number): [T, T] {
        return [this.min(sortFn), this.max(sortFn)]
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

    slideWindow(width: number): Arr<Arr<T>> {
        let result: Arr<Arr<T>> = new Arr();
        for (let i = width - 1; i < this.length(); i++) {
            result.push(new Arr(this.elements.slice(i - width + 1, i + 1)))
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

    static zip<T, V>(a: Arr<T>, b: Arr<V>): Arr<[T, V]> {
        let result = new Arr<[T, V]>()
        for (let i = 0; i < Math.max(a.length(), b.length()); i++) {
            result.push([a.get(i % a.length()), b.get(i % b.length())])
        }
        return result
    }

    some(param: (other: T) => boolean): boolean {
        return this.elements.some(param)
    }

    flatMap<V>(param: (val: T, index: number) => Arr<V>): Arr<V> {
        let result = new Arr<V>()
        this.elements.map(param).forEach(val => result.pushArr(val))
        return result
    }

    all(param: (val: T, index: number) => boolean) {
        return this.elements.every(param);
    }


    dropFirst(n: number) {
        return this.filter((v, i) => i >= n)
    }

    remove(s: T) {
        const index = this.elements.indexOf(s, 0);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
    }
}

export class NumArr extends Arr<number> {

    constructor(elements?: number[]) {
        super(elements ?? []);
    }

    sum(): number {
        return this.elements.reduce((a, b) => a + b, 0)
    }

    multiply(): number {
        return this.elements.reduce((a, b) => a * b, 1)
    }

    static interval(from: number, to: number): NumArr {
        if (from > to) {
            return NumArr.interval(to, from)
        }

        let result = new NumArr()
        for (let i = from; i <= to; i++) {
            result.push(i)
        }
        return result
    }
}

export class Arr2D<T> extends Arr<Arr<T>> {
    static from<U>(arr: Arr<Arr<U>>): Arr2D<U> {
        let result: Arr2D<U> = Arr2D.empty(arr.length())
        for (let i = 0; i < arr.length(); i++) {
            result.set(i, arr.get(i).copy())
        }
        return result
    }

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

    filter2D(callback: (value: T, index: Vector2) => boolean): Arr<[T, Vector2]> {
        let result: Arr<[T, Vector2]> = new Arr();

        for (let rowI = 0; rowI < this.elements.length; rowI++) {
            for (let colI = 0; colI < this.get(rowI).length(); colI++) {
                let el = this.get(rowI).get(colI)
                // Column first!
                let index = [colI, rowI] as Vector2
                if (callback(el, [colI, rowI])) {
                    result.push([el, index])
                }
            }
        }
        return result
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