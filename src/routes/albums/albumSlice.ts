import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../common/reducers"
import { AlbumService } from "../../../openapi-client"
import { mainActions } from "../mainSlice"
import store from "../../common/store"
import { getActionName } from "../../common/utils"

import { convertApiError } from "../../common/storeUtils"

type AsyncStatus = "pending" | "fulfilled" | "rejected"

export interface AlbumState {
  errorMessages: Record<string, string>;
  asyncStatus: Record<string, AsyncStatus>;

  // new album route
  newAlbumName: string;
}

const initialState: AlbumState = {
  errorMessages: {},
  asyncStatus: {},

  // new album route
  newAlbumName: "",
}

export const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    updateSlice: (state, action: PayloadAction<Partial<AlbumState>>) => {
      return { ...state, ...action.payload }
    },
    clearErrorMessages: (state) => {
      state.errorMessages = {}
      state.asyncStatus = {}
    },
    addMissingErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessages[action.payload] = "Required"
    },
    resetSlice: () => {
      return initialState
    },
    resetNewAlbumRoute: (state) => {
      const keysToReset = ["newAlbumName"]
      keysToReset.forEach(key => {
        state[key] = initialState[key]
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        state.asyncStatus[getActionName(action)] = "pending"
      })
      .addMatcher(isRejected, (state, action) => {
        state.asyncStatus[getActionName(action)] = "rejected"
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.asyncStatus[getActionName(action)] = "fulfilled"
      })
  }
})

export const addAlbum = createAsyncThunk(
  "album/addAlbum",
  async (_payload, { dispatch }) => {
    const { newAlbumName } = store.getState().album
    // try {
    await convertApiError(async () => {
      const album = await AlbumService.postAlbum({ name: newAlbumName })
      dispatch(
        mainActions.addNotification({
          content: `Album "${album.name}" created`,
          type: "success",
        }),
      )
    })
    // } catch (e) {
    //   const e2 = e as ApiError
    //   dispatch(
    //     mainActions.addNotification({
    //       content: e2.body?.message || "Error creating album",
    //       type: "error",
    //     }),
    //   )
    // }
  }
)

export const albumReducer = albumSlice.reducer
export const albumActions = albumSlice.actions
export const albumSelector = (state: RootState) => state.album
