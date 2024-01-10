import { Box, Button, Cards, Header, Pagination, SpaceBetween, TextFilter } from "@cloudscape-design/components"
import { useState } from "react"
import { Media } from "../../../openapi-client"
import CloudLink from "../../components/CloudLink"
import { uuid } from "../../common/typedUtils"

const items: Media[] = [
  {
    title: "Item 1",
    thumbnail_path: "https://picsum.photos/682/383",
    albums: [{ name: "test album" }, { name: "test album 2" }]
  },
  {
    title: "Item 2",
    thumbnail_path: "https://picsum.photos/682/384",
  },
  {
    title: "Item 3",
    thumbnail_path: "https://picsum.photos/683/385",
    albums: [{ name: "test album" }]
  },
  {
    title: "Item 4",
    thumbnail_path: "https://picsum.photos/683/386",
    albums: [{ name: "test album" }, { name: "test album 2" }]
  },
  {
    title: "Item 5",
    thumbnail_path: "https://picsum.photos/683/387",
  },
  {
    title: "Item 6",
    thumbnail_path: "https://picsum.photos/683/388",
    albums: [{ name: "test album" }]
  },
]

export function Component() {
  const [
    selectedItems,
    setSelectedItems,
  ] = useState<Media[]>([])

  const isOnlyOneSelected = selectedItems.length === 1

  return (
    <Cards
      onSelectionChange={({ detail }) => {
        console.log(detail?.selectedItems)
        setSelectedItems(detail?.selectedItems ?? [])
      }}
      selectedItems={selectedItems}
      ariaLabels={{
        itemSelectionLabel: (e, t) => `select ${t.title}`,
        selectionGroupLabel: "Item selection",
      }}
      cardDefinition={{
        header: item => <CloudLink href="#" fontSize="heading-m">{item.title}</CloudLink>,
        sections: [
          {
            id: "albums",
            content: (item) => {
              const links = item.albums?.map(album => <CloudLink href="#" key={uuid()}>#{album.name}</CloudLink>)
              return (
                <SpaceBetween size="xs" direction="horizontal">
                  {links}
                </SpaceBetween>
              )
            }
          },
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
      items={items}
      loadingText="Loading resources"
      selectionType="multi"
      trackBy="title"
      variant="full-page"
      visibleSections={["albums", "image"]}
      stickyHeader={true}
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
      filter={
        <TextFilter filteringPlaceholder="Find resources" filteringText="Filtering" />
      }
      header={
        <Header
          variant="awsui-h1-sticky"
          counter={
            selectedItems?.length
              ? "(" + selectedItems.length + "/10)"
              : "(10)"
          }
          actions={
            <SpaceBetween size="xs" direction="horizontal">
              <Button data-testid="header-btn-edit" disabled={!isOnlyOneSelected}>
                Edit
              </Button>
              <Button data-testid="header-btn-delete" disabled={selectedItems.length === 0}>
                Delete
              </Button>
              <Button data-testid="header-btn-create" variant="primary">
                Create
              </Button>
            </SpaceBetween>
          }
        >
          All Media
        </Header>
      }
      pagination={
        <Pagination
          currentPageIndex={1}
          pagesCount={2}
        />
      }
    />
  )
}
