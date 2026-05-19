import {digg} from "diggerize/build/index.js"
import OnLocationChangedCallback from "./on-location-changed-callback.js"

class CallbacksHandler {
  constructor() {
    this.callbacks = {}
    this.count = 0
    this.currentLocationHref = location.href
    this.intervalID = undefined
    this.mutationObserver = undefined
    this.windowEventsConnected = false
  }

  callCallbacks = () => {
    for (const count in this.callbacks) {
      this.callbacks[count].callCallback()
    }
  }

  connectMutationObserver() {
    if (this.mutationObserver || typeof document === "undefined" || !document.querySelector) {
      return
    }

    const body = document.querySelector("body")

    if (!body) {
      return
    }

    // Solution recommended various places on the internet is to observe for changed and then check if the location has changed.
    const observer = new MutationObserver(digg(this, "onLocationMightHaveChanged"))
    const config = {subtree: true, childList: true}

    observer.observe(body, config)
    observer.observe(document, config)
    this.mutationObserver = observer
  }

  connectReactRouterHistory(history) {
    // A React Router history can be registered globally (must be imported before this file).
    history.listen(digg(this, "onLocationMightHaveChanged"))
  }

  connectWindowEvents() {
    if (this.windowEventsConnected || typeof window === "undefined" || !window.addEventListener) {
      return
    }

    this.windowEventsConnected = true

    // If the hash has changed then maybe the entire location has? Trying to catch location change as early as possible.
    window.addEventListener("hashchange", digg(this, "onLocationMightHaveChanged"))

    // 'popstate' is only called doing certain actions (React Router won't trigger this for example).
    window.addEventListener("popstate", digg(this, "onLocationMightHaveChanged"))
  }

  connectInterval = () => {
    if (!this.intervalID) {
      this.intervalID = setInterval(digg(this, "onLocationMightHaveChanged"), 500)
    }

    return this.intervalID
  }

  connectBrowserLocationChanges() {
    this.connectWindowEvents()
    this.connectMutationObserver()
    this.connectInterval()
  }

  onLocationChanged = (givenCallback) => {
    this.count += 1

    const callback = new OnLocationChangedCallback(this, this.count, givenCallback)

    this.callbacks[this.count] = callback

    return callback
  }

  onLocationMightHaveChanged = () => {
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
