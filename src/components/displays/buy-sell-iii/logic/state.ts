import { calcProfit, getProfit2, getProfit } from "./selectors"
import type { Reducer } from "react"
import type { SpanEnds, Stage, Trade } from "./types"

export type BuySellState = {
  /** Trade 1's buy index */
  buyIdx: number
  /** Trade 1's sell index */
  sellIdx: number
  maxProfit: number
  prevMax: number
  prices: number[]
  /**
   * A stack of candidates for Trade 2
   * (the second of the up to two allowed trades)
   **/
  stack: Trade[]
  /**
   * Which of the trades on the stack is highlighted
   *
   * @todo This doesn't belong in the state. Rather,
   * it should be stored inside the UI component
   * (useState). Move it.
   **/
  stackHilightIdx: number | undefined
  stage: Stage
  spanHiglight: SpanEnds
}

export const createInitialState = (prices: number[]): BuySellState => ({
  prices,
  buyIdx: 0,
  sellIdx: 0,
  maxProfit: 0,
  prevMax: 0,
  stack: [],
  stackHilightIdx: undefined,
  stage: "left",
  spanHiglight: "start",
})

const makeTrade = (
  buyAtIndex: number,
  sellAtIndex: number,
  profit: number
): Trade => [buyAtIndex, sellAtIndex, profit]

export type BumpSpan = {
  type: "bumpSpan"
  payload: {
    which: SpanEnds
    delta: -1 | 1
  }
}

type StackHover = {
  type: "stackHover"
  payload: { idx: number }
}

type StackAction = { type: "stackPush" | "stackPop" | "stackUnhover" }

type SetPrices = { type: "setPrices"; payload: number[] }

export type Actions = BumpSpan | StackAction | SetPrices | StackHover

export type Dispatch = (action: Actions) => void

const bumpReducer = (state: BuySellState, action: BumpSpan): BuySellState => {
  const { which, delta } = action.payload
  const { buyIdx: prevBuyIdx, sellIdx: prevSellIdx, prices } = state

  const isStart = which === "start"
  const lastIdx = Math.max(prices.length - 1, 0)

  const buyIdx = Math.min(
    lastIdx,
    Math.max(0, prevBuyIdx + (isStart ? delta : 0))
  )

  const sellIdx = Math.min(
    lastIdx,
    Math.max(buyIdx, prevSellIdx + (isStart ? 0 : delta))
  )

  const maxProfit = Math.max(
    state.maxProfit,
    calcProfit(state, buyIdx, sellIdx) + getProfit2(state)
  )

  const stage =
    isStart && sellIdx === lastIdx && buyIdx === lastIdx ? "right" : state.stage

  return {
    ...state,
    buyIdx,
    sellIdx,
    prevMax: state.maxProfit,
    maxProfit,
    stage,
    spanHiglight: which,
  }
}

const updateStack = (state: BuySellState, stack: Trade[]): BuySellState => {
  const newState = { ...state, stack }
  const maxProfit = Math.max(state.maxProfit, getProfit(newState))
  return { ...newState, maxProfit }
}

export const buySellReducer: Reducer<BuySellState, Actions> = (
  state,
  action
): BuySellState => {
  if (action.type === "bumpSpan") {
    return bumpReducer(state, action)
  }
  if (action.type === "stackPush") {
    const { prices, buyIdx, sellIdx, stack } = state
    const profit = prices[sellIdx] - prices[buyIdx]
    return updateStack(state, [...stack, makeTrade(buyIdx, sellIdx, profit)])
  }
  if (action.type === "stackPop") {
    const { stack } = state
    return stack.length > 0 ? updateStack(state, stack.slice(0, -1)) : state
  }
  if (action.type === "stackHover") {
    return {
      ...state,
      stackHilightIdx: action.payload.idx,
    }
  }
  if (action.type === "stackUnhover") {
    return { ...state, stackHilightIdx: undefined }
  }
  if (action.type === "setPrices") {
    return createInitialState(action.payload)
  }
  return state
}

const bumpSpan = (which: SpanEnds, delta: -1 | 1): BumpSpan => ({
  type: "bumpSpan",
  payload: { which, delta },
})

type EmptyAction = { type: string }
type PayloadAction = EmptyAction & { payload: unknown }
type Action = EmptyAction | PayloadAction
type Create<A extends Action> = A extends PayloadAction
  ? (payload: A["payload"]) => A
  : () => A

/** Bump the span's start to the left or right depending on delta */
export const bumpSpanStart = (delta: -1 | 1) => bumpSpan("start", delta)

/** Bump the span's end to the left or right depending on delta */
export const bumpSpanEnd = (delta: -1 | 1) => bumpSpan("end", delta)

export const stackPush: Create<StackAction> = () => ({ type: "stackPush" })
export const stackPop: Create<StackAction> = () => ({ type: "stackPop" })
export const stackUnhover: Create<StackAction> = () => ({
  type: "stackUnhover",
})
export const stackHover: Create<StackHover> = (payload) => ({
  type: "stackHover",
  payload,
})
export const setPrices: Create<SetPrices> = (payload) => ({
  type: "setPrices",
  payload,
})
