import {digg} from "diggerize"
import {OnLocationChangedCallback} from "./on-location-changed-callback.js"

class CallbacksHandler {
  constructor() {
    this.callbacks = {}
    this.count = 0
    this.currentLocationHref = location.href
  }

  callCallbacks = () => {
    for (const count in this.callbacks) {
      this.callbacks[count].callCallback()
    }
  }

  connectMutationObserver() {
    // Solution recommended various places on the internet is to observe for changed and then check if the location has changed.
    new MutationObserver(digg(this, "onLocationMightHaveChanged")).observe(document, {subtree: true, childList: true})
  }

  connectReactRouterHistory(history) {
    // A React Router history can be registered globally (must be imported before this file).
    history.listen(digg(this, "onLocationMightHaveChanged"))
  }

  connectWindowEvents() {
    // If the hash has changed then maybe the entire location has? Trying to catch location change as early as possible.
    window.addEventListener("hashchange", digg(this, "onLocationMightHaveChanged"))

    // 'popstate' is only called doing certain actions (React Router won't trigger this for example).
    window.addEventListener("popstate", digg(this, "onLocationMightHaveChanged"))
  }

  onLocationChanged = (givenCallback) => {
    this.count += 1

    const callback = new OnLocationChangedCallback(this, this.count, givenCallback)

    this.callbacks[this.count] = callback

    return callback
  }

  onLocationMightHaveChanged = () => {
    console.error(`Location changed: ${location.href}`)

    if (location.href != this.currentLocationHref) {
      this.currentLocationHref = location.href

      this.callCallbacks()
    }
  }
}

// Prevent anything from spawning multiple instances (which happened!)
if (!globalThis.onLocationChangedCallbacksHandler) {
  globalThis.onLocationChangedCallbacksHandler = new CallbacksHandler()
}

const callbacksHandler = globalThis.onLocationChangedCallbacksHandler

// Export the single handler that is supposed to exist
export {callbacksHandler}
