import { useState } from "react";
import {
  Stack,
  Text,
  Badge,
  Group,
  Card,
  Flex,
  Collapse,
  Box,
  Divider,
} from "@mantine/core";

function ExpandedFixture({ stats }) {
  const visibleStats = stats.filter(({ a, h }) => a.length > 0 || h.length > 0);
  return (
    <>
      {visibleStats.map(({ identifier, a, h }, index) => (
        <Stack gap={0} key={identifier}>
          <Text ta="center" fz="sm">
            {identifier
              .replace(/_/g, " ")
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")}
          </Text>
          <Group justify="space-between" align="flex-start">
            <Stack gap={0}>
              {h.map(({ player, value }) => (
                <Text key={player} fz="sm">
                  {player} ({value})
                </Text>
              ))}
            </Stack>

            <Stack gap={0}>
              {a.map(({ player, value }) => (
                <Text key={player} fz="sm" ta="right">
                  {player} ({value})
                </Text>
              ))}
            </Stack>
          </Group>
          {index < visibleStats.length - 1 && <Divider my={1} color="gray.8" />}
        </Stack>
      ))}
    </>
  );
}

export function Fixture({ fixture }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const started = fixture.started;
  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      mb="md"
      w={400}
      maw="98vw"
      mx="auto"
      py={4}
      style={{ cursor: "pointer" }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap="sm"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} c="white" size="sm" truncate>
            {fixture.team_h_name}
          </Text>
        </Stack>

        <Flex align="center" gap="xs" style={{ flexShrink: 0 }}>
          {started && (
            <>
              <Badge
                fw={800}
                size="lg"
                c="white"
                w={45}
                variant="filled"
                radius="sm"
              >
                {fixture.team_h_score}
              </Badge>
              <Text fw={700} c="dimmed">
                -
              </Text>
              <Badge
                fw={800}
                size="lg"
                c="white"
                w={45}
                variant="filled"
                radius="sm"
              >
                {fixture.team_a_score}
              </Badge>
            </>
          )}
        </Flex>

        <Stack gap={0} style={{ flex: 1, minWidth: 0 }} ta="right">
          <Text fw={700} c="white" size="sm" truncate ta="right">
            {fixture.team_a_name}
          </Text>
        </Stack>
      </Flex>

      <Collapse
        expanded={isExpanded}
        transitionDuration={250}
        transitionTimingFunction="ease"
      >
        <Box w="100%" style={{ display: "inline-block", cursor: "default" }}>
          <Divider my="xs" color="gray.8" />
          <Box px="xs" pb="xs">
            <ExpandedFixture stats={fixture.stats} />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}
