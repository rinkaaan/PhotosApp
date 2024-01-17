import { Box, Cards, Header, SpaceBetween, Spinner, TextContent, TextFilter } from "@cloudscape-design/components"
import { Fragment, useState } from "react"
import { Album } from "../../../../openapi-client"
import CloudLink from "../../../components/CloudLink"
import CloudButton from "../../../components/CloudButton"
import { appDispatch } from "../../../common/store"
import { albumActions, albumSelector, queryAlbums, queryMoreAlbums } from "../albumSlice"
import NewAlbumModal from "./NewAlbumModal"
import { useSelector } from "react-redux"
import useDelayedTrue from "../../../hooks/useDelayedTrue"
import useScrollToBottom from "../../../hooks/useScrollToBottom"

// const items: Album[] = [
//   {
//     name: "Item 1",
//     // thumbnail_path: "https://picsum.photos/682/383",
//     thumbnail_path: "https://dummyimage.com/600x400/000/fff",
//   },
//   {
//     name: "Item 2",
//     // thumbnail_path: "https://picsum.photos/682/384",
//     thumbnail_path: "https://dummyimage.com/600x400/000/fff",
//   },
//   {
//     name: "Item 3",
//     // thumbnail_path: "https://picsum.photos/683/385",
//     thumbnail_path: "https://dummyimage.com/600x400/000/fff",
//   },
//   {
//     name: "Item 4",
//     // thumbnail_path: "https://picsum.photos/683/386",
//     thumbnail_path: "https://dummyimage.com/600x400/000/fff",
//   },
//   {
//     name: "Item 5",
//     // thumbnail_path: "https://picsum.photos/683/387",
//     thumbnail_path: "https://dummyimage.com/600x400/000/fff",
//   },
//   {
//     name: "Item 6",
//     // thumbnail_path: "https://picsum.photos/683/388",
//     thumbnail_path: "https://dummyimage.com/600x400/000/fff",
//   },
// ]

export function loader() {
  appDispatch(queryAlbums())
  return null
}

export function Component() {
  const [
    selectedItems,
    setSelectedItems,
  ] = useState<Album[]>([])
  const { asyncStatus, albums } = useSelector(albumSelector)
  const showLoader = useDelayedTrue()
  const isOnlyOneSelected = selectedItems.length === 1

  useScrollToBottom(() => {
    appDispatch(queryMoreAlbums())
  }, asyncStatus["queryAlbums"] === "pending" || asyncStatus["queryMoreAlbums"] === "pending")

  return (
    <Fragment>
      <Cards
        loading={asyncStatus["queryAlbums"] === "pending" && showLoader || albums === undefined}
        onSelectionChange={({ detail }) =>
          setSelectedItems(detail?.selectedItems ?? [])
        }
        selectedItems={selectedItems}
        ariaLabels={{
          itemSelectionLabel: (e, t) => `select ${t.name}`,
          selectionGroupLabel: "Item selection",
        }}
        cardDefinition={{
          // header: item => item.name,
          // make header a link to # using CloudLink component
          header: item => <CloudLink href="#" fontSize="heading-m">{item.name}</CloudLink>,
          sections: [
            // {
            //   id: "type",
            //   header: "Type",
            //   content: item => item.type,
            // },
            {
              id: "image",
              content: item => (
                <img
                  src={item.thumbnail_path}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              ),
            }
          ],
        }}
        cardsPerRow={[
          { cards: 1 },
          { minWidth: 500, cards: 2 },
        ]}
        entireCardClickable
        items={albums || []}
        loadingText="Loading albums"
        selectionType="multi"
        trackBy="name"
        variant="full-page"
        visibleSections={["type", "image"]}
        stickyHeader={true}
        empty={
          <Box
            margin={{ vertical: "xs" }}
            textAlign="center"
            color="inherit"
          >
            <SpaceBetween size="m">
              <b>No albums</b>
              <CloudButton>Create album</CloudButton>
            </SpaceBetween>
          </Box>
        }
        filter={
          <TextFilter filteringPlaceholder="Find albums" filteringText="" />
        }
        header={
          <Header
            variant="awsui-h1-sticky"
            // counter={
            //   selectedItems?.length
            //     ? `(${selectedItems.length}/${albums.length})`
            //     : `(${albums.length})`
            // }
            counter={
              albums
                ? selectedItems?.length
                  ? `(${selectedItems.length}/${albums.length})`
                  : `(${albums.length})`
                : ""
            }
            actions={
              <SpaceBetween size="xs" direction="horizontal">
                <CloudButton disabled={!isOnlyOneSelected}>
                  Edit
                </CloudButton>
                <CloudButton disabled={selectedItems.length === 0}>
                  Delete
                </CloudButton>
                <CloudButton
                  variant="primary"
                  onClick={() => {
                    appDispatch(albumActions.updateSlice({ newAlbumModalOpen: true }))
                  }}
                >
                  Create
                </CloudButton>
              </SpaceBetween>
            }
          >
            Albums
          </Header>
        }
      />
      {
        asyncStatus["queryMoreAlbums"] === "pending" && (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "0.5rem", color: "#5f6b7a" }}>
              <SpaceBetween
                size="xs"
                direction="horizontal"
                alignItems="center"
              >
                <Spinner size="normal" />
                <TextContent>
                  <p style={{ color: "#5f6b7a" }}>Loading albums</p>
                </TextContent>
              </SpaceBetween>
            </div>
        )
      }
      <NewAlbumModal />
    </Fragment>
  )
}
