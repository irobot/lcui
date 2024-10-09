import styled from "styled-components"
import { Span, type SpanCompProps } from "./Span"
import { useRef, useEffect } from "react"

const ArrayContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  margin-top: 3rem;
`

const ArrayCell = styled.div<{ $hilight?: boolean }>`
  min-width: 3em;
  min-height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.border};
  ${(props) => (props.$hilight ? `background-color: darkred;` : null)}
  &:hover {
    color: #222;
    background-color: darkorange;
    cursor: pointer;
  }
`

type Props = {
  values: number[]
  spans?: SpanCompProps[]
  hilightIdx?: number
  hilightRange?: [number, number] | null
  onCellSelect?: (idx: number) => void
  onCellHover?: (idx: number) => void
  onStackUnhover?: () => void
  showIndex?: number
}

const StyledSpan = styled(Span)``

const ArrayView = (props: Props) => {
  const spans = props.spans ?? []
  const count = props.values.length
  
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  scrollRefs.current = Array(count).map(
    (_, i) => scrollRefs.current[i] ?? null
  )

  const scrollSmoothHandler = (index: number) => {
    scrollRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (props.showIndex !== undefined) {
      scrollSmoothHandler(props.showIndex)
    }
  }, [props.showIndex])

  return (
    <ArrayContainer onPointerLeave={props.onStackUnhover}>
      {props.values.map((value, index) => {

        const higlight =
          props.hilightIdx === index ||
          (props.hilightRange &&
            props.hilightRange[0] <= index &&
            props.hilightRange[1] >= index)

        return (
          <ArrayCell
            ref={(ref) => {
              scrollRefs.current[index] = (ref)
            }}
            key={index}
            $hilight={higlight === true ? true : undefined}
            style={{ gridColumn: index + 1 + " / span 1", gridRow: "1" }}
            onPointerMove={() => props.onCellHover?.(index)}
          >
            {value}
          </ArrayCell>
        )
      })}
      {count === 0 ? <ArrayCell></ArrayCell> : null}
      {spans.map((spanProps, idx) => {
        const { start, end, ...rest } = spanProps
        const _start = Math.min(start, count - 1)
        const _end = Math.max(start, Math.min(end, count - 1))
        return <StyledSpan key={idx} start={_start} end={_end} {...rest} />
      })}
    </ArrayContainer>
  )
}

export default ArrayView
