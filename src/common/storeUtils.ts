import { FlashbarProps } from "@cloudscape-design/components"
import { appDispatch } from "./store"
import { mainActions } from "../routes/mainSlice"
import { ApiError } from "../../openapi-client"

export function prepareNotifications(notifications: Array<FlashbarProps.MessageDefinition>) {
  return notifications.map(n => ({
    ...n,
    onDismiss: () => {
      if (n.id) {
        appDispatch(mainActions.removeNotification(n.id))
      }
    },
  }))
}

export async function convertApiError(callback: () => Promise<void>) {
  try {
    await callback()
  } catch (e) {
    const e2 = e as ApiError
    console.error(e2)
    appDispatch(mainActions.addNotification({
      type: "error",
      content: e2.body?.message || "An unexpected error occurred",
    }))
    throw new Error()
  }
}
