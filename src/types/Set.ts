import {Vector2} from "./Dict";

export class Set<K> {
    private map = new Map<string, K>()

    constructor(public toIdString: (k: K) => string, entries?: Iterable<K>) {
        if (entries) {
            for (const k of entries) {
                this.add(k);
            }
        }
    }

    add(k: K) {
        this.map.set(this.toIdString(k), k);
        return this;
    }


    remove(k: K) {
        this.map.delete(this.toIdString(k))
    }

    has(k: K): boolean {
        return this.map.has(this.toIdString(k))
    }

    [Symbol.iterator](): Iterator<K> {
        return this.map.values();
    }

    values(): Array<K> {
        let entries: K[] = []
        for (let [id, value] of this.map.entries()) {
            entries.push(value)
        }
        return entries
    }

    copy() {
        return new Set<K>((k: K) => this.toIdString(k), this.values())
    }
}

export class Vector2Set extends Set<Vector2> {
    constructor(entries?: Iterable<Vector2>) {
        super(v => v[0] + "," + v[1], entries);
    }
}

export class Vector2ArrSet extends Set<Vector2[]> {
    constructor(entries?: Iterable<Vector2[]>) {
        super(vec => vec.map(v => v[0] + "," + v[1]).join("_"), entries);
    }
}