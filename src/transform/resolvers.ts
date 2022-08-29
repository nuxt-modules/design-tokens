import { camelCase, kebabCase, upperFirst } from 'scule'
import chalk from 'chalk'
import * as recast from 'recast'
import { $tokens } from '../index'
import { logger } from '../utils'

const shortVariantsPropsRegex = /\$variantsProps\('(.*)'\)/g
const fullVariantsPropsRegex = /\$variantsProps\(('(.*?)'),\s'(.*?)'\)/g
const screenRegex = /(@screen\s(.*?)\s{)/g
const darkRegex = /(@dark\s{)/g
const lightRegex = /(@light\s{)/g
const dtRegex = /\$dt\('(.*?)'\)/g
const componentRegex = /@component\('(.*?)'\);/g

export const resolverRegexes = {
  shortVariantsProps: shortVariantsPropsRegex,
  fullVariantsProps: fullVariantsPropsRegex,
  screen: screenRegex,
  dark: darkRegex,
  light: lightRegex,
  dt: dtRegex,
  component: componentRegex
}

/**
 * Helper grouping all resolvers applying to <style>
 */
export const resolveStyle = (code: string = '') => {
  code = resolveDt(code)
  code = resolveScreens(code)
  code = resolveScheme(code, 'dark')
  code = resolveScheme(code, 'light')
  return code
}

/**
 * Resolve `$dt()` declarations.
 *
 * Supports `wrapper` to be used in both `<style>` and `<script>` or `<template>` tags.
 */
export const resolveDt = (code: string, wrapper = undefined) => {
  const replace = (path: string): string => `${wrapper || ''}var(--${path.split('.').map(key => kebabCase(key)).join('-')})${wrapper || ''}`

  code = code.replace(dtRegex, (_, path) => replace(path))

  return code
}

/**
 * Resolve `@component()`.
 */
export const resolveVariantProps = (code: string = '', variantProps: any = {}): string => {
  const propKeyToAst = (ast: any, key: string, prefix: string) => {
    ast.properties.push(
      recast.types.builders.objectProperty(
        recast.types.builders.stringLiteral(camelCase(camelCase(prefix + upperFirst(key)))),
        recast.types.builders.objectExpression([
          recast.types.builders.objectProperty(
            recast.types.builders.identifier('type'),
            recast.types.builders.identifier('Boolean')
          ),
          recast.types.builders.objectProperty(
            recast.types.builders.identifier('required'),
            recast.types.builders.identifier('false')
          ),
          recast.types.builders.objectProperty(
            recast.types.builders.identifier('default'),
            recast.types.builders.identifier('false')
          )
        ])
      )
    )
  }

  // $variantProps('tagName')
  code = code.replace(shortVariantsPropsRegex,
    (_, tagName) => {
      const ast = recast.types.builders.objectExpression([])
      if (variantProps[tagName]) {
        Object.keys(variantProps[tagName])
          .forEach(
            propKey => propKeyToAst(ast, propKey, '')
          )
      }
      return recast.print(ast).code
    })

  // $variantProps('tagName', 'prefix')
  code = code.replace(fullVariantsPropsRegex,
    (_, tagName, prefix) => {
      const ast = recast.types.builders.objectExpression([])
      if (variantProps[tagName]) {
        Object.keys(variantProps[tagName])
          .forEach(
            propKey => propKeyToAst(ast, propKey, prefix)
          )
      }
      return recast.print(ast).code
    }
  )

  return code
}

export const resolveScheme = (code: string = '', scheme: 'light' | 'dark') => {
  // Only supports `light` and `dark` schemes as they are native from browsers.
  const schemesRegex = {
    light: lightRegex,
    dark: darkRegex
  }

  code = code.replace(schemesRegex[scheme], `@media (prefers-color-scheme: ${scheme}) {`)

  return code
}

/**
 * Resolve `@screen {screenSize}` declarations.
 */
export const resolveScreens = (code: string = ''): string => {
  // @ts-ignore
  const screens = $tokens('screens', {
    flatten: false,
    key: undefined,
    silent: true
  })

  code = code.replace(
    screenRegex,
    (_, _screenDeclaration, screenSize) => {
      const screenToken = screens[screenSize]

      if (screenToken) {
        return `@media (min-width: ${screenToken.value}) {`
      }

      logger.warn(
        'This screen size is not defined: ' + chalk.red(screenSize) + '\n\n',
        'Available screen sizes: ', Object.keys(screens).map(screen => chalk.green(screen)).join(', ')
      )

      return '@media (min-width: 0px) {'
    }
  )

  return code
}
