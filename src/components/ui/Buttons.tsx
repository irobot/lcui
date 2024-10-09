import styled, { css } from "styled-components"

const ButtonWithHint = styled.button<{ $suggested?: boolean }>`
  position: relative;
  &:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-image: radial-gradient(113% 141% at 17% -2%, #ff00055c 1%, #FF000000 99%);
    opacity: 0;
    transition: opacity 0.2s ease-out;
  }

  &:hover {
    border-color: #924100;
    &:after {
      opacity: 1;
    }
  }

  &:focus {
    outline: transparent;
  }
  &:focus-visible {
    outline: 1px dashed #ffc10766;
  }

  ${(props) =>
    props.$suggested &&
    css`
      &:before {
        content: " hi";
        position: absolute;
        inset: 0;
        z-index: -1;
        margin: -5px; /* !importanté */
        border-radius: inherit; /* !importanté */
        background: linear-gradient(to right, red, orange);
      }
    `}
`

type Props = {
  hintQuery?: (hintKey: string) => boolean
  hintKey?: string
  style?: React.CSSProperties
} & React.DOMAttributes<HTMLButtonElement>

export const Button = (props: Props) => {
  const { hintKey, hintQuery, ...rest } = props
  const suggested = hintKey !== undefined && hintQuery?.(hintKey)
  return <ButtonWithHint $suggested={suggested} {...rest} />
}

const BumpButtonsContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 0.5em;
  background: #333;
  padding: 0.5em;
  border-radius: 0.5em;
  z-index: 0;
`

export const BumpButtons = (props: {
  label: string
  bumpAction: (delta: -1 | 1) => void
  hintQuery?: (hintKey: string) => boolean
  hintKeyPlus?: string
  hintKeyMinus?: string
  style?: React.CSSProperties
}) => {
  const { hintQuery, hintKeyPlus, hintKeyMinus } = props
  return (
    <BumpButtonsContainer style={props.style}>
      <Button
        hintKey={hintKeyMinus}
        hintQuery={hintQuery}
        onClick={() => props.bumpAction(-1)}
      >
        -
      </Button>
      <span>{props.label}</span>
      <Button
        hintKey={hintKeyPlus}
        hintQuery={hintQuery}
        onClick={() => props.bumpAction(1)}
      >
        +
      </Button>
    </BumpButtonsContainer>
  )
}
