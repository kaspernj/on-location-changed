import usePath from "./use-path.js"

const withPath = (WrappedComponent) => (props) => {
  const path = usePath()

  return (
    <WrappedComponent path={path} {...props} />
  )
}

export default withPath
