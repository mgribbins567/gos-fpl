import React, { useState } from "react";
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
  Popover,
  Button,
  Table,
  Image,
  CloseButton,
  ActionIcon,
} from "@mantine/core";
import { VscHistory } from "react-icons/vsc";
import { HiOutlineUser } from "react-icons/hi2";
import { getShirtUrl, orderPlayersForList } from "../../lib/fplData";
import { usePlayerDetail } from "../../contexts/PlayerDetailContext";

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

function colorForPositionMack(position) {
  switch (position) {
    case 1:
      return "orange";
    case 2:
      return "blue";
    case 3:
      return "green";
    case 4:
      return "red";
    default:
      return "blue";
  }
}

function colorForStatus(status) {
  if (status === "a") {
    return "#343a40";
  } else if (status === "d") {
    return "#ff840078";
  } else {
    return "#ff00006c";
  }
}

function Player({ player }) {
  const openPlayerDetail = usePlayerDetail();
  const [opened, setOpened] = useState(false);
  const color = colorForPositionMack(player.elementType);
  const statusColor = colorForStatus(player.status);
  let name =
    player.seasonStats.first_name + " " + player.seasonStats.second_name;
  if (name.length === 0 || name.length > 21) {
    name = player.name;
  }

  return (
    <Popover
      width={200}
      position="top"
      shadow="md"
      opened={opened}
      onDismiss={() => setOpened(false)}
      px={0}
    >
      <Popover.Target>
        <Button
          //   variant="filled"
          //   gradient={{ from: color, to: statusColor, deg: 90 }}
          size="compact-xs"
          color={color}
          justify="left"
          leftSection={
            <Image
              src={getShirtUrl(player.teamCode, player.elementType)}
              width={22}
              height={22}
              alt="Team Jersey"
            />
          }
          rightSection={
            player.seasonStats.status != "a" ? (
              <Badge
                size="compact-xs"
                variant="filled"
                color={
                  player.seasonStats.status === "a"
                    ? ""
                    : player.seasonStats.status === "d"
                      ? "yellow.5"
                      : "red.8"
                }
                fz={12}
                radius="xs"
                style={{ cursor: "pointer" }}
              >
                {player.seasonStats.status != "a" ? "⚠" : ""}
              </Badge>
            ) : (
              <span />
            )
          }
          fw={500}
          c="black"
          style={{ flex: 1, fontSize: "0.875rem" }}
          onClick={() => setOpened((o) => !o)}
        >
          {player.name}
        </Button>
      </Popover.Target>
      <Popover.Dropdown p="xs" bd="1px solid white">
        {player.explain && Object.keys(player.explain).length > 0 ? (
          <Stack gap={0} spacing="xs">
            <Group justify="space-between" wrap="nowrap" gap={0} maw="100%">
              <Group gap={2} wrap="nowrap">
                <HiOutlineUser
                  cursor="pointer"
                  onClick={() => openPlayerDetail(player, { canEdit: false })}
                />
                <Text size="sm" fw={700}>
                  {name}
                </Text>
              </Group>
              <CloseButton size="xs" onClick={() => setOpened((o) => !o)} />
            </Group>
            <Group gap={4}>
              {player.fixtures.map((fixture) => (
                <Group gap={4}>
                  <Text fz="xs" fw={fixture.isHome ? 700 : ""}>
                    {fixture.isHome
                      ? player.teamShortName
                      : fixture.opponentShortName}
                  </Text>
                  <Text fz="xs">
                    {fixture.isHome
                      ? (fixture.teamScore || "0") +
                        " - " +
                        (fixture.opponentScore || "0")
                      : (fixture.opponentScore || "0") +
                        " - " +
                        (fixture.teamScore || "0")}
                  </Text>
                  <Text fz="xs" fw={fixture.isHome ? 500 : 700}>
                    {fixture.isHome
                      ? fixture.opponentShortName
                      : player.teamShortName}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {fixture.minutes}'
                  </Text>
                </Group>
              ))}
            </Group>
            <Divider color="white" />
            <Table tabularNums variant="vertical" verticalSpacing={3}>
              <Table.Tbody>
                {Object.values(player.explain).flatMap((match) =>
                  match.stats.map((stat) => (
                    <Table.Tr key={`${match.id}-${stat.identifier}`}>
                      <Table.Td>
                        {stat.identifier
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (s) => s.charAt(0).toUpperCase() + s.substring(1),
                          )
                          .join(" ")}
                      </Table.Td>
                      <Table.Td ta="center">({stat.value})</Table.Td>
                      <Table.Td ta="right">{stat.points}</Table.Td>
                    </Table.Tr>
                  )),
                )}
                <Table.Tr
                  key="total"
                  style={{
                    backgroundColor: "#8080803c",
                  }}
                >
                  <Table.Td>Total Points:</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td ta="right" fw={700}>
                    {player.points}
                  </Table.Td>
                </Table.Tr>
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

function ExpandedMatchupCard({ team1Details, team2Details }) {
  if (!team1Details || !team2Details) return;
  const team2 = orderPlayersForList(team2Details);
  return (
    <div>
      {orderPlayersForList(team1Details).map((player1, index) => {
        const player2 = team2[index];
        return (
          <React.Fragment key={index}>
            <Flex gap="md" mb={4}>
              <Flex align="center" style={{ flex: 1, overflow: "hidden" }}>
                <Player player={player1} />
                <Text size="xs" fw={400} c="dimmed" w={25} ta="center">
                  {player1.minutes || 0}'
                </Text>
                <Text size="sm" c="deep-blue.2" w={20} ta="right">
                  {player1.points || 0}
                </Text>
              </Flex>

              <Flex align="center" style={{ flex: 1, overflow: "hidden" }}>
                <Player player={player2} />
                <Text size="xs" fw={400} c="dimmed" w={20} ta="right">
                  {player2.minutes || 0}'
                </Text>
                <Text size="sm" c="deep-blue.2" w={20} ta="right">
                  {player2.points || 0}
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

export function Matchup({
  manager1,
  manager2,
  score1,
  score2,
  manager1Team,
  manager2Team,
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
          {manager1Team && manager2Team && hasScores && (
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
          <Box px={0} pb="xs">
            <ExpandedMatchupCard
              team1Details={manager1Team}
              team2Details={manager2Team}
            />
          </Box>
        </Box>
      </Collapse>
      {/* {isHeadToHeadOpen && (
        <HeadToHeadModal
          managerA={manager1}
          managerB={manager2}
          matchups={matchups}
          onClose={() => setIsHeadToHeadOpen(false)}
        />
      )} */}
    </Card>
  );
}
