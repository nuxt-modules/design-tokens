import { resolveVariableFromPath } from '../utils'

// browser-style-dictionary/lib/utils/references/createReferenceRegex
const referenceRegexDefaults = {
  opening_character: '{',
  closing_character: '}',
  separator: '.'
}
export function createReferenceRegex (opts = {}) {
  const options = Object.assign({}, referenceRegexDefaults, opts)

  return new RegExp(
    '\\' +
    options.opening_character +
    '([^' +
    options.closing_character +
    ']+)' +
    '\\' +
    options.closing_character, 'g'
  )
}

export const treeWalker = (obj, typing: boolean = true, aliased = {}) => {
  let type = {}

  if (obj.value) {
    const _path = obj.path.join('.')

    // Resolve aliased properties
    const refRegex = createReferenceRegex({})
    const keyRegex = /{(.*)}/g
    const testOriginal = obj.original.value.match(refRegex)
    if (testOriginal?.[0] && testOriginal[0] === obj.original.value) {
      obj.value = (obj.original.value as string).replace(keyRegex, (_, tokenPath) => {
        aliased[_path] = resolveVariableFromPath(tokenPath)
        return aliased[_path]
      })
    }

    // Transform name to CSS variable name
    obj.variable = aliased?.[_path] ? aliased[_path] : `var(--${obj.name})`

    // Toggle between type declaration and value
    type = typing ? 'DesignToken' : obj
  } else {
    for (const k in obj) {
      if (obj[k] && typeof obj[k] === 'object') {
        type[k] = treeWalker(obj[k], typing, aliased).type
      }
    }
  }

  return { type, aliased }
}
