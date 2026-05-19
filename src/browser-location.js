// @ts-check

import qs from "qs"

/** @returns {{path: string, queryParams: Record<string, unknown>}} */
const browserLocationSnapshot = () => ({
  path: browserPath(),
  queryParams: browserQueryParams()
})

/** @returns {string} */
const browserPath = () => {
  if (!globalThis.location) {
    return "/"
  }

  return globalThis.location.pathname
}

/** @returns {Record<string, unknown>} */
const browserQueryParams = () => {
  if (!globalThis.location) {
    return {}
  }

  return qs.parse(globalThis.location.search.replace(/^\?/, "")) || {}
}

export {browserLocationSnapshot, browserPath, browserQueryParams}
