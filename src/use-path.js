import onLocationChanged from "./on-location-changed.js"
import {useCallback, useEffect, useMemo, useState} from "react"

const usePath = () => {
  const [path, setPath] = useState(globalThis.location.pathname)
  const shared = useMemo(() => ({}), [])

  shared.path = path

  const onLocationChangedCallback = useCallback(() => {
    const newPath = globalThis.location.pathname

    if (newPath != shared.path) {
      setPath(newPath)
    }
  }, [])

  useEffect(() => {
    const onLocationChangedEvent = onLocationChanged(onLocationChangedCallback)

    return () => {
      onLocationChangedEvent.disconnect()
    }
  }, [])

  return path
}

export default usePath
