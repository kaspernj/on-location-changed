// @ts-check

import React, {memo} from "react"
import {useGlobalSearchParams, usePathname} from "expo-router"
import WithCustomPath from "./with-custom-path"

/** @typedef {{children: import("react").ReactNode}} WithExpoLocationPathProps */

/** @type {import("react").ComponentType<{children: import("react").ReactNode, path: string, queryParams: Record<string, unknown>}>} */
const CustomPathComponent = WithCustomPath

/** @type {import("react").NamedExoticComponent<WithExpoLocationPathProps>} */
const WithExpoLocationPath = memo(({children, ...restProps}) => {
  const restPropsKeys = Object.keys(restProps)

  if (restPropsKeys.length > 0) {
    throw new Error(`Unhandled props given: ${restPropsKeys.join(", ")}`)
  }

  const path = usePathname()
  const queryParams = useGlobalSearchParams()

  return (
    <CustomPathComponent path={path} queryParams={queryParams}>
      {children}
    </CustomPathComponent>
  )
})

export default WithExpoLocationPath
