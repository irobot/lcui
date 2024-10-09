import { intersect } from "@/util/math"
import type { BuySellState } from "./state"
import type { Trade } from "./types"

export const getStackItem = (state: BuySellState, idx: number) =>
  state.stack[idx]

export const getStackTop = (state: BuySellState) =>
  getStackItem(state, state.stack.length - 1)

export const getTradeBuyIdx = (item: Trade) => item[0]
export const getTradeSellIdx = (item: Trade) => item[1]
export const getTradeProfit = (item: Trade) => item[2]

export const calcProfit = (
  state: BuySellState,
  buyIdx: number,
  sellIdx: number
) => state.prices[sellIdx] - state.prices[buyIdx]

export const getProfit1 = (state: BuySellState) =>
  calcProfit(state, state.buyIdx, state.sellIdx)

export const getProfit2 = (state: BuySellState) => {
  if (state.stack.length === 0) {
    return 0
  }
  const top = getStackTop(state)
  const idx = getTradeSellIdx(top)
  const profit = getTradeProfit(top)
  return state.buyIdx > idx ? profit : 0
}

export const getProfit = (state: BuySellState) => {
  const profit1 = getProfit1(state)
  const profit2 = getProfit2(state)
  return profit1 + profit2
}

export const getProfitSpansIntersection = (state: BuySellState) => {
  const stackTop = getStackTop(state)
  if (stackTop === undefined) {
    return undefined
  }
  const stackBuyIdx = getTradeBuyIdx(stackTop)
  const stackSellIdx = getTradeSellIdx(stackTop)
  return intersect([state.buyIdx, state.sellIdx], [stackBuyIdx, stackSellIdx])
}

export const shouldBumpStartRight = (state: BuySellState) => {
  const { prices, sellIdx } = state
  const profit = getProfit1(state)
  return state.stage === "left" && (profit < 0 || sellIdx === prices.length - 1)
}

export const shouldPush = (state: BuySellState) => {
  const { prices, sellIdx, stack } = state
  const profit = getProfit1(state)
  const stackProfit = stack.length > 0 ? getTradeProfit(getStackTop(state)) : 0
  return (
    state.stage === "left" &&
    profit > stackProfit &&
    prices[sellIdx + 1] < prices[sellIdx]
  )
}

export const shouldPop = (state: BuySellState) =>
  state.stage === "right" && getProfitSpansIntersection(state) !== undefined

export const shouldBumpEndRight = (state: BuySellState) =>
  state.stage === "left" && !shouldBumpStartRight(state) && !shouldPush(state)

export const shouldBumpEndLeft = (state: BuySellState) =>
  state.stage === "right" && getProfit1(state) < 0 && state.sellIdx > 0

export const shouldBumpStartLeft = (state: BuySellState) =>
  state.stage === "right" && state.stack.length > 0
