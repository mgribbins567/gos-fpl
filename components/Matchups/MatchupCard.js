import React, { useState } from "react";
import styles from "./MatchupCard.module.css";
import {
  Card,
  Flex,
  Text,
  Badge,
  Divider,
  Box,
  Collapse,
  Popover,
  Button,
  Table,
  Stack,
  Image,
} from "@mantine/core";

const includedStats = [
  "assists",
  "bonus",
  "clean_sheets",
  "goals_conceded",
  "goals_scored",
  "minutes",
  "own_goals",
  "penalties_missed",
  "penalties_saved",
  "red_cards",
  "saves",
  "total_points",
  "yellow_cards",
];

function colorForPositionMack(position) {
  switch (position) {
    case 1:
      return "rgba(15, 8, 75, 1)";
    case 2:
      return "#002F7F";
    case 3:
      return "rgba(61, 96, 167, 1)";
    case 4:
      return "rgba(129, 177, 213, 1)";
    default:
      return "blue";
  }
}

function Player({ name, minutes, position, team, score, details }) {
  // console.log(details);
  const color = colorForPositionMack(position);

  return (
    <Popover width={200} position="top" shadow="md">
      <Popover.Target>
        <Button
          variant="gradient"
          gradient={{ from: color, to: "gray.8", deg: 90 }}
          size="compact-xs"
          color={color}
          leftSection={
            <Image
              src={`https://draft.premierleague.com/img/shirts/standard/shirt_${team}${position === 1 ? "_1" : ""}-66.png`}
              width={22}
              height={22}
              alt="Team Jersey"
            />
          }
          justify="left"
          fw={500}
          c="white"
          style={{ flex: 1, fontSize: "0.875rem" }}
        >
          {name}
        </Button>
      </Popover.Target>
      <Popover.Dropdown p="xs" bd="1px solid white">
        {details && Object.keys(details).length > 0 ? (
          <Stack gap="xs" spacing="xs">
            <Text size="sm" fw={700}>
              {name}
            </Text>
            <Divider color="white" />
            <Table withRowBorders={false} size="sm">
              <Table.Tbody>
                {Object.entries(details).map(([key, value]) => {
                  if (includedStats.includes(key) && value !== 0) {
                    return (
                      <Table.Tr key={key}>
                        <Table.Td>
                          {key
                            .replace(/_/g, " ")
                            .split(" ")
                            .map(
                              (s) => s.charAt(0).toUpperCase() + s.substring(1),
                            )
                            .join(" ")}
                        </Table.Td>
                        <Table.Td ta="right">{value}</Table.Td>
                      </Table.Tr>
                    );
                  }
                })}
              </Table.Tbody>
            </Table>
          </Stack>
        ) : (
          <Text size="xs">No details available</Text>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}

function ExpandedMatchupCard2({ team1Details, team2Details }) {
  return (
    <div>
      {team1Details.map((team1, index) => {
        const team2 = team2Details[index];
        return (
          <React.Fragment key={index}>
            <Flex gap="md" mb={4}>
              <Flex align="center" style={{ flex: 1, overflow: "hidden" }}>
                <Player
                  name={team1.name}
                  position={team1.position}
                  team={team1.team}
                  minutes={team1.subText}
                  score={team1.value}
                  details={team1.additionalDetails}
                />
                <Text size="xs" fw={400} c="dimmed" w={25} ta="center">
                  {team1.subText}
                </Text>
                <Text size="sm" fw={600} c="blue" w={20} ta="right">
                  {team1.value}
                </Text>
              </Flex>

              <Flex align="center" style={{ flex: 1, overflow: "hidden" }}>
                <Player
                  name={team2.name}
                  position={team2.position}
                  team={team2.team}
                  minutes={team2.subText}
                  score={team2.value}
                  details={team2.additionalDetails}
                />
                <Text size="xs" fw={400} c="dimmed" w={20} ta="right">
                  {team2.subText}
                </Text>
                <Text size="sm" fw={700} c="blue" w={20} ta="right">
                  {team2.value}
                </Text>
              </Flex>
            </Flex>
            {index === 10 && <Divider my="sm" color="white" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export function MatchupCard({
  team1,
  team2,
  score1,
  score2,
  team1Details = [],
  team2Details = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      mb="md"
      maw={400}
      mx="auto"
      style={{ cursor: "pointer" }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap="sm"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <Text fw={700} c="white" size="sm" w={80} truncate>
          {team1}
        </Text>

        <Flex align="center" gap="xs" style={{ flexShrink: 0 }}>
          <Badge
            fw={800}
            size="lg"
            c="white"
            w={45}
            variant="filled"
            color="blue"
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
            color="blue"
            radius="sm"
          >
            {score2}
          </Badge>
        </Flex>

        <Text fw={700} c="white" size="sm" w={80} truncate ta="right">
          {team2}
        </Text>
      </Flex>

      <Collapse
        expanded={isExpanded}
        transitionDuration={250}
        transitionTimingFunction="ease"
      >
        <Box w="100%" style={{ display: "inline-block", cursor: "default" }}>
          <Divider my="sm" color="gray.8" />
          <Box px="xs" pb="xs">
            <ExpandedMatchupCard2
              team1Details={team1Details}
              team2Details={team2Details}
            />
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}
