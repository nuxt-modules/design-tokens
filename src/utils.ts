import chalk from 'chalk'
import { kebabCase } from 'scule'
import consola from 'consola'
import { name, version } from '../package.json'
import type { ModuleOptions } from './index'
import { DesignTokensPaths } from '#design-tokens/types'

export interface NuxtLayer {
  config: any
  configFile: string
  cwd: string
}

// Default options
export const MODULE_DEFAULTS: ModuleOptions = {
  tokens: true,
  server: false
}

// Logging
// Do not import @nuxt/kit here
const _logger = consola
function useLogger (scope) {
  return scope ? _logger.withScope(scope) : logger
}
export const logger = useLogger('design-tokens')

// Package datas
export { name, version }
export const pkgName = chalk.magentaBright(name)

/**
 * Make a list of `get()` compatible paths for any object
 */
export const objectPaths = (data: any) => {
  const output: any = []
  function step (obj: any, prev?: string) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      const isarray = Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isobject =
        type === '[object Object]' ||
        type === '[object Array]'

      const newKey = prev
        ? `${prev}.${key}`
        : key

      if (!output.includes(newKey)) { output.push(newKey) }

      if (!isarray && isobject && Object.keys(value).length) { return step(value, newKey) }
    })
  }
  step(data)
  return output
}

/**
 * Resolve a `var(--token)` value from a token path.
 */
export const resolveVariableFromPath = (path: DesignTokensPaths): string => `var(--${path.split('.').map(key => kebabCase(key)).join('-')})`

/**
 * Get a key from an object with a dotted syntax.
 * @example get({ foot: { bar: 'baz' } }, 'foo.bar') // 'baz'
 */
export const get = (obj, path, defValue = undefined) => {
  if (!path) { return undefined }
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)
  const result = pathArray.reduce(
    (prevObj, key) => prevObj && prevObj[key],
    obj
  )
  return result === undefined ? defValue : result
}
