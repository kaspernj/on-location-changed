import React, {memo, useCallback, useLayoutEffect, useMemo, useState} from "react"
import {browserPath, browserQueryParams} from "./browser-location.js"
import onLocationChanged from "./on-location-changed"
import WithCustomPath from "./with-custom-path"

const WithLocationPath = memo(({children, ...restProps}) => {
  const restPropsKeys = Object.keys(restProps)

  if (restPropsKeys.length > 0) {
    throw new Error(`Unhandled props given: ${restPropsKeys.join(", ")}`)
  }

  const [path, setPath] = useState(browserPath())
  const [queryParams, setQueryParams] = useState(browserQueryParams())
  const shared = useMemo(() => ({}), [])

  shared.path = path

  const onLocationChangedCallback = useCallback(() => {
    const newPath = browserPath()

    setQueryParams(browserQueryParams())

    if (newPath != shared.path) {
      setPath(newPath)
    }
  }, [])

  useLayoutEffect(() => {
    const onLocationChangedEvent = onLocationChanged(onLocationChangedCallback)

    return () => {
      onLocationChangedEvent.disconnect()
    }
  }, [])

  return (
    <WithCustomPath path={path} queryParams={queryParams}>
      {children}
    </WithCustomPath>
  )
})

export default WithLocationPath
