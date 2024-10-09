import type React from "react"

export type StackProps<T> = {
  values: readonly T[]
  render: (value: T, idx: number) => React.ReactNode
}

export type StackComponent = <T>(props: StackProps<T>) => React.ReactNode
