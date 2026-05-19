// @ts-check

import {useCallback, useContext, useSyncExternalStore} from "react"
import {LocationStoreContext} from "./location-context.js"

/** @returns {string} Current location path without query params. */
const useLocationPath = () => {
  const store = useContext(LocationStoreContext)
  const getSnapshot = useCallback(() => store.path(), [store])

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

export default useLocationPath
