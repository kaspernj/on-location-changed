// @ts-check

import {browserLocationSnapshot} from "./browser-location.js"
import {queryParamsKey} from "./query-param-selector.js"

/** @typedef {{path: string, queryParams: Record<string, unknown>}} LocationSnapshot */

/** Stores location state for hooks without forcing context-wide rerenders. */
class LocationStore {
  /** @param {Partial<LocationSnapshot>} [snapshot] */
  constructor(snapshot = browserLocationSnapshot()) {
    this.snapshot = normalizeSnapshot(snapshot)
    this.pendingNotification = false
    /** @type {Set<() => void>} */
    this.listeners = new Set()
    this.subscribe = this.subscribe.bind(this)
  }

  /** @returns {LocationSnapshot} */
  getSnapshot = () => this.snapshot

  /** @returns {string} */
  path = () => this.snapshot.path

  /** @returns {Record<string, unknown>} */
  queryParams = () => this.snapshot.queryParams

  /** @param {() => void} listener */
  subscribe(listener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  /** @param {Partial<LocationSnapshot>} snapshot */
  setSnapshot(snapshot) {
    const nextSnapshot = normalizeSnapshot(snapshot)

    if (!sameSnapshot(this.snapshot, nextSnapshot)) {
      this.snapshot = nextSnapshot
      this.notify()
    }
  }

  /** @param {Partial<LocationSnapshot>} snapshot */
  replaceSnapshotSilently(snapshot) {
    const nextSnapshot = normalizeSnapshot(snapshot)

    if (!sameSnapshot(this.snapshot, nextSnapshot)) {
      this.snapshot = nextSnapshot
      this.pendingNotification = true
    }
  }

  flushPendingNotification = () => {
    if (this.pendingNotification) {
      this.pendingNotification = false
      this.notify()
    }
  }

  notify() {
    for (const listener of [...this.listeners]) {
      try {
        listener()
      } catch (error) {
        setTimeout(() => { throw error }, 0)
      }
    }
  }
}

/** @param {Partial<LocationSnapshot>} snapshot */
const normalizeSnapshot = (snapshot) => ({
  path: snapshot.path || "/",
  queryParams: snapshot.queryParams || {}
})

/**
 * @param {LocationSnapshot} firstSnapshot
 * @param {LocationSnapshot} secondSnapshot
 */
const sameSnapshot = (firstSnapshot, secondSnapshot) => (
  firstSnapshot.path == secondSnapshot.path &&
  queryParamsKey(firstSnapshot.queryParams) == queryParamsKey(secondSnapshot.queryParams)
)

const defaultLocationStore = new LocationStore()

export {LocationStore, defaultLocationStore}
