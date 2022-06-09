import {onLocationChanged} from "../index"
import React from "react"

const withPath = (WrappedComponent) => class WithPath extends React.PureComponent {
  state = {
    path: global.location.pathname
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
      <WrappedComponent path={this.state.path} {...this.props} />
    )
  }

  onLocationChanged = () => {
    const path = window.location.pathname

    if (this.state.path != path) this.setState({path})
  }
}

export default withPath
