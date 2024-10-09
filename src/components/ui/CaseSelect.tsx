import type React from "react"
import { useMemo } from "react"
import styled from "styled-components"

export type CaseSelectProps = {
  caseIdx: number
  numberOfCases: number
  onChange: (idx: number) => void
  style?: React.CSSProperties
}

const StyledCaseSelect = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #232425;
  color: #999;

  @container (max-width: 468px) {
    flex-direction: column;
  }
`

const StyledSelect = styled.select`
  padding-top: 0;
  padding-bottom: 0;
`

export function CaseSelect(props: CaseSelectProps) {
  const options = useMemo(() => {
    const options = [] as React.ReactNode[]
    for (let i = 0; i < props.numberOfCases; i++) {
      options.push(<option key={i} value={i}>{i + 1}</option>)
    }
    return options
  }, [props.numberOfCases])

  return (
    <StyledCaseSelect style={props.style}>
      <span>Case</span>
      <StyledSelect
        value={props.caseIdx}
        onChange={(e) => props.onChange(parseInt(e.target.value, 10))}
      >
        {options}
      </StyledSelect>
    </StyledCaseSelect>
  )
}

export default CaseSelect
