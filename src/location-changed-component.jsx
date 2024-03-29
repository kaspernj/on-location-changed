import onLocationChanged from "./on-location-changed"
import PropTypes from "prop-types"
import PropTypesExact from "prop-types-exact"
import React from "react"

export class LocationChanged extends React.PureComponent {
  static propTypes = PropTypesExact({
    history: PropTypes.object,
    onChanged: PropTypes.func.isRequired
  })

  componentDidMount() {
    this.onLocationChanged = onLocationChanged(this.props.onChanged)
  }

  componentWillUnmount() {
    if (this.onLocationChanged) {
      this.onLocationChanged.disconnect()
      this.onLocationChanged = undefined
    }
  }

  render() {
    return null
  }
}
