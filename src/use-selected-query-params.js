// @ts-check

import {useCallback, useContext, useMemo, useSyncExternalStore} from "react"
import {LocationStoreContext} from "./location-context.js"
import {normalizeQueryParamSelector, selectQueryParams, selectedQueryParamsKey} from "./query-param-selector.js"

/**
 * @param {import("./query-param-selector.js").QueryParamSelector} selector
 * @returns {Record<string, unknown>}
 */
const useSelectedQueryParams = (selector) => {
  const store = useContext(LocationStoreContext)
  const normalizedSelector = useMemo(() => normalizeQueryParamSelector(selector), [selector])

  const getSnapshot = useCallback(
    () => selectedQueryParamsKey(store.queryParams(), normalizedSelector),
    [normalizedSelector, store]
  )

  const selectedKey = useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)

  return useMemo(
    () => selectQueryParams(store.queryParams(), normalizedSelector),
    [normalizedSelector, selectedKey, store]
  )
}

export default useSelectedQueryParams
