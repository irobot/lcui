export type BuySell3Case = {
  input: number[]
  output: number
}

export const BuySell3Cases: BuySell3Case[] = [
  { input: [3,3,5,0,0,3,1,4], output: 6 },
  { input: [1,2,3,4,5], output: 4 },
  { input: [7,6,4,3,1], output: 0 },
  { input: [6,1,3,2,4,7], output: 7 },
  { input: [1,2,4,2,5,7,2,4,9,0], output: 13 },
  { input: [1,2,4,2,5,7,2,4,9, 1, 5, 6, 9], output: 16 },
  { input: [1,1,2,2,1,1,3,3,2,4,6,3,10,5,3], output: 12 },
  { input: [2,1,2,0,1], output: 2 },
  { input: [3,2,6,5,0,3], output: 7 },
  { input: [8,3,6,2,8,8,8,4,2,0,7,2,9,4,9], output: 15 },
  // { input: [], output: 6 },
]

export default BuySell3Cases
