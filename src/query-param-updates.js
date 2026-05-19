// @ts-check

/**
 * @typedef {string | number | boolean | null | undefined} QueryParamScalar
 * @typedef {QueryParamScalar | QueryParamScalar[]} QueryParamValue
 * @typedef {Record<string, QueryParamValue | string | string[] | undefined>} QueryParams
 * @typedef {Record<string, QueryParamValue>} QueryParamUpdates
 * @typedef {{excludeKeys?: string[]}} QueryParamUpdateOptions
 * @typedef {{push: (path: string) => unknown}} QueryParamRouter
 */

/**
 * Builds a location path with serialized query params.
 * @param {string} path Pathname that should receive the query string.
 * @param {QueryParams} [queryParams] Query params to serialize.
 * @returns {string} Path with query params appended.
 */
export function locationPathWithQueryParams(path, queryParams = {}) {
  const url = new URL(path, "http://placeholder")

  for (const key of Object.keys(queryParams).sort()) {
    appendQueryParam(url.searchParams, key, queryParams[key])
  }

  const search = url.searchParams.toString()

  return `${url.pathname}${search ? `?${search}` : ""}${url.hash}`
}

/**
 * Pushes a same-route path after applying query parameter updates.
 * @param {QueryParamRouter} router Router with push navigation.
 * @param {QueryParams} currentParams Current query params.
 * @param {string} path Pathname that should receive the updated query string.
 * @param {QueryParamUpdates} updates Query entries that replace same-named current values.
 * @param {QueryParamUpdateOptions} [options] Keys to omit from the serialized query.
 * @returns {void} Nothing.
 */
export function pushQueryParamUpdates(
  router,
  currentParams,
  path,
  updates,
  options = {}
) {
  const nextPath = pathForQueryParamUpdates(currentParams, path, updates, options)
  if (nextPath) router.push(nextPath)
}

/**
 * Builds a same-route path after applying query parameter updates.
 * @param {QueryParams} currentParams Current query params.
 * @param {string} path Pathname that should receive the updated query string.
 * @param {QueryParamUpdates} updates Query entries that replace same-named current values.
 * @param {QueryParamUpdateOptions} [options] Keys to omit from the serialized query.
 * @returns {string | null} The route path, or null when no params changed.
 */
export function pathForQueryParamUpdates(
  currentParams,
  path,
  updates,
  options = {}
) {
  const excludedKeys = new Set(options.excludeKeys || [])
  const updateKeys = new Set(Object.keys(updates))
  const currentSearchParams = searchParamsFor(currentParams, excludedKeys)
  const nextSearchParams = new URLSearchParams()

  appendCurrentParams(nextSearchParams, currentParams, excludedKeys, updateKeys)
  appendUpdateParams(nextSearchParams, updates, excludedKeys)

  if (currentSearchParams.toString() === nextSearchParams.toString()) return null

  const url = new URL(path, "http://placeholder")
  const search = nextSearchParams.toString()

  return `${url.pathname}${search ? `?${search}` : ""}${url.hash}`
}

/**
 * Builds search params for the current route params.
 * @param {QueryParams} params Params to serialize.
 * @param {Set<string>} excludedKeys Param keys to skip.
 * @returns {URLSearchParams} Serialized search params.
 */
function searchParamsFor(params, excludedKeys) {
  const searchParams = new URLSearchParams()

  appendCurrentParams(searchParams, params, excludedKeys, new Set())

  return searchParams
}

/**
 * Appends current params that should survive the update.
 * @param {URLSearchParams} searchParams Search params being built.
 * @param {QueryParams} params Current route params.
 * @param {Set<string>} excludedKeys Param keys to skip.
 * @param {Set<string>} updateKeys Param keys replaced by the update.
 * @returns {void} Nothing.
 */
function appendCurrentParams(searchParams, params, excludedKeys, updateKeys) {
  for (const key of Object.keys(params).sort()) {
    if (excludedKeys.has(key) || updateKeys.has(key)) continue
    appendQueryParam(searchParams, key, params[key])
  }
}

/**
 * Appends updated params.
 * @param {URLSearchParams} searchParams Search params being built.
 * @param {QueryParamUpdates} updates Param updates to append.
 * @param {Set<string>} excludedKeys Param keys to skip.
 * @returns {void} Nothing.
 */
function appendUpdateParams(searchParams, updates, excludedKeys) {
  for (const key of Object.keys(updates).sort()) {
    if (excludedKeys.has(key)) continue
    appendQueryParam(searchParams, key, updates[key])
  }
}

/**
 * Appends a scalar or array query param.
 * @param {URLSearchParams} searchParams Search params being built.
 * @param {string} key Query key to append.
 * @param {QueryParamValue | string | string[]} value Scalar or repeated query values.
 * @returns {void} Nothing.
 */
function appendQueryParam(searchParams, key, value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryParam(searchParams, key, item)
    }
    return
  }
  if (value === undefined || value === null || value === "") return
  searchParams.append(key, String(value))
}
