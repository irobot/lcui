import styled from "styled-components"
import type { StackComponent } from "./types"

const StackContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
`

const StackCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.colors.border};
  padding: 0.25em;
  cursor: pointer;
`

const Stack: StackComponent = (props) => {
  return (
    <StackContainer>
      {props.values.map((_, index) => {
        const renderIdx = props.values.length - index - 1
        return (
          <StackCell key={index}>
            {props.render(props.values[renderIdx], renderIdx)}
          </StackCell>
        )
      })}
    </StackContainer>
  )
}

export default Stack
