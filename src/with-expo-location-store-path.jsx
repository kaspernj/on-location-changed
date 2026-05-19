// @ts-check

import React, {memo, useLayoutEffect} from "react"
import {Platform} from "react-native"
import {useGlobalSearchParams, usePathname} from "expo-router"
import {browserQueryParams} from "./browser-location.js"
import {LocationStoreContext, defaultLocationStore} from "./location-context.js"

/** @import {ReactNode} from "react" */

/**
 * @typedef {object} WithExpoLocationStorePathProps
 * @property {ReactNode} children Wrapped app tree.
 */

/**
 * Updates the external location store from Expo Router without changing context values.
 * @param {WithExpoLocationStorePathProps} props Component props.
 * @returns {ReactNode} Wrapped app tree.
 */
function WithExpoLocationStorePathComponent({children, ...restProps}) {
  const restPropsKeys = Object.keys(restProps)

  if (restPropsKeys.length > 0) {
    throw new Error(`Unhandled props given: ${restPropsKeys.join(", ")}`)
  }

  const pathname = usePathname()
  const expoQueryParams = useGlobalSearchParams()
  const queryParams = Platform.OS === "web" ? browserQueryParams() : expoQueryParams

  useLayoutEffect(() => {
    defaultLocationStore.setSnapshot({path: pathname, queryParams})
  }, [pathname, queryParams])

  return (
    <LocationStoreContext.Provider value={defaultLocationStore}>
      {children}
    </LocationStoreContext.Provider>
  )
}

const WithExpoLocationStorePath = memo(WithExpoLocationStorePathComponent)

export default WithExpoLocationStorePath
