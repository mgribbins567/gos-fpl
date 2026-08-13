import { useState } from "react";
import {
  Stack,
  Paper,
  Text,
  Badge,
  Group,
  Card,
  Flex,
  Collapse,
  Box,
} from "@mantine/core";

const ranks = [
  "",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];

export function Matchup({
  manager1,
  manager2,
  score1,
  score2,
  manager1Pos,
  manager2Pos,
  manager1P,
  manager2P,
  manager1Pf,
  manager2Pf,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasScores = score1 != null && score2 != null;
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
            {manager1}
          </Text>
          <Text c="dimmed" size="xs">
            {ranks[manager1Pos]} • {manager1P} P • {manager1Pf} PF
          </Text>
        </Stack>

        <Flex align="center" gap="xs" style={{ flexShrink: 0 }}>
          {hasScores && (
            <>
              <Badge
                fw={800}
                size="lg"
                c="white"
                w={45}
                variant="filled"
                radius="sm"
              >
                {score1}
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
                {score2}
              </Badge>
            </>
          )}
        </Flex>

        <Stack gap={0} style={{ flex: 1, minWidth: 0 }} ta="right">
          <Text fw={700} c="white" size="sm" truncate ta="right">
            {manager2}
          </Text>
          <Text c="dimmed" size="xs" ta="right">
            {manager2Pf} PF • {manager2P} P • {ranks[manager2Pos]}
          </Text>
        </Stack>
      </Flex>

      <Collapse
        expanded={isExpanded}
        transitionDuration={250}
        transitionTimingFunction="ease"
      >
        <Box w="100%" style={{ display: "inline-block", cursor: "default" }}>
          <Text>i'm workin on it</Text>
          {/* {team1 && team2 && matchups && (
                    <Group justify="center" mb="xs">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => setIsHeadToHeadOpen(true)}
                        size="sm"
                        title="View head-to-head history"
                        mt={5}
                      >
                        <VscHistory />
                      </ActionIcon>
                    </Group>
                  )}
                  <Divider my="xs" color="gray.8" />
                  <Box px="xs" pb="xs">
                    <ExpandedMatchupCard
                      team1Details={team1Details}
                      team2Details={team2Details}
                    />
                  </Box> */}
        </Box>
      </Collapse>
      {/* {isHeadToHeadOpen && (
                <HeadToHeadModal
                  managerA={team1Name}
                  managerB={team2Name}
                  matchups={matchups}
                  onClose={() => setIsHeadToHeadOpen(false)}
                />
              )} */}
    </Card>
  );
}
