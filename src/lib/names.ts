const HONORIFICS = new Set(['mr', 'mrs', 'ms', 'miss', 'dr', 'prof'])
const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v'])

/** Name words without leading honorifics ("Mrs.") or trailing suffixes ("V"). */
function coreWords(name: string): string[] {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}'-]/gu, ''))
    .filter(Boolean)

  while (words.length > 1 && HONORIFICS.has(words[0].toLowerCase())) {
    words.shift()
  }
  while (
    words.length > 1 &&
    SUFFIXES.has(words[words.length - 1].toLowerCase())
  ) {
    words.pop()
  }
  return words
}

/** "Mrs. Dennis Schulist" → "DS", "Nicholas Runolfsdottir V" → "NR". */
export function getInitials(name: string): string {
  const words = coreWords(name)
  if (words.length === 0) return '?'
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

/** "Mrs. Dennis Schulist" → "Dennis". */
export function getFirstName(name: string): string {
  return coreWords(name)[0] ?? name
}
