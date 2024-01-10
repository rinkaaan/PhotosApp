import { Container, ContentLayout, Header, SpaceBetween } from "@cloudscape-design/components"

export function Component() {
  return (
    <ContentLayout
      header={
        <Header variant="h1">Albums</Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Hello world!</Header>}>

        </Container>
      </SpaceBetween>
    </ContentLayout>
  )
}
