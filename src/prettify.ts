import prettier from 'prettier'

// Formats the given content for the given file using the given Prettier configuration.
export function prettify(text: string, filename: string, config) {
  const options = { filepath: filename }
  const prettierConfig = { singleQuote: true, jsxSingleQuote: true, arrowParens: 'always' } 
  const merged = { ...config, ...options, ...prettierConfig }
  try {
    return prettier.format(text, merged)
  } catch (e) {
    return text
  }
}
