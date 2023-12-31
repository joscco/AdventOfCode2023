import {Arr, NumArr} from "./Arr";

export class Str{

    private value: string

    constructor(value: string) {
        this.value = value
    }

    containsRepeatingLetters(): boolean {
        return new Set(this.value.split("")).size !== this.length()
    }

    length(): number {
        return this.value.length
    }

    charCodeAt(index: number): number {
        return this.value.charCodeAt(index)
    }

    isUpperCase(): boolean {
        return /^[A-Z]*$/.test(this.toString())
    }

    isNaturalNumber(): boolean {
        return /^[0-9]*$/.test(this.toString())
    }

    isNumber(): boolean {
        return !isNaN(Number(this))
    }

    parseRows(): Arr<Str> {
        return new Arr(this.value.split("\n").map(val => new Str(val)))
    }

    parseIntRows(): NumArr {
        return new NumArr(this.value.split("\n").map(val => parseInt(val)));
    }

    toString(): string {
        return this.value
    }

    equals(other: Str | string): boolean {
        if (typeof other === 'string') {
            return other === this.value
        }
        return other.value === this.value
    }

    split(el: string | RegExp): Arr<Str> {
        return new Arr(this.value.split(el).map(val => new Str(val)))
    }

    slice(from: number, to: number): Str {
        return new Str(this.value.slice(from, to))
    }

    splitAt(index: number): Arr<Str> {
        let splitArr = [this.value.slice(0, index), this.value.slice(index, this.length())]
        return new Arr(splitArr).map(val => new Str(val))
    }

    slideWindow(width: number): Str[] {
        let result = [];
        for (let i = width - 1; i < this.length(); i++) {
            let newValue = this.value.slice(i - width + 1, i + 1)
            result.push(new Str(newValue))
        }
        return result
    }

    parseInt(): number {
        return parseInt(this.value)
    }

    concat(val: Str): Str {
        this.value = Str.concat(this, val).value
        return this
    }

    static equals<T>(a: T, b: T) {
        if (a instanceof Str && b instanceof Str) {
            return a.value === b.value
        }
        return false
    }

    match(regex: RegExp): RegExpMatchArray | null {
        return this.value.match(regex)
    }

    static concat(str: Str, str2: Str) {
        return new Str(str.value + str2.value);
    }

    matchAll(regExp: RegExp): Array<RegExpMatchArray> {
        return Array.from(this.value.matchAll(regExp))
    }

    trim() {
        return new Str(this.value.trim())
    }

    charAt(number: number) {
        return this.value.charAt(number);
    }

    dropFirstChars(number: number) {
        return new Str(this.value.slice(number))
    }

    contains(str: string): boolean {
        return this.value.includes(str)
    }

    dropLastChars(number: number) {
        return new Str(this.value.slice(0, this.length() - number))
    }
}