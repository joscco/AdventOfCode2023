/**
 * Balances the heap `items` from node `j` up to the root
 *
 * @param items heap to be balanced
 * @param compare function used to determine the order of the items
 * @param j start index
 */
export function heapifyUp<T>(
    items: Array<T>,
    compare: (a: T, b: T) => number,
    j: number
): void {
    let i = (j - 1) / 2 >> 0;
    while (j > 0 && compare(items[i], items[j]) < 0) {
        [items[i], items[j]] = [items[j], items[i]];
        j = i;
        i = (j - 1) / 2 >> 0;
    }
}

/**
 * Balances the heap `items` from node `i` down to the leaves
 *
 * @param items heap to be balanced
 * @param compare function used to determine the order of the items
 * @param i start index
 * @param n maximum (exclusive) index to be considered
 */
export function heapifyDown<T>(
    items: Array<T>,
    compare: (a: T, b: T) => number,
    i: number, n?: number
): void {
    let j, k: number;
    n = n ?? items.length;
    while (true) {
        j = 2 * i + 1;
        k = i;
        if (j < n && compare(items[j], items[k]) > 0) k = j;

        j++;
        if (j < n && compare(items[j], items[k]) > 0) k = j;

        if (k === i) break;

        [items[i], items[k]] = [items[k], items[i]];
        i = k;
    }
}

/**
 * Heap data structure
 */
export class Heap<T> {
    /**
     * Heap items
     */
    private items: Array<T>;

    /**
     * Creates a new instance of heap
     *
     * @param compare function used to determine the order of the items
     * @param items (unordered) array of initial heap items
     */
    public constructor(
        private compare: (a: T, b: T) => number,
        ...items: Array<T>
    ) {
        this.items = [];
        items.forEach(item => this.insert(item));
    }

    /**
     * Returns the current number of items
     */
    public get count(): number {
        return this.items.length;
    }

    /**
     * Inserts a new item into the heap
     *
     * @param item item to insert
     */
    public insert(item: T): void {
        const j = this.items.length;
        this.items[j] = item;
        heapifyUp(this.items, this.compare, j);
    }

    /**
     * Retrieves the largest/smallest item
     * (depending on the comparison function)
     */
    public remove(): T | undefined {
        const { items } = this;
        if (items.length === 0) {
            return undefined;
        }

        const result = items[0];
        if (items.length > 1) {
            items[0] = items[items.length - 1];
        }

        items.length--;
        if (items.length < 2) {
            return result;
        }

        heapifyDown(items, this.compare, 0);
        return result;
    }

    /**
     * Walks over the heap items in order of their priority
     *
     * @param visit function to be called for each item in the heap
     */
    public traverse(visit: (item: T) => void): void {
        const items = this.items.slice();
        while (items.length > 0) {
            visit(items[0]);

            if (items.length > 1) {
                items[0] = items[items.length - 1];
            }

            items.length--;
            if (items.length > 1) {
                heapifyDown(items, this.compare, 0);
            }
        }
    }
}