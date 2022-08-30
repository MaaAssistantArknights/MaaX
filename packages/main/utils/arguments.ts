type LexState = 'normal' | 'string'

export function parseArguments (command: string): string[] {
  let state: LexState = 'normal'
  let singleQuote = false
  let tempString = ''
  const args: string[] = []

  for (const char of command) {
    switch (char) {
      case ' ': {
        if (state === 'normal' && tempString.trim()) {
          args.push(tempString.trim())
          tempString = ''
        } else {
          tempString += char
        }
        break
      }
      case '\'': {
        if (state === 'normal') {
          state = 'string'
          singleQuote = true
        } else if (singleQuote) {
          state = 'normal'
          singleQuote = false
          args.push(tempString)
          tempString = ''
        } else {
          tempString += char
        }
        break
      }
      case '"': {
        if (state === 'normal') {
          state = 'string'
        } else if (!singleQuote) {
          state = 'normal'
          args.push(tempString)
          tempString = ''
        } else {
          tempString += char
        }
        break
      }
      default: {
        tempString += char
        break
      }
    }
  }
  if (state === 'string') {
    throw Error(`${singleQuote ? 'Single quote' : 'Double quote'} is not closed`)
  }
  return args
}
