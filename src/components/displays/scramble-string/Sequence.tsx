import styled from "styled-components"
import { type SequenceItem, makeSequence, isSequence } from "../../types"
import type React from "react"

const SequenceContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  min-width: max-content;
  margin: 0.5em;
  background: #216e5121;
  align-items: center;
  justify-content: safe center;
  border: 1px solid #0006;
  &:hover {
    background-color: #00ffc921;
    cursor: pointer;
  }
`

const IndexMarker = styled.span`
  width: 0.5em;
  margin: 0 -0.5em;
  position: relative;
  left: 0.25em;
  height: 100%;
  background: aliceblue;
  opacity: 0;
  transition: opacity 0.2s ease-in;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`

const SequenceItemContainer = (props: {
  children?: (JSX.Element | null)[]
}) => {
  return props.children
}

const handleClick =
  (
    handler?: (() => void) | undefined
  ): React.MouseEventHandler<HTMLDivElement> =>
  (e) => {
    e.stopPropagation()
    handler?.()
  }

type SequenceProps = {
  items: SequenceItem
  renderItem: (sequenceId: number, value: number, idx: number) => JSX.Element | null
  editable?: boolean
  onSwap?: (idx: number) => void
  onSplit?: (itemIdx: number, splitIdx: number) => void
  onChange?: (items: SequenceItem) => void
  onClick?: () => void
}

export function Sequence(props: SequenceProps) {
  const { editable = false, items, onChange } = props

  const setItems = (newItems: SequenceItem) => {
    onChange?.(newItems)
  }

  const handleSplit = (itemIdx: number) => {
    const newItem1 = items.value.slice(0, itemIdx + 1)
    const newItem2 = items.value.slice(itemIdx + 1)

    const newSeq: SequenceItem = makeSequence([
      makeSequence(newItem1),
      makeSequence(newItem2),
    ])
    setItems(newSeq)
  }

  const handleSwap = (idx: number) => {
    setItems(
      makeSequence([
        ...items.value.slice(idx + 1),
        ...items.value.slice(0, idx + 1),
      ])
    )
  }

  const handleChange = (idx: number, newItem: SequenceItem) => {
    const newItems = [...items.value]
    newItems[idx] = newItem
    props.onChange?.(makeSequence(newItems))
  }

  return (
    <SequenceContainer onClick={handleClick(props.onClick)}>
      {items.value.map((item, idx) => {
        const child = isSequence(item) ? (
          <Sequence
            key={item.id}
            editable={props.editable}
            items={item}
            onChange={(newItem) => handleChange(idx, newItem)}
            renderItem={props.renderItem}
            onClick={() => handleSwap(0)}
          />
        ) : item.brand === "number" ? (
          props.renderItem(items.id, item.value, idx)
        ) : null

        return (
          <SequenceItemContainer key={`${item.brand}-${idx}`}>
            {child}
            {editable && idx < items.value.length - 1 ? (
              <IndexMarker onClick={handleClick(() => handleSplit(idx))} />
            ) : null}
          </SequenceItemContainer>
        )
      })}
    </SequenceContainer>
  )
}
