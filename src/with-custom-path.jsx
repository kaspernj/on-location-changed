import React, {memo, useEffect, useRef} from "react"
import {LocationContext, LocationStoreContext, QueryParamsContext, defaultLocationStore} from "./location-context"
import {queryParamsKey} from "./query-param-selector.js"

const withCustomPath = memo(({children, path, queryParams, ...restProps}) => {
  const restPropsKeys = Object.keys(restProps)

  if (restPropsKeys.length > 0) {
    throw new Error(`Unhandled props given: ${restPropsKeys.join(", ")}`)
  }

  const typedPath = path || "/"
  const typedQueryParams = queryParams || {}
  const publishedSnapshotKeyRef = useRef("")
  const snapshotKey = `${typedPath}\n${queryParamsKey(typedQueryParams)}`

  defaultLocationStore.replaceSnapshotSilently({
    path: typedPath,
    queryParams: typedQueryParams
  })

  useEffect(() => {
    if (publishedSnapshotKeyRef.current === snapshotKey) return

    publishedSnapshotKeyRef.current = snapshotKey
    queueMicrotask(() => {
      if (publishedSnapshotKeyRef.current === snapshotKey) {
        defaultLocationStore.flushPendingNotification()
      }
    })
  }, [snapshotKey])

  return (
    <LocationStoreContext.Provider value={defaultLocationStore}>
      <LocationContext.Provider value={typedPath}>
        <QueryParamsContext.Provider value={typedQueryParams}>
          {children}
        </QueryParamsContext.Provider>
      </LocationContext.Provider>
    </LocationStoreContext.Provider>
  )
})

export {LocationContext}
export default withCustomPath
