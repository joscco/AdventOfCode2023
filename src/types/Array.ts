// Get the single item Type from Array Type
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

declare global {
    interface Array<T> {
        add(): number,

        count(value: T): number;

        contains(element: T): boolean;

        containsRepeatingElements(): boolean;

        findCommonSymbols(): String[][]

        get(indices: number[]): T[];

        getColumns(): T[]

        getFirsts(): ArrayElement<T>[];

        getFirst(condition: (element: T) => boolean): T;

        groupSplit(separator: String): T[][];

        groupSplitBySize(size: number): T[][];

        log(lambda?: (item: T) => any[]): T[];

        max(sortFn: (a: T, b: T) => number): T,

        min(sortFn: (a: T, b: T) => number): T,

        maxN(n: number, sortFn: (a: T, b: T) => number): T[]

        multiply(): number,

        offset(number: number): T[];

        reverse(): T[]

        rotate(number: number): T[];

        parseInt(): number[]

        slideWindow(width: number): T[][]
    }
}

Array.prototype.add = function (): number {
    return this.reduce((a, b) => a + b, 0)
}

Array.prototype.count = function <T>(value: T): number {
    let filtered = this.filter(val => value === val)
    return filtered.length
}

Array.prototype.findCommonSymbols = function (): String[][] {
    return this.map(arr => {
        let result = arr[0]
        for (let i = 1; i < arr.length; i++) {
            result = arr[i].findCommonLettersWith(result)
        }
        return result
    })
}

Array.prototype.contains = function <T>(element: T): boolean {
    return this.indexOf(element) > -1
}

Array.prototype.containsRepeatingElements = function (): boolean {
    return new Set(this).size !== this.length
}

Array.prototype.get = function <T>(indices: number[]): T[] {
    return this.filter((val, i) => indices.contains(i))
}

Array.prototype.getColumns = function <T>(): T[][] {
    let result: T[][] = makeEmpty2DArray(this[0].length)
    for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this[0].length; j++) {
            result[j].push(this[i][j])
        }
    }
    return result
}

Array.prototype.getFirsts = function <T>(): ArrayElement<T>[] {
    return this.map(el => el[0])
}

Array.prototype.getFirst = function <T>(condition: (element: T) => boolean): T | undefined {
    for (let element of this) {
        if (condition(element)) {
            return element
        }
    }
    return undefined
}

Array.prototype.groupSplit = function <T>(separator: T): T[][] {
    let groups: T[][] = [];
    let currentGroup: T[] = []
    for (let i = 0; i < this.length; i++) {
        if (this[i] === separator) {
            groups.push(currentGroup)
            currentGroup = []
        } else {
            currentGroup.push(this[i])
        }
    }
    // Don't forget the last group!
    groups.push(currentGroup)
    return groups
}

export function makeEmpty2DArray(length: number): any[][] {
    let result = []
    for (let i = 0; i < length; i++) {
        result.push([])
    }
    return result
}

Array.prototype.groupSplitBySize = function <T>(size: number): T[][] {
    let groups: T[][] = [];
    for (let i = 0; i < this.length / size; i++) {
        groups.push([...this.slice(size * i, size * (i + 1))])
    }
    return groups
}

Array.prototype.offset = function <T>(positions: number): T[] {
    while (positions < 0 || positions >= this.length) {
        positions = (this.length + positions) % this.length
    }
    return [...this.slice(positions, this.length), ...this.slice(0, positions)]
}

Array.prototype.rotate = function <T>(positions: number): T[] {
    while (positions < 0) {
        positions += this.length
    }

    if (positions > this.length) {
        positions %= this.length
    }

    return [...this.slice(this.length - positions, this.length), ...this.slice(0, this.length - positions)]
}

Array.prototype.parseInt = function (): number[] {
    return this.map(val => parseInt(val as string))
}

Array.prototype.max = function <T>(sortFn: (a: T, b: T) => number): number {
    let currentMax = this[0]
    for (let i = 1; i < this.length; i++) {
        if (sortFn(currentMax, this[i]) <= 0) {
            currentMax = this[i]
        }
    }
    return currentMax
}

Array.prototype.min = function <T>(sortFn: (a: T, b: T) => number): number {
    return this.max((a, b) => -sortFn(a, b))
}

Array.prototype.maxN = function <T>(n: number, sortFn: (a: T, b: T) => number): T[] {
    let sorted = Object.assign([], this).sort(sortFn)
    return sorted.slice(this.length - n, this.length)
}

Array.prototype.multiply = function (): number {
    return this.reduce((a, b) => a * b, 1)
}

Array.prototype.reverse = function <T>(): T[] {
    let result = []
    for (let i = this.length - 1; i >= 0; i--) {
        result.push(this[i])
    }
    return result
}

Array.prototype.slideWindow = function <T>(width: number): T[][] {
    let result = [];
    for (let i = width - 1; i < this.length; i++) {
        result.push(this.slice(i - width + 1, i + 1))
    }
    return result
}

Array.prototype.log = function <T>(lambda?: (item: T) => any[]): T[] {
    if (lambda) {
        this.forEach(item => console.log(...lambda(item)))
    } else {
        this.forEach(item => console.log(item))
    }

    return this
}

export function ORDER_NATURAL(a: number, b: number): number {
    return a - b
}


