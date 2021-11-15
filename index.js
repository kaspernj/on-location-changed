import {callbacksHandler} from "./callbacks-handler"

const onLocationChanged = (callback) => callbacksHandler.onLocationChanged(callback)

export {onLocationChanged}
