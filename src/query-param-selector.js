// @ts-check

/** @typedef {string | true | unknown[] | {[key: string]: unknown}} QueryParamSelector */

/** @param {QueryParamSelector} selector */
const normalizeQueryParamSelector = (selector) => {
  /** @type {Record<string, true | Record<string, unknown>>} */
  const result = {}

  addSelector(result, selector)

  return result
}

/**
 * @param {Record<string, true | Record<string, unknown>>} target
 * @param {unknown} selector
 */
const addSelector = (target, selector) => {
  if (typeof selector == "string") {
    target[selector] = true
    return
  }

  if (Array.isArray(selector)) {
    for (const nestedSelector of selector) {
      addSelector(target, nestedSelector)
    }

    return
  }

  if (selector && typeof selector == "object") {
    const selectorObject = /** @type {Record<string, unknown>} */ (selector)

    for (const key of Object.keys(selectorObject)) {
      const nestedSelector = selectorObject[key]

      if (nestedSelector === true) {
        target[key] = true
      } else if (target[key] !== true) {
        /** @type {Record<string, true | Record<string, unknown>>} */
        const nestedTarget = /** @type {Record<string, true | Record<string, unknown>>} */ (target[key] || {})

        target[key] = nestedTarget
        addSelector(nestedTarget, nestedSelector)
      }
    }

    return
  }

  throw new Error(`Unsupported query param selector: ${String(selector)}`)
}

/**
 * @param {Record<string, unknown>} queryParams
 * @param {unknown} selector
 */
const selectQueryParams = (queryParams, selector) => {
  const normalizedSelector = isNormalizedSelector(selector) ? selector : normalizeQueryParamSelector(/** @type {QueryParamSelector} */ (selector))

  return selectNestedQueryParams(queryParams, normalizedSelector)
}

/**
 * @param {Record<string, unknown>} queryParams
 * @param {Record<string, true | Record<string, unknown>>} selector
 */
const selectedQueryParamsKey = (queryParams, selector) => queryParamsKey(selectQueryParams(queryParams, selector))

/** @param {Record<string, unknown>} queryParams */
const queryParamsKey = (queryParams) => JSON.stringify(canonicalValue(queryParams))

/**
 * @param {unknown} value
 * @returns {unknown}
 */
const canonicalValue = (value) => {
  if (Array.isArray(value)) {
    /** @type {string[]} */
    const serializedValues = value.map((item) => JSON.stringify(canonicalValue(item)))

    return [...new Set(serializedValues)].sort().map((item) => JSON.parse(item))
  }

  if (value && typeof value == "object") {
    const source = /** @type {Record<string, unknown>} */ (value)
    /** @type {Record<string, unknown>} */
    const result = {}

    for (const key of Object.keys(source).sort()) {
      result[key] = canonicalValue(source[key])
    }

    return result
  }

  return value
}

/**
 * @param {unknown} selector
 * @returns {selector is Record<string, true | Record<string, unknown>>}
 */
const isNormalizedSelector = (selector) => {
  if (!selector || typeof selector != "object" || Array.isArray(selector)) {
    return false
  }

  const selectorObject = /** @type {Record<string, unknown>} */ (selector)

  return Object.keys(selectorObject).every((key) => (
    selectorObject[key] === true || (
      selectorObject[key] &&
      typeof selectorObject[key] == "object" &&
      !Array.isArray(selectorObject[key]) &&
      isNormalizedSelector(selectorObject[key])
    )
  ))
}

/**
 * @param {Record<string, unknown>} source
 * @param {Record<string, true | Record<string, unknown>>} selector
 */
const selectNestedQueryParams = (source, selector) => {
  /** @type {Record<string, unknown>} */
  const result = {}

  for (const key of Object.keys(selector)) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
      continue
    }

    const selectorValue = selector[key]
    const sourceValue = source[key]

    if (selectorValue === true) {
      result[key] = sourceValue
      continue
    }

    if (sourceValue && typeof sourceValue == "object" && !Array.isArray(sourceValue)) {
      const selectedSourceValue = selectNestedQueryParams(
        /** @type {Record<string, unknown>} */ (sourceValue),
        /** @type {Record<string, true | Record<string, unknown>>} */ (selectorValue)
      )

      if (Object.keys(selectedSourceValue).length > 0) {
        result[key] = selectedSourceValue
      }
    }
  }

  return result
}

export {normalizeQueryParamSelector, queryParamsKey, selectQueryParams, selectedQueryParamsKey}
