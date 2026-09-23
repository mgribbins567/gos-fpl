import { useRouter } from "next/router";
import { Box, Card, Stack, Button, Text, Paper } from "@mantine/core";
import { Carousel } from "@mantine/carousel";

function BlogCard({ id, date, title, summary, tags }) {
  const router = useRouter();
  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Stack gap="sm">
        <Text c="white" fw={700}>
          Blog
        </Text>
        <Paper c="white" bg="none" withBorder>
          <Stack gap={0}>
            <Text fz="sm" c="white" fw={600}>
              {title}
            </Text>
            <Text fz="sm" c="dimmed">
              {date}
            </Text>
            {summary && (
              <Text fz="sm" c="white">
                {summary}
              </Text>
            )}
            <Text fz="sm" c="white">
              [{tags.join(", ")}]
            </Text>
          </Stack>
        </Paper>
        <Button size="xs" onClick={() => router.push(`/blog/${id}`)}>
          View Post
        </Button>
      </Stack>
    </Card>
  );
}

export function BlogPreviewCard({ posts }) {
  return (
    <Box maw={380} w="98vw">
      <Carousel
        withIndicators={false}
        height="100%"
        width="100%"
        slideGap="md"
        align="center"
        controlsOffset={4}
        controlSize={14}
        emblaOptions={{
          loop: true,
        }}
        styles={{
          controls: {
            top: "5%",
          },
        }}
      >
        {posts.map(({ id, date, title, summary, tags }) => (
          <Carousel.Slide key={id}>
            <BlogCard
              id={id}
              date={date}
              title={title}
              summary={summary}
              tags={tags}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
}
