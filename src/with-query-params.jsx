import useQueryParams from "./use-query-params"

const withQueryParams = (WrappedComponent) => (props) => {
  const queryParams = useQueryParams()

  return (
    <WrappedComponent {...props} queryParams={queryParams} />
  )
}

export default withQueryParams
