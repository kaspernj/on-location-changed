// @ts-check

import {browserLocationSnapshot} from "./browser-location.js"
import {defaultLocationStore} from "./location-store.js"
import {normalizeQueryParamSelector, selectQueryParams, selectedQueryParamsKey} from "./query-param-selector.js"
import onLocationChanged from "./on-location-changed.js"

/**
 * @param {import("./query-param-selector.js").QueryParamSelector} selector
 * @param {(queryParams: Record<string, unknown>) => void} callback
 */
const onSelectedQueryParamsChanged = (selector, callback) => {
  const normalizedSelector = normalizeQueryParamSelector(selector)
  let lastKey = selectedQueryParamsKey(defaultLocationStore.queryParams(), normalizedSelector)

  const disconnectStore = defaultLocationStore.subscribe(() => {
    const nextKey = selectedQueryParamsKey(defaultLocationStore.queryParams(), normalizedSelector)

    if (nextKey != lastKey) {
      lastKey = nextKey
      callback(selectQueryParams(defaultLocationStore.queryParams(), normalizedSelector))
    }
  })

  const locationChanged = globalThis.location ? onLocationChanged(() => {
    defaultLocationStore.setSnapshot(browserLocationSnapshot())
  }) : null

  return {
    disconnect() {
      disconnectStore()

      if (locationChanged) {
        locationChanged.disconnect()
      }
    }
  }
}

export default onSelectedQueryParamsChanged
