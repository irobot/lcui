import type { ReactNode } from "react"

export type IDItem = {
  value: number
  brand: "number"
}

export type SequenceItem = {
  id: number
  value: SequenceType[]
  brand: "sequence"
}

export type SequenceType = SequenceItem | IDItem

export function isSequence(item: SequenceType): item is SequenceItem {
  return item.brand === "sequence"
}

export function makeId(value: number): IDItem {
  return {
    value,
    brand: "number"
  }
}

let __id = 1

export function makeSequence(items: SequenceType[]): SequenceItem {
  return {
    id: __id++,
    value: items,
    brand: "sequence"
  }
}

export type DisplayConfig<T> = {
  component: (data: T, caseIdx: number) => ReactNode
  title: string
  link?: string
  cases: T[]
  providesHints?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DisplayViews = Record<string, DisplayConfig<any>>