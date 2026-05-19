import {createContext} from "react"
import {defaultLocationStore} from "./location-store.js"

const LocationContext = createContext()
const QueryParamsContext = createContext()
const LocationStoreContext = createContext(defaultLocationStore)

export {LocationContext, LocationStoreContext, QueryParamsContext, defaultLocationStore}
