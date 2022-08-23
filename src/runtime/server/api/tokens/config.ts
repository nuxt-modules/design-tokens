import { defineEventHandler } from 'h3'
// @ts-ignore
import * as p from 'paneer'
import * as r from 'recast'
import toAST from 'to-ast'
// @ts-ignore
import { useStorage } from '#imports'
import { DesignTokens } from '#design-tokens/types'

export default defineEventHandler(async () => {
  const storage = useStorage()

  const tokens = await storage.getItem('cache:design-tokens:tokens.json')

  const config = await storage.getItem('cache:design-tokens:config')

  const tokensToExpression = (_tokens: DesignTokens) => {
    const root = r.types.builders.objectExpression([])

    // Resolve the target on which resolved keys should be pushed
    const resolveTarget = (context) => {
      if (context?.value?.arguments) { return context?.value?.arguments?.[0]?.properties }
      if (context?.value?.properties) { return context.value.properties }
      if (context?.properties) { return context.properties }
      return context
    }

    // Resolve key or literal
    const resolveKey = (key: string) => {
      // eslint-disable-next-line no-useless-escape
      const charsRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
      const wordRegex = /\w+/g

      if (key.match(wordRegex).length > 1 || key.match(charsRegex)) {
        return r.types.builders.stringLiteral(key)
      }

      return r.types.builders.identifier(key)
    }

    const walkTokens = (tokens: DesignTokens, context = undefined) => {
      const target = resolveTarget(context)

      // Walk through tokens definition
      Object.entries(tokens).forEach(([key, value]) => {
        if ((value as any).value) {
          if (value.nested) {
            const pseudosRegex = /&(::-|::|:-|:)/g
            const nestedSelector = value.nested.replace(pseudosRegex, '')
            let nestedTarget = target.find((property) => {
              return property.key.value === value.nested || property.key.name === value.nested
            })
            if (!nestedTarget) {
              nestedTarget = r.types.builders.objectProperty(
                resolveKey(value.nested as string),
                r.types.builders.objectExpression([])
              )
              target.push(nestedTarget)
            }
            delete value.nested

            nestedTarget.value.properties.push(
              r.types.builders.objectProperty(
                resolveKey(key.replace(nestedSelector + '-', '')),
                toAST(value)
              )
            )
            return
          }

          target.push(
            r.types.builders.objectProperty(
              resolveKey(key),
              toAST(value)
            )
          )
          return
        }

        let newContext

        if (value.composed) {
          // compose() handling
          delete value.composed
          newContext = r.types.builders.objectProperty(
            resolveKey(key),
            r.types.builders.callExpression(
              r.types.builders.identifier('compose'),
              [r.types.builders.objectExpression([])]
            )
          )
        } else if (value.palette) {
          // palette() handling
          delete value.palette
          newContext = r.types.builders.objectProperty(
            resolveKey(key),
            r.types.builders.callExpression(
              r.types.builders.identifier('palette'),
              [r.types.builders.stringLiteral(value['500'].value)]
            )
          )

          // Early return as we can skip the rest of the palette for this key
          target.push(newContext)
          return
        } else {
          // Any other cases
          newContext = r.types.builders.objectProperty(
            resolveKey(key),
            r.types.builders.objectExpression([])
          )
        }

        target.push(newContext)

        walkTokens(
          value,
          newContext
        )
      })
    }

    walkTokens(_tokens, root)

    return root
  }

  const configAst = p.parse(config)

  const defaultExport = p.defaultExport(configAst)

  defaultExport.arguments = [tokensToExpression(tokens)]

  return `
  <div style="display: flex; font-size: 10px; justify-content: space-between;">
  <pre style="line-height: 10px;">${p.generate(p.parse(config)).code}</pre>
  <pre style="line-height: 10px;">${p.generate(defaultExport).code}</pre>
  </div>
  `
})
