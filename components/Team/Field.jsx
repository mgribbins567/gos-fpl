import { Box, Text, Stack, Flex, Group } from "@mantine/core";
import { groupPlayersByPosition, getShirtUrl } from "../../lib/fplData";

const PITCH_GREEN = "#2d7a3e";
const PITCH_GREEN_DARK = "#276b37";

function PlayerChip({ player }) {
  return (
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      py={4}
      ta="center"
      miw={60}
      maw={60}
      bdrs="sm"
      bd="1px solid white"
      c="white"
    >
      <img
        src={getShirtUrl(player.teamCode, player.elementType)}
        alt=""
        width={30}
        height={30}
        style={{ display: "block", margin: "0 auto 2px" }}
      />
      <Text size="xs" fw={600} truncate="end">
        {player.name}
      </Text>
      <Text size="xs">{player.points}</Text>
    </Box>
  );
}

function PositionRow({ players }) {
  return (
    <Group justify="space-evenly" direction="row" py="xs" wrap="nowrap">
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
    <Stack gap="xs">
      <Box
        position="relative"
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
