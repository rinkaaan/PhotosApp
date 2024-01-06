import { Container, ContentLayout, Header, SpaceBetween, TextContent } from "@cloudscape-design/components"

export function Component() {

  return (
    <ContentLayout
      header={
        <Header variant="h1">Home</Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Hello world!</Header>}>
          <TextContent>
            <p>Let's make this photos app!</p>
          </TextContent>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  )
}
