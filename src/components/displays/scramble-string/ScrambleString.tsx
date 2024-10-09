import { Sequence } from "./Sequence"
import { useEffect, useState } from "react"
import Cell from "./Cell"
import {
  type SequenceItem,
  makeSequence,
  makeId,
  isSequence,
} from "../../types"
import styled from "styled-components"
import type { ScrambleStringCase } from "./data/cases"

type CharCount = Record<string, number>

function process(c1: string, c2: string, charSet: CharCount): number {
  if (c1 === c2) {
    return 0
  }
  const lastC1 = charSet[c1] ?? 0
  charSet[c1] = lastC1 + 1
  const lastC2 = charSet[c2] ?? 0
  charSet[c2] = lastC2 - 1
  const d1 = lastC1 >= 0 ? 1 : -1
  const d2 = lastC2 <= 0 ? 1 : -1
  return d1 + d2
}

const getCounts = (s1: string, s2: string) => {
  const setLeft: CharCount = {}
  const setRight: CharCount = {}
  let leftCount = 0
  let rightCount = 0
  const n = s1.length
  const leftCounts: number[] = []
  const rightCounts: number[] = []
  for (let i = 0; i < n; i++) {
    const s1l = s1[i]
    const s2l = s2[i]
    const s2r = s2[n - i - 1]
    const leftRes = process(s1l, s2l, setLeft)
    const rightRes = process(s1l, s2r, setRight)
    leftCount += leftRes
    rightCount += rightRes
    leftCounts[i] = leftCount
    rightCounts[i] = rightCount
  }
  return [leftCounts, rightCounts] as const
}

type ItemProps = {
  char1: string
  char2: string
  countLeft: number
  countRight: number
}

type SequenceMap = Record<number, ItemProps[]>

const processSequence = (
  sequenceMap: SequenceMap,
  sequence: SequenceItem,
  s1: string,
  s2: string,
  inOrderIndex: number = 0
): number => {
  let subS1 = ""
  let subS2 = ""
  for (let i = 0; i < sequence.value.length; i++) {
    const value = sequence.value[i]
    if (isSequence(value)) {
      inOrderIndex = processSequence(sequenceMap, value, s1, s2, inOrderIndex)
      continue
    }

    subS1 += s1[inOrderIndex++]
    subS2 += s2[value.value]
  }

  const [leftCounts, rightCounts] = getCounts(subS1, subS2)
  sequenceMap[sequence.id] = leftCounts.map((countLeft, i) => ({
    countLeft,
    countRight: rightCounts[i],
    char1: subS1[i],
    char2: subS2[i],
  }))

  return inOrderIndex
}

type SequenceDisplayProps = {
  sequence: SequenceItem
  map: SequenceMap
  field: keyof ItemProps
  onChange?: (sequence: SequenceItem) => void
  editable?: boolean
}

function ScrambledSequence(props: SequenceDisplayProps) {
  return (
    <Sequence
      editable={props.editable ?? false}
      onChange={props.onChange}
      items={props.sequence}
      renderItem={(seqId, _, idx) => {
        const itemProps = props.map[seqId][idx]
        return itemProps ? <Cell value={`${itemProps[props.field]}`} /> : null
      }}
    />
  )
}

const CaseDisplayContainer = styled.div`
  overflow: auto clip;
  max-width: max-content;
  scrollbar-width: none;
  position: relative;
`

function CaseDisplay(props: {
  left: string
  right: string
  seq: SequenceItem
  onChange: (seq: SequenceItem) => void
}) {
  const { seq } = props
  const seqMap: SequenceMap = {}
  processSequence(seqMap, seq, props.left, props.right)

  return (
    <CaseDisplayContainer>
      <ScrambledSequence sequence={seq} map={seqMap} field="char1" />
      <ScrambledSequence
        editable={true}
        sequence={seq}
        map={seqMap}
        field="char2"
        onChange={props.onChange}
      />
      <ScrambledSequence sequence={seq} map={seqMap} field="countLeft" />
      <ScrambledSequence sequence={seq} map={seqMap} field="countRight" />
    </CaseDisplayContainer>
  )
}

const ControlsContainer = styled.div`
  display: grid;
  justify-content: space-between;
  grid-auto-flow: column;
  gap: 1em;
  padding: 0.5em;
`

const Result = styled.div`
  padding: 0.75em 1em;
  border: 1px solid #222;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
`

const ResultTrue = styled(Result)`
  background-color: #28a745;
  color: #222;
`

const ResultFalse = styled(Result)`
  background-color: #dc3545;
`

const Container = styled.div`
  container-type: inline-size;
  display: flex;
  justify-content: center;
`

const Centered = styled.div`
  max-width: 100cqi;
`

const sequenceFromString = (str: string) =>
  makeSequence(str.split("").map((_, idx) => makeId(idx)))

export function ScrambleString(props: { caseData: ScrambleStringCase }) {
  const [left, right] = props.caseData.input
  const [seq, setSeq] = useState<SequenceItem>(sequenceFromString(left))
  useEffect(() => setSeq(sequenceFromString(left)), [left])

  return (
    <Container>
      <Centered>
      <ControlsContainer>
        <button onClick={() => setSeq(sequenceFromString(left))}>Reset</button>
        {props.caseData.output ? (
          <ResultTrue>Is Scrambled</ResultTrue>
        ) : (
          <ResultFalse>Not Scrambled</ResultFalse>
        )}
      </ControlsContainer>
      <CaseDisplay left={left} right={right} seq={seq} onChange={setSeq} /></Centered>
    </Container>
  )
}

export default ScrambleString
