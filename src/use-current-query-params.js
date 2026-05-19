// @ts-check

import {useCallback, useContext} from "react"
import {LocationStoreContext} from "./location-context.js"

/**
 * Returns a stable reader for the provider-scoped current query params.
 * @returns {() => Record<string, unknown>} Function that reads current query params without subscribing broadly.
 */
const useCurrentQueryParams = () => {
  const locationStore = useContext(LocationStoreContext)

  return useCallback(() => locationStore.queryParams(), [locationStore])
}

export default useCurrentQueryParams
