export type ScrambleStringCase = {
  input: [string, string]
  output: boolean
}

export const ScrambleStringCases: ScrambleStringCase[] = [
  { input: ["great", "rgeat"], output: true },
  { input: ["abcde", "caebd"], output: false },
  { input: ["a", "a"], output: true },
  { input: ["abcdbdacbdac", "bdacabcdbdac"], output: true },
  { input: ["abca", "caba"], output: true },
  { input: ["abb", "bba"], output: true },
  { input: ["abc", "bca"], output: true },
  { input: ["abcdd", "dbdac"], output: false },
  { input: ["abc", "cba"], output: true },
  { input: ["unuzp", "nzuup"], output: true },
  {
    input: ["eebaacbcbcadaaedceaaacadccd", "eadcaacabaddaceacbceaabeccd"],
    output: false,
  },
  {
    input: ["eebaacbcbcadaaedceaaacad", "eadcaacabaddaceacbceaabe"],
    output: false,
  },
  { input: ["vfldiodffghyq", "vdgyhfqfdliof"], output: true },
  { input: ["abbbcbaaccacaacc", "acaaaccabcabcbcb"], output: true },
  { input: ["bbcbaacc", "abcabcbc"], output: true },
  { input: ["hobobyrqd", "hbyorqdbo"], output: true },
  { input: ["cbccbcbcacaaaaaa", "cabaabcaaacaccbc"], output: true },
  { input: ["xyzabcdecaebd", "abcdexyzcaebd"], output: true },
]

export default ScrambleStringCases