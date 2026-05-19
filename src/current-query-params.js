// @ts-check

import {defaultLocationStore} from "./location-store.js"

/** @returns {Record<string, unknown>} */
const currentQueryParams = () => defaultLocationStore.queryParams()

export default currentQueryParams
