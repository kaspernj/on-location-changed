import {useCallback, useEffect, useState} from "react"
import onLocationChanged from "./on-location-changed.js"
import qs from "qs"

const params = () => qs.parse(globalThis.location.search.substr(1)) || {}

const useQueryParams = () => {
  const [queryParams, setQueryParams] = useState(params())
  const updateQueryParams = useCallback(() => setQueryParams(params()), [])

  console.error(`DEBUG: useQueryParams - ${JSON.stringify(queryParams)}`)

  useEffect(() => {
    const onLocationChangedEvent = onLocationChanged(updateQueryParams)

    return () => {
      onLocationChangedEvent.disconnect()
    }
  }, [])

  return queryParams
}

export default useQueryParams
