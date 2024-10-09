import styled, { ThemeProvider } from "styled-components"
import ScrambleString from "./components/displays/scramble-string/ScrambleString"
import { BuySell3 } from "./components/displays/buy-sell-iii/BuySell3"
import BuySellCases, { type BuySell3Case } from "./components/displays/buy-sell-iii/data/cases"
import ScrambleStringCases, { type ScrambleStringCase } from "./components/displays/scramble-string/data/cases"
import { theme } from "./components/theme"
import { createGlobalStyle } from "styled-components"
import type { DisplayViews } from "@/components/types"
import { DisplayContainer } from "@/components/ui/DisplayContainer"
import { useEffect, useState } from "react"

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  min-width: 100vw;
  min-height: 100dvh;
  display: grid;
  gap: 1em;
  --gutter: 0.5rem;

  @media (min-width: 429px) {
    --gutter: 1rem;
  }
  @media (min-width: 479px) {
    --gutter: 2rem;
  }
  @media (min-width: 640px) {
    --gutter: 3rem;
  }
`

const GlobalStyle = createGlobalStyle`
  :root {
    box-sizing: border-box;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    background-color: #292c34;
    color: rgba(255, 255, 255, 0.87);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  select {
    padding: 0.5em;
    border-color: black;
  }

  button {
    border-radius: 8px;
    border: 2px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    color: #ccc;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    /* border-color: #646cff; */
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`

const Views: DisplayViews = {
  "scramble-string": {
    component: (data: ScrambleStringCase, caseIdx: number) => <ScrambleString caseData={data} key={caseIdx} />,
    cases: ScrambleStringCases,
    title: "87. Scramble String",
    link: "https://leetcode.com/problems/scramble-string/description/",
  },
  "buy-sell-iii": {
    component: (data: BuySell3Case, caseIdx: number) => <BuySell3 caseData={data} key={caseIdx} />,
    cases: BuySellCases,
    title: "123. Best Time to Buy and Sell Stock III",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
    providesHints: true,
  },
}

const availableViews = Object.keys(Views).map((viewType) => ({
  viewType,
  title: Views[viewType].title,
}))

const getView = (): string => {
  const hash = window.location.hash.slice(1)
  if (Views[hash] !== undefined) {
    return hash
  }
  return Object.keys(Views)[0]
}

function App() {
  const [viewType, setViewType] = useState(getView())

  const handleViewChange = (viewType: string) => {
    window.location.hash = `#${viewType}`
    setViewType(viewType)
  }

  useEffect(() => {
    return window.addEventListener("hashchange", () => setViewType(getView()))
  }, [])

  const view = Views[viewType]

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <DisplayContainer
          {...view}
          viewType={viewType}
          availableViews={availableViews}
          onViewChange={handleViewChange}
        />
      </Container>
    </ThemeProvider>
  )
}

export default App
