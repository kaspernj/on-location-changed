const callbacks = {}

// eslint-disable-next-line jest/require-hook
let count = 0

// eslint-disable-next-line jest/require-hook
let currentLocationHref = location.href

class OnLocationChangedCallback {
  constructor(id, callback) {
    this.callback = callback
    this.id = id
    this.callCallback = this.callCallback.bind(this)
    this.disconnect = this.disconnect.bind(this)
  }

  callCallback() {
    this.callback()
  }

  disconnect() {
    delete callbacks[this.id]
  }
}

const onLocationChanged = (givenCallback) => {
  count += 1

  const callback = new OnLocationChangedCallback(count, givenCallback)

  callbacks[count] = callback

  return callback
}

const callCallbacks = () => {
  const errors = []

  for (const count in callbacks) {
    const callback = callbacks[count]

    try {
      callback.callCallback()
    } catch (e) {
      errors.push(e)
    }
  }

  for (const error of errors) console.error(error)
}

const onLocationMightHaveChanged = () => {
  if (location.href != currentLocationHref) {
    currentLocationHref = location.href
    callCallbacks()
  }
}

// Solution recommended various places on the internet is to observe for changed and then check if the location has changed.
new MutationObserver(onLocationMightHaveChanged).observe(document, {subtree: true, childList: true})

// If the hash has changed then maybe the entire location has? Trying to catch location change as early as possible.
window.addEventListener("hashchange", onLocationMightHaveChanged)

// 'popstate' is only called doing certain actions (React Router won't trigger this for example).
window.addEventListener("popstate", onLocationMightHaveChanged)

export {onLocationChanged}
