import { resolveVariableFromPath } from '../utils'

export const referencesRegex = new RegExp(
  '\\' +
  '{' +
  '([^' +
  '}' +
  ']+)' +
  '\\' +
  '}', 'g'
)

export const treeWalker = (obj, typing: boolean = true, aliased = {}) => {
  let type = {}

  if (obj.value) {
    const _path = obj.path.join('.')

    // Resolve aliased properties
    const keyRegex = /{(.*)}/g
    const testOriginal = obj.original.value.match(referencesRegex)
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
