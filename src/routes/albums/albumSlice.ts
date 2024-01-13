import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../common/reducers"
import { AlbumService } from "../../../openapi-client"
import { mainActions } from "../mainSlice"
import store from "../../common/store"
import { getActionName } from "../../common/utils"
import { getApiErrorMessage } from "../../common/typedUtils"


type AsyncStatus = "pending" | "fulfilled" | "rejected"

export interface AlbumState {
  errorMessages: Record<string, string>;
  asyncStatus: Record<string, AsyncStatus>;

  // new album route
  newAlbumName: string;
  newAlbumModalOpen: boolean;
}

const initialState: AlbumState = {
  errorMessages: {},
  asyncStatus: {},

  // new album route
  newAlbumName: "",
  newAlbumModalOpen: false,
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
    addErrorMessage: (state, action: PayloadAction<{ key: string, message: string }>) => {
      state.errorMessages[action.payload.key] = action.payload.message
    },
    resetSlice: () => {
      return initialState
    },
    resetNewAlbumState: (state) => {
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
    try {
      const album = await AlbumService.postAlbum({ name: newAlbumName })
      dispatch(
        mainActions.addNotification({
          content: `Album "${album.name}" created`,
          type: "success",
        }),
      )
    } catch (e) {
      dispatch(albumActions.addErrorMessage({
        key: "newAlbum",
        message: getApiErrorMessage(e),
      }))
      throw new Error()
    }
  }
)

export const albumReducer = albumSlice.reducer
export const albumActions = albumSlice.actions
export const albumSelector = (state: RootState) => state.album
