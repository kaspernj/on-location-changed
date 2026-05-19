import React, {memo, useLayoutEffect} from "react"
import {LocationContext, LocationStoreContext, QueryParamsContext, defaultLocationStore} from "./location-context"

const withCustomPath = memo(({children, path, queryParams, ...restProps}) => {
  const restPropsKeys = Object.keys(restProps)

  if (restPropsKeys.length > 0) {
    throw new Error(`Unhandled props given: ${restPropsKeys.join(", ")}`)
  }

  defaultLocationStore.replaceSnapshotSilently({path, queryParams})
  useLayoutEffect(defaultLocationStore.flushPendingNotification, [path, queryParams])

  return (
    <LocationStoreContext.Provider value={defaultLocationStore}>
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
