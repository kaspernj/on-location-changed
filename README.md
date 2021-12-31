# Installation

```js
import {callbacksHandler} from "on-location-changed/callbacks-handler"

callbacksHandler.connectReactRouterHistory(history)
```

# Usage

```jsx
const {LocationChanged} = require("on-location-changed/location-changed-component")
```

```jsx
<LocationChanged onChanged={this.onLocationChanged} />
```

```jsx
onLocationChanged = () => {
  console.log("The location was changed")
}
```
