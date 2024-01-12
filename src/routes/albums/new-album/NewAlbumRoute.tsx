import { Container, ContentLayout, Form, FormField, Header, Input, SpaceBetween } from "@cloudscape-design/components"
import { useSelector } from "react-redux"
import { addAlbum, albumActions, albumSelector } from "../albumSlice"
import store, { appDispatch } from "../../../common/store"
import CloudButton from "../../../components/CloudButton"
import { useNavigate } from "react-router-dom"
import { FormEvent, useEffect } from "react"

export function Component() {
  const navigate = useNavigate()
  const { errorMessages, newAlbumName, asyncStatus } = useSelector(albumSelector)

  useEffect(() => {
    return () => {
      appDispatch(albumActions.clearErrorMessages())
      appDispatch(albumActions.resetNewAlbumRoute())
    }
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await appDispatch(addAlbum())
  }

  function validate() {
    const { newAlbumName } = store.getState().album
    if (newAlbumName.trim().length === 0) {
      appDispatch(albumActions.addMissingErrorMessage("newAlbumName"))
      return false
    }
    return true
  }

  useEffect(() => {
    if (asyncStatus["addAlbum"] === "fulfilled") {
      navigate("..")
    }
  }, [asyncStatus["addAlbum"]])

  return (
    <ContentLayout>
      <form onSubmit={onSubmit}>
        <input hidden type="submit" />
        <Form
          actions={
            <SpaceBetween
              direction="horizontal"
              size="xs"
            >
              <CloudButton
                variant="link"
                formAction="none"
                onClick={() => navigate(-1)}
                disabled={asyncStatus["addAlbum"] === "pending"}
              >
                Cancel
              </CloudButton>
              <CloudButton
                variant="primary"
                formAction="submit"
                loading={asyncStatus["addAlbum"] === "pending"}
              >
                Create
              </CloudButton>
            </SpaceBetween>
          }
        >
          <Container header={<Header>New Album</Header>}>
            <SpaceBetween size="s">
              <FormField
                label="Album name"
                errorText={errorMessages["newAlbumName"]}
              >
                <Input
                  value={newAlbumName}
                  placeholder="Enter value"
                  onChange={event => {
                    appDispatch(albumActions.clearErrorMessages())
                    appDispatch(albumActions.updateSlice({ newAlbumName: event.detail.value }))
                  }}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
    </ContentLayout>
)
}
