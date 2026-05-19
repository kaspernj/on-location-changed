# Installation

```js
import {callbacksHandler} from "on-location-changed/build/callbacks-handler"

callbacksHandler.connectReactRouterHistory(history)
```

# Usage

```jsx
import WithCustomPath from "on-location-changed/build/with-custom-path"
```

```jsx
<WithCustomPath path={somePath}>
  <App />
</WithCustomPath>
```

```jsx
<WithLocationPath>
  <App />
</WithLocationPath>
```

```jsx
import WithExpoLocationPath from "on-location-changed/build/with-expo-location-path"
```

```jsx
<WithExpoLocationPath>
  <App />
</WithExpoLocationPath>
```

```jsx
import usePath from "on-location-changed/build/use-path"
```

```jsx
const path = usePath()
```

```jsx
import useSelectedQueryParams from "on-location-changed/build/use-selected-query-params"
```

```jsx
const params = useSelectedQueryParams(["project_ids", {q: ["name_cont", "state_in"]}])
```

```jsx
import useLocationPath from "on-location-changed/build/use-location-path"
```

```jsx
const path = useLocationPath()
```

```jsx
import currentLocationPath from "on-location-changed/build/current-location-path"
import currentQueryParams from "on-location-changed/build/current-query-params"
import useCurrentQueryParams from "on-location-changed/build/use-current-query-params"
```

```jsx
const path = currentLocationPath()
const params = currentQueryParams()
const readCurrentQueryParams = useCurrentQueryParams()
```

```jsx
import onSelectedQueryParamsChanged from "on-location-changed/build/on-selected-query-params-changed"
```

```jsx
const subscription = onSelectedQueryParamsChanged("project_ids", (params) => {
  console.log(params)
})

subscription.disconnect()
```

```jsx
import {locationPathWithQueryParams, pushQueryParamUpdates} from "on-location-changed/build/query-param-updates"
```

```jsx
const path = locationPathWithQueryParams("/timelogs", {project_ids: ["1", "2"]})

pushQueryParamUpdates(router, readCurrentQueryParams(), "/timelogs", {
  project_ids: ["3"]
})
```
