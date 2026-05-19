// @ts-check

import {defaultLocationStore} from "./location-context.js"

/** @returns {string} Current location path without query params. */
const currentLocationPath = () => defaultLocationStore.path()

export default currentLocationPath
