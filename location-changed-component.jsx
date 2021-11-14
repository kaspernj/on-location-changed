import {onLocationChanged} from "./on-location-changed"
import PropTypes from "prop-types"
import PropTypesExact from "prop-types-exact"
import React from "react"

export default class EventLocationChanged extends React.PureComponent {
  static propTypes = PropTypesExact({
    history: PropTypes.object,
    onChanged: PropTypes.func.isRequired
  })

  currentLocationHref = location.href

  componentDidMount() {
    if (this.props.history) {
      this.appHistoryUnlisten = this.props.history.listen(this.onHistoryChanged)
    }

    this.onLocationChanged = onLocationChanged(this.onLocationChanged)
  }

  componentWillUnmount() {
    if (this.appHistoryUnlisten) {
      this.appHistoryUnlisten()
      this.appHistoryUnlisten = undefined
    }

    if (this.onLocationChanged) {
      this.onLocationChanged.disconnect()
      this.onLocationChanged = undefined
    }
  }

  render() {
    return null
  }

  onHistoryChanged = () => {
    this.callOnChangedIfChanged()
  }

  onLocationChanged = () => {
    this.callOnChangedIfChanged()
  }

  callOnChangedIfChanged = () => {
    this.props.onChanged()
  }
}
