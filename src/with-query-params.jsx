import {onLocationChanged} from "../index"
import qs from "qs"
import React from "react"

const params = () => qs.parse(global.location.search.substr(1))

const withQueryParams = (WrappedComponent) => class OnLocationChanged extends React.PureComponent {
  state = {
    queryParams: params()
  }

  componentDidMount() {
    this.onLocationChangedEvent = onLocationChanged(this.onLocationChanged)
  }

  componentWillUnmount() {
    if (this.onLocationChangedEvent) {
      this.onLocationChangedEvent.disconnect()
      this.onLocationChangedEvent = undefined
    }
  }

  render() {
    return (
      <WrappedComponent params={this.state.params} {...this.props} />
    )
  }

  onLocationChanged = () => {
    this.setState({queryParams: params()})
  }
}

export default withQueryParams
