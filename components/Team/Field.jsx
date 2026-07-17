import { Box, Text, Stack, Flex, Group, Badge } from "@mantine/core";
import { groupPlayersByPosition, getShirtUrl } from "../../lib/fplData";

const PITCH_GREEN = "#2d7a3e";
const PITCH_GREEN_DARK = "#276b37";

function colorForPositionMack(position) {
  switch (position) {
    case 1:
      return "red";
    case 2:
      return "orange";
    case 3:
      return "rgba(61, 96, 167, 1)";
    case 4:
      return "purple";
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

function PlayerChip({ player }) {
  const color = colorForPositionMack(player.elementType);
  return (
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      py={4}
      ta="center"
      miw={70}
      maw={70}
      bdrs="sm"
      //   bd="1px solid white"
      c="white"
    >
      <img
        src={getShirtUrl(player.teamCode, player.elementType)}
        alt=""
        width={30}
        height={30}
        style={{ display: "block", margin: "0 auto 2px" }}
      />
      <Badge
        size="compact-xs"
        variant="gradient"
        gradient={{
          from: color,
          to: "gray",
          deg: 90,
        }}
        tt="none"
        fz="xs"
        fw={500}
        miw="100%"
        radius="sm"
        truncate="end"
      >
        {player.name}
      </Badge>
      <Text size="xs">{player.points}</Text>
    </Box>
  );
}

function PositionRow({ players }) {
  return (
    <Group
      justify="center"
      direction="row"
      py="xs"
      px="xs"
      gap={12}
      wrap="nowrap"
      w="100%"
    >
      {players.map((player) => (
        <PlayerChip key={player.id} player={player} />
      ))}
    </Group>
  );
}

export function Field({ players }) {
  const { forwards, midfielders, defenders, goalkeepers, bench } =
    groupPlayersByPosition(players);

  return (
    <Stack gap="xs" w="100%">
      <Box
        // position="relative"
        bdrs="md"
        bd="2px solid white"
        style={{
          background: `repeating-linear-gradient(180deg, ${PITCH_GREEN} 0, ${PITCH_GREEN} 40px, ${PITCH_GREEN_DARK} 40px, ${PITCH_GREEN_DARK} 80px)`,
        }}
      >
        <PositionRow players={forwards} />
        <PositionRow players={midfielders} />
        <PositionRow players={defenders} />
        <PositionRow players={goalkeepers} />
      </Box>

      <Box bdrs="md" bd="1px solid white">
        <PositionRow players={bench} />
      </Box>
    </Stack>
  );
}
