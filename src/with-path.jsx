import React, {memo} from "react"
import usePath from "./use-path.js"

const withPath = (WrappedComponent) => memo((props) => {
  const path = usePath()

  return (
    <WrappedComponent path={path} {...props} />
  )
})

export default withPath
