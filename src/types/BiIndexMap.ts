export class BiIndexMap<T> {

    internalMap: Map<string, T> = new Map<string, T>()

    set([i,j]: number[], value: T) {
        this.internalMap.set(i + "_" + j, value)
    }

    get([i,j]: number[]): T | undefined {
        return this.internalMap.get(i + "_" + j)
    }

    has([i,j]: number[]): boolean {
        return this.internalMap.has(i + "_" + j)
    }
}