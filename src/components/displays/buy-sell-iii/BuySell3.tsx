import { useContext, useReducer } from "react"
import ArrayView from "@comp/primitives/array"
import { type BuySell3Case } from "./data/cases"
import Stack from "@comp/primitives/stack/Stack"
import styled from "styled-components"
import {
  bumpSpanStart,
  bumpSpanEnd,
  buySellReducer,
  createInitialState,
  stackPush,
  stackPop,
  stackHover,
  stackUnhover,
  type BuySellState,
  type Dispatch,
} from "./logic/state"
import type { SpanCompProps } from "@comp/primitives/array/Span"
import { intersect } from "@/util/math"
import { BumpButtons, Button } from "@/components/ui/Buttons"
import {
  getProfit1,
  getProfit2,
  getStackItem,
  getTradeBuyIdx,
  getTradeProfit,
  getTradeSellIdx,
  getStackTop,
  shouldBumpStartLeft,
  shouldBumpStartRight,
  shouldBumpEndLeft,
  shouldBumpEndRight,
  shouldPop,
  shouldPush,
} from "@/components/displays/buy-sell-iii/logic/selectors"
import type { Trade } from "./logic/types"
import {
  DisplayContext,
} from "@/components/ui/DisplayContainer"

const LayoutContainer = styled.div`
  display: grid;
  row-gap: 1em;
  padding: 0;
  grid-template-areas:
    "_1 sum _2"
    "prices prices prices"
    "_3 case _4";
  grid-template-columns: 1fr auto 1fr;
  container-type: inline-size;
`

const ControlsContainer = styled.div`
  justify-self: center;
  grid-area: case;
  display: grid;
  grid-auto-flow: column;
  gap: 1em;
  justify-content: space-between;
  grid-template-areas: "left right pad push pop";
  grid-template-columns: auto auto 1fr auto auto;
  isolation: isolate;

  @container (max-width: 640px) {
    grid-auto-flow: row;
    justify-items: center;
    justify-content: unset;
    grid-template-columns: auto;
    grid-template-areas:
      "push pop"
      "left right";

    & > :nth-child(2n) {
      justify-self: start;
    }
    & > :nth-child(2n + 1) {
      justify-self: end;
    }
  }
`

const ArrayContainer = styled.div`
  grid-area: prices;
  display: flex;
  flex-direction: column;
  align-items: safe center;
  position: relative;
  container-type: inline-size;
  overflow: auto hidden;
  overflow: auto clip;
  scrollbar-width: none;

  & > div {
    @container (width: 90vw) {
      align-self: center;
    }
  }
`

const StackContainer = styled.div`
  align-self: end;
  display: flex;
  justify-content: end;
`

const ProfitContainer = styled.div`
  grid-area: sum;
  display: grid;
  grid-template-areas: "pr1 plus pr2 eqs prt";
  grid-template-columns: 1fr auto 1fr auto 1fr;
  grid-template-rows: 1fr;
  align-items: center;
  gap: 0.5rem;
  max-width: fit-content;
`

const CellContainer = styled.div`
  min-width: 3rem;
  min-height: 3rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Cell = (props: { value: number; area?: string }) => (
  <CellContainer style={{ gridArea: props.area ?? "" }}>
    {props.value}
  </CellContainer>
)

const ResultCell = styled.div<{ $isNewMax: boolean }>`
  box-sizing: border-box;
  display: grid;
  grid-template-areas:
    "label expected"
    "max   max";
  align-items: center;
  font-weight: bold;
  min-width: 15rem;
  height: 14rem;
  transition: border-color 0.5s ease-in, box-shadow 0.5s;
  border: 4px solid;
  border-color: ${(props) => (props.$isNewMax ? "orange" : "gray")};

  @container (max-width: 468px) {
    min-width: 12rem;
    height: 12rem;
  }
`

const MaxLabel = styled.span`
  grid-area: label;
  color: #666;
  font-weight: bold;
  place-self: start;
  grid-area: 1 / 1;
  position: relative;
  top: 1rem;
  left: 1rem;
`

const TargetContainer = styled.span`
  grid-area: expected;
  justify-self: end;
  position: relative;
  top: 1rem;
  right: 1rem;
`

const TargetLabel = styled.span`
  color: #666;
  margin-right: 0.5em;
`

const MaxValue = styled.span`
  font-size: 10rem;
  justify-self: center;
  align-self: center;
  grid-area: 1 / 1 / -1 / -1;
  position: relative;
  top: -1rem;

  @container (max-width: 468px) {
    font-size: 8rem;
    top: 0;
  }
`

const SumContainer = styled.div`
  grid-column: 2 / 3;
  justify-self: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
`

const MainContainer = styled.div`
  grid-area: sum;
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  @container (min-width: 400px) {
    gap: 2rem;
  }
`

const SpanProfit = (props: { profit: number }) => <div>{props.profit}</div>

function Profit(props: {
  profit1: number
  profit2: number
  max: number
  prevMax: number
  expected: number
}) {
  return (
    <SumContainer>
      <ResultCell $isNewMax={props.max !== props.prevMax}>
        <MaxLabel>Max</MaxLabel>
        <TargetContainer>
          <TargetLabel>Target</TargetLabel>
          {props.expected}
        </TargetContainer>
        <MaxValue>{props.max}</MaxValue>
      </ResultCell>
      <ProfitContainer>
        <Cell area="pr1" value={props.profit1} />
        <span style={{ gridArea: "plus" }}> + </span>
        <Cell area="pr2" value={props.profit2} />
        <span style={{ gridArea: "eqs" }}> = </span>
        <Cell area="prt" value={props.profit1 + props.profit2} />
      </ProfitContainer>
    </SumContainer>
  )
}

const makeTopSpan = (state: BuySellState): SpanCompProps | undefined => {
  const itemIdx =
    state.stackHilightIdx !== undefined
      ? state.stackHilightIdx
      : state.stack.length > 0
      ? state.stack.length - 1
      : undefined

  if (itemIdx === undefined) {
    return undefined
  }

  const item = getStackItem(state, itemIdx)
  const spanColor = "#888"

  return {
    start: getTradeBuyIdx(item),
    end: getTradeSellIdx(item),
    color: spanColor,
    placement: "top",
    children: <SpanProfit profit={getTradeProfit(item)} />,
  }
}

const StackItemContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
`

const StackCell = styled.div`
  display: flex;
  height: 3em;
  min-width: 3em;
  border: 1px solid ${(props) => props.theme.colors.border};
  align-items: center;
  justify-content: center;
`

const makeRenderStackItem =
  (dispatch: Dispatch) => (item: Trade, idx: number) =>
    (
      <StackItemContainer
        onPointerMove={() => dispatch(stackHover({ idx }))}
        onPointerLeave={() => dispatch(stackUnhover())}
      >
        <StackCell>{getTradeProfit(item)}</StackCell>
      </StackItemContainer>
    )

export function BuySell3(props: { caseData: BuySell3Case }) {
  const { hintsEnabled } = useContext(DisplayContext)
  const [state, dispatch] = useReducer(
    buySellReducer,
    createInitialState(props.caseData.input),
  )

  const expected = props.caseData.output
  const prices = state.prices

  const { buyIdx, sellIdx, stack } = state
  const profit = getProfit1(state)
  const profit2 = getProfit2(state)

  const stackProfit = stack.length > 0 ? getTradeProfit(getStackTop(state)) : 0
  const spanColor =
    profit >= 0 ? (profit > stackProfit ? "green" : "#888") : undefined

  const bottomSpan: SpanCompProps = {
    start: buyIdx,
    end: sellIdx,
    color: spanColor,
    children: <SpanProfit profit={profit} />,
  }
  const topSpan = makeTopSpan(state)
  const arrHilightIdx =
    state.stackHilightIdx !== undefined
      ? getTradeSellIdx(getStackItem(state, state.stackHilightIdx))
      : undefined

  const stackTop = getStackTop(state)
  let highlightRange: [number, number] | undefined = undefined
  if (stackTop !== undefined) {
    const stackTopLeft = getTradeBuyIdx(stackTop)
    const stackTopRight = getTradeSellIdx(stackTop)
    highlightRange = intersect([buyIdx, sellIdx], [stackTopLeft, stackTopRight])
  }

  // Hint queries are overkill in this case.
  // I'm planning to use them for the next version.
  const hintQuery = (key: string) => {
    if (!hintsEnabled) {
      return false
    }
    switch (key) {
      case "bump-left-right":
        return shouldBumpStartRight(state)
      case "bump-right-left":
        return shouldBumpEndLeft(state)
      case "bump-right-right":
        return shouldBumpEndRight(state)
      case "bump-left-left":
        return shouldBumpStartLeft(state)
      case "push":
        return shouldPush(state)
      case "pop":
        return shouldPop(state)
    }
    return false
  }

  const renderStackItem = makeRenderStackItem(dispatch)

  return (
    <LayoutContainer>
      <MainContainer>
        <Profit
          profit1={profit}
          profit2={profit2}
          max={state.maxProfit}
          prevMax={state.prevMax}
          expected={expected}
        />
        <StackContainer>
          <Stack values={stack} render={renderStackItem} />
        </StackContainer>
      </MainContainer>
      <ControlsContainer>
        <BumpButtons
          style={{ gridArea: "left" }}
          label="Left"
          bumpAction={(delta) => dispatch(bumpSpanStart(delta))}
          hintKeyMinus="bump-left-left"
          hintKeyPlus="bump-left-right"
          hintQuery={hintQuery}
        />
        <BumpButtons
          style={{ gridArea: "right" }}
          label="Right"
          bumpAction={(delta) => dispatch(bumpSpanEnd(delta))}
          hintKeyMinus="bump-right-left"
          hintKeyPlus="bump-right-right"
          hintQuery={hintQuery}
        />
        <Button
          style={{ gridArea: "push" }}
          hintKey="push"
          onClick={() => dispatch(stackPush())}
          hintQuery={hintQuery}
        >
          Push
        </Button>
        <Button
          style={{ gridArea: "pop" }}
          hintKey="pop"
          onClick={() => dispatch(stackPop())}
          hintQuery={hintQuery}
        >
          Pop
        </Button>
      </ControlsContainer>
      <ArrayContainer>
        <ArrayView
          values={prices}
          hilightIdx={arrHilightIdx}
          hilightRange={highlightRange}
          showIndex={state.spanHiglight === "start" ? buyIdx : sellIdx}
          spans={topSpan ? [topSpan, bottomSpan] : [bottomSpan]}
        />
      </ArrayContainer>
    </LayoutContainer>
  )
}
