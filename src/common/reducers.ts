import { combineReducers } from "@reduxjs/toolkit"
import { mainReducer } from "../routes/mainSlice"
import { albumReducer } from "../routes/albums/albumSlice"

export const reducers = combineReducers({
  main: mainReducer,
  album: albumReducer,
})

export type RootState = ReturnType<typeof reducers>
