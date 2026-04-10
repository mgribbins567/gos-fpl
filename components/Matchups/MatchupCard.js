import React, { useState } from "react";
import styles from "./MatchupCard.module.css";
import { Card, Flex, Text, Badge, Divider, Box, Collapse } from "@mantine/core";

function Player({ details }) {
  console.log("details: ", details);

  return <div>{details.goals_scored}</div>;
}

function ExpandedMatchupCard2({ team1Details, team2Details }) {
  return (
    <div>
      {team1Details.map((item, index) => {
        const item2 = team2Details[index];
        return (
          <React.Fragment key={index}>
            <Flex gap="md" mb={4}>
              <Flex align="center" style={{ flex: 1, overflow: "hidden" }}>
                <Text size="sm" c="white" truncate style={{ flex: 1 }}>
                  {item.name}
                </Text>
                <Text size="sm" fw={600} c="blue">
                  {item.value}
                </Text>
              </Flex>

              <Flex align="center" style={{ flex: 1, overflow: "hidden" }}>
                <Text size="sm" c="white" truncate style={{ flex: 1 }}>
                  {item2.name}
                </Text>
                <Text size="sm" fw={600} c="blue" ta="right">
                  {item2.value}
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
  console.log("card is currently: ", isExpanded);

  return (
    <Card
      shadow="sm"
      padding="xs"
      radius="md"
      withBorder
      mb="md"
      maw={300}
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
            fw={700}
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
            fw={700}
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
