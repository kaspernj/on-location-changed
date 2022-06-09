import {callbacksHandler} from "./src/callbacks-handler.js"

const onLocationChanged = (callback) => callbacksHandler.onLocationChanged(callback)

export {onLocationChanged}
