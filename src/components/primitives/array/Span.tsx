import styled from "styled-components"

type SpanPosition = "top" | "bottom"

type SpanPositionProps = {
  placement?: SpanPosition
}

type SpanProps = SpanPositionProps & {
  start: number
  end: number
  color?: string
}

export type SpanCompProps = SpanProps & {
  children?: React.ReactNode
}

type SpanWithPlacement = Omit<SpanProps, "placement"> & { $placement?: SpanPosition }

const SpanContainer = styled.div<SpanWithPlacement>`
  grid-column: ${(props: SpanProps) => props.start + 1 + " / " + (props.end + 1)};
  position: relative;
  left: 1.5em;
  grid-row: ${props => props.$placement === "top" ? "1" : "2" };
  top: ${(props) => (props.$placement === "top" ? "-1.5em" : "0.5em")};
  display: grid;
  grid-template-areas: "marker";
`

const SpanMarker = styled.div<SpanWithPlacement>`
  border: solid ${(props) => props.color ?? props.theme.colors.accent};
  border-width: 3px;
  ${(props) =>
    props.$placement === "top" ? `border-bottom: none;` : `border-top: none;`}
  height: 0.5em;
  width: ${(props) => (props.start === props.end ? 0 : "auto")};
  grid-area: marker;
`

const SpanValue = styled.span<{ $placement?: SpanPosition }>`
  grid-area: marker;
  place-self: center;
  background: ${(props) => props.theme.colors.background};
  padding: 0.25em;
  position: relative;
  top: ${(props) => (props.$placement === "top" ? "-1.5em" : "-0.5em")};
`

export const Span = (props: SpanCompProps) => {
  const { children, placement, ...spanProps } = props
  return (
    <SpanContainer $placement={placement} {...spanProps}>
      <SpanMarker {...spanProps} $placement={placement} />
      <SpanValue $placement={placement}>{children}</SpanValue>
    </SpanContainer>
  )
}
