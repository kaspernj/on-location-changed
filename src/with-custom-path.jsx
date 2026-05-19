import React, {memo, useLayoutEffect, useMemo} from "react"
import {LocationContext, LocationStoreContext, QueryParamsContext} from "./location-context"
import {LocationStore} from "./location-store.js"

const withCustomPath = memo(({children, path, queryParams, ...restProps}) => {
  const restPropsKeys = Object.keys(restProps)

  if (restPropsKeys.length > 0) {
    throw new Error(`Unhandled props given: ${restPropsKeys.join(", ")}`)
  }

  const locationStore = useMemo(() => new LocationStore(), [])

  locationStore.replaceSnapshotSilently({path, queryParams})
  useLayoutEffect(locationStore.flushPendingNotification, [locationStore, path, queryParams])

  return (
    <LocationStoreContext.Provider value={locationStore}>
      <LocationContext.Provider value={path}>
        <QueryParamsContext.Provider value={queryParams}>
          {children}
        </QueryParamsContext.Provider>
      </LocationContext.Provider>
    </LocationStoreContext.Provider>
  )
})

export {LocationContext}
export default withCustomPath
