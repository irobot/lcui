import { createContext, useState } from "react"
import styled from "styled-components"
import { Switch } from "@/components/ui/Switch"
import type { DisplayConfig } from "@/components/types"
import CaseSelect from "@/components/ui/CaseSelect"

const BaseContainer = styled.div`
  display: grid;
  grid-template-rows: min-content auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0 var(--gutter);
  container-type: inline-size;
`

const ShowHintsContainer = styled.div`
  justify-self: end;
  font-size: small;
  color: #ccc;
`

const TopBar = styled.div`
  container-type: inline-size;
  display: flex;
  background: #181b1c;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem var(--gutter);
  margin: 0 calc(0px - var(--gutter));
  font-size: large;
  font-family: monospace;
`

const Title = styled.div`
  cursor: pointer;
`

type Props = {
  viewType: string
  availableViews: { title: string; viewType: string }[]
  onViewChange?: (viewType: string) => void
} & DisplayConfig<unknown>

export const DisplayContext = createContext({ hintsEnabled: false })

export function DisplayContainer(props: Props) {
  const [hintsEnabled, setHintsEnabled] = useState(false)
  const [caseIdx, setCaseIdx] = useState(0)
  const [titleMode, setTitleMode] = useState(true)

  const handleCaseChange = (caseIdx: number) => {
    setCaseIdx(caseIdx)
  }
  const handleViewChange = (viewType: string) => {
    setTitleMode(true)
    setCaseIdx(0)
    props.onViewChange?.(viewType)
  }

  const titleComp = titleMode ? (
    <Title onClick={() => setTitleMode(false)}>
      {props.title}&nbsp;
      {props.link && props.link !== "" && <a href={props.link}>⚓</a>}
    </Title>
  ) : (
    <select onChange={e => handleViewChange(e.target.value)} value={props.viewType}>
      {props.availableViews.map(({ title, viewType }) => (
        <option value={viewType} key={viewType}>{title}</option>
      ))}
    </select>
  )

  const { cases, component } = props
  const displayComponent = component(cases[caseIdx], caseIdx)

  return (
    <BaseContainer>
      <TopBar>
        {titleComp}
        <CaseSelect
          numberOfCases={props.cases.length}
          caseIdx={caseIdx}
          onChange={handleCaseChange}
        />
      </TopBar>
      {props.providesHints ? <ShowHintsContainer>
        <span>Hints</span>
        <Switch value={false} onChange={setHintsEnabled} />
      </ShowHintsContainer> : <div></div>}
      <DisplayContext.Provider value={{ hintsEnabled }}>
        {displayComponent}
      </DisplayContext.Provider>
    </BaseContainer>
  )
}
