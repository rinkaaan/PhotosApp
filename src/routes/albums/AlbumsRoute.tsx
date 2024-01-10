import { Box, Button, Cards, CollectionPreferences, Header, Pagination, SpaceBetween, TextFilter } from "@cloudscape-design/components"
import { useState } from "react"
import { Album } from "../../../openapi-client"
import CloudLink from "../../components/CloudLink"

const items: Album[] = [
  {
    name: "Item 1",
    thumbnail_path: "https://picsum.photos/682/383",
  },
  {
    name: "Item 2",
    thumbnail_path: "https://picsum.photos/682/384",
  },
  {
    name: "Item 3",
    thumbnail_path: "https://picsum.photos/683/385",
  },
  {
    name: "Item 4",
    thumbnail_path: "https://picsum.photos/683/386",
  },
  {
    name: "Item 5",
    thumbnail_path: "https://picsum.photos/683/387",
  },
  {
    name: "Item 6",
    thumbnail_path: "https://picsum.photos/683/388",
  },
]

export function Component() {
  const [
    selectedItems,
    setSelectedItems,
  ] = useState<Album[]>([])

  const isOnlyOneSelected = selectedItems.length === 1

  return (
    <Cards
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
      items={items}
      loadingText="Loading resources"
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
          Albums
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
