import styled from "styled-components"

const CellContainer = styled.div`
  display: grid;
  min-width: 3em;
  height: 3em;
  border: 1px solid #ccc;
  place-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: bold;
`

const CellValue = styled.div`
  grid-area: 1 / 1;
`

type CellProps = {
  value: string
}

const Cell = (props: CellProps) => {
  return (
    <CellContainer>
      <CellValue>{props.value}</CellValue>
    </CellContainer>
  )
}

export default Cell