export function IDENTITY<Type>(arg: Type): Type {
    return arg;
}

export function ORDER_NATURAL(a: number, b: number): number {
    return a - b
}

export type ElementOf<A> = A extends readonly (infer T)[] ? T : never
