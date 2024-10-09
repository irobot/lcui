/**
 * [buyIndex, sellIndex, profit]
 */
export type Trade = [number, number, number]

export type SpanEnds = "start" | "end"

/**
 * To find the max profit we would walk the list of
 * prices from left to right first, and then in reverse,
 * adjusting trade 1's buy and sell indicies as we go.
 */
export type Stage = "left" | "right"