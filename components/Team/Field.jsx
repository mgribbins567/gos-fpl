import { Box, Text, Stack, Flex, Group, Badge } from "@mantine/core";
import { groupPlayersByPosition, getShirtUrl } from "../../lib/fplData";

const PITCH_GREEN = "#2d7a3e";
const PITCH_GREEN_DARK = "#276b37";

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

function PlayerChip({ player, onClick, isSelected, isHighlighted }) {
  const color = colorForPositionMack(player.elementType);
  return (
    <Box
      onClick={onClick}
      bg="rgba(255, 255, 255, 0.1)"
      ta="center"
      w="16vw"
      maw="20%"
      bdrs="sm"
      c="white"
      style={{
        cursor: onClick ? "pointer" : "default",
        outline: isSelected
          ? "2px solid blue"
          : isHighlighted
            ? "2px solid orange"
            : "none",
      }}
    >
      <img
        src={getShirtUrl(player.teamCode, player.elementType)}
        alt=""
        width={25}
        height={30}
        style={{ display: "block", margin: "0 auto 2px" }}
      />
      <Badge
        size="compact-xs"
        color={color}
        tt="none"
        fz="xs"
        fw={500}
        miw="100%"
        radius="sm"
        truncate="end"
        style={{
          cursor: onClick ? "pointer" : "default",
        }}
      >
        {player.name}
      </Badge>
      <Text size="xs" fw={700}>
        {player.points}
      </Text>
    </Box>
  );
}

function PositionRow({ players, resolveInteraction }) {
  return (
    <Group
      justify="space-around"
      direction="row"
      py="xs"
      px={1}
      gap="1vw"
      wrap="nowrap"
      w="100%"
    >
      {players.map((player) => (
        <PlayerChip
          key={player.id}
          player={player}
          {...resolveInteraction(player)}
        />
      ))}
    </Group>
  );
}

export function Field({
  players,
  onPlayerClick,
  selectedPlayerId,
  highlightedPlayerIds,
}) {
  const { forwards, midfielders, defenders, goalkeepers, bench } =
    groupPlayersByPosition(players);

  function resolveInteraction(player) {
    const isSelectionModeActive = highlightedPlayerIds !== undefined;
    const isSelected = player.player_id === selectedPlayerId;
    const isHighlighted =
      isSelectionModeActive && highlightedPlayerIds.has(player.player_id);
    const isClickable = !isSelectionModeActive || isSelected || isHighlighted;

    return {
      onClick:
        isClickable && onPlayerClick ? () => onPlayerClick(player) : undefined,
      isSelected,
      isHighlighted,
      isDimmed: isSelectionModeActive && !isSelected && !isHighlighted,
    };
  }

  return (
    <Stack gap="xs" maw="500px" w="100%">
      <Box
        bdrs="md"
        bd="2px solid white"
        style={{
          background: `repeating-linear-gradient(180deg, ${PITCH_GREEN} 0, ${PITCH_GREEN} 40px, ${PITCH_GREEN_DARK} 40px, ${PITCH_GREEN_DARK} 80px)`,
        }}
      >
        <PositionRow
          players={forwards}
          resolveInteraction={resolveInteraction}
        />
        <PositionRow
          players={midfielders}
          resolveInteraction={resolveInteraction}
        />
        <PositionRow
          players={defenders}
          resolveInteraction={resolveInteraction}
        />
        <PositionRow
          players={goalkeepers}
          resolveInteraction={resolveInteraction}
        />
      </Box>

      <Box bdrs="md" bd="1px solid white">
        <PositionRow players={bench} resolveInteraction={resolveInteraction} />
      </Box>
    </Stack>
  );
}
