import {onLocationChanged} from "./on-location-changed.js"
import qs from "qs"
import {useCallback, useEffect, useState} from "react"

const useQueryParams = () => {
  const params = useCallback(() => qs.parse(globalThis.location.search.substr(1)) || {})
  const [queryParams, setQueryParams] = useState(params())
  const updateQueryParams = useCallback(() => setQueryParams(params()))

  useEffect(() => {
    const onLocationChangedEvent = onLocationChanged(updateQueryParams)

    return () => {
      onLocationChangedEvent.disconnect()
    }
  })

  return queryParams
}

export default useQueryParams
