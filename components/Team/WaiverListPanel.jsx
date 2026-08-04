import { Stack, Text, Group, ActionIcon, TextInput } from "@mantine/core";
import { useState } from "react";

function PriorityInput({ claim, maxPriority, onReorder }) {
  const [value, setValue] = useState(String(claim.priority));

  function commit() {
    const parsed = parseInt(value, 10);
    if (
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > maxPriority ||
      parsed === claim.priority
    ) {
      setValue(String(claim.priority));
      return;
    }
    onReorder(claim, parsed);
  }

  return (
    <TextInput
      size="xs"
      w={40}
      ta="center"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
    />
  );
}

export function WaiverListPanel({ claims, onReorder, onRemove }) {
  if (!claims) return <Text size="sm">Loading waiver list...</Text>;
  if (claims.length === 0)
    return (
      <Text size="sm" c="dimmed">
        No pending waiver claims.
      </Text>
    );

  return (
    <Stack gap={4}>
      {claims.map((claim, i) => (
        <Group key={claim.id} justify="space-between" wrap="nowrap">
          <Group gap={6} wrap="nowrap">
            <PriorityInput
              key={`${claim.id}-${claim.priority}`}
              claim={claim}
              maxPriority={claims.length}
              onReorder={onReorder}
            />
            <Text size="sm">
              {claim.addPlayerName} for {claim.dropPlayerName}
            </Text>
          </Group>
          <Group gap={4}>
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={i === 0}
              onClick={() => onReorder(claim, claim.priority - 1)}
            >
              ▲
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              disabled={i === claims.length - 1}
              onClick={() => onReorder(claim, claim.priority + 1)}
            >
              ▼
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={() => onRemove(claim)}
            >
              ✕
            </ActionIcon>
          </Group>
        </Group>
      ))}
    </Stack>
  );
}
