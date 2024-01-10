import { Container, ContentLayout, Header, Link, SpaceBetween, TextContent } from "@cloudscape-design/components"

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
          <img
            src="https://picsum.photos/682/383"
            style={{ width: "100%" }}
          />
          <Link href="https://twitter.com/mirenbiaojie/status/1681346248652234752?s=20">Link to video</Link>
          <img
            src="https://picsum.photos/383/682"
            style={{ width: "100%" }}
          />
          <Link href="https://www.youtube.com/watch?v=StMzYYXBHdc">Link to video</Link>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  )
}
