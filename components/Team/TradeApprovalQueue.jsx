import {
  Card,
  Stack,
  Text,
  Button,
  Group,
  Divider,
  Paper,
} from "@mantine/core";
import { useState } from "react";

export function TradeApprovalQueue({
  title,
  trades,
  showLeagueName,
  onRespond,
}) {
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState(null);

  if (!trades || trades.length === 0) return null;

  async function handleRespond(tradeId, accept) {
    setSubmittingId(tradeId);
    setError(null);
    try {
      await onRespond(tradeId, accept);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      <Stack gap="sm">
        <Text fw={700}>{title}</Text>
        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}
        {trades.map((trade, i) => (
          <div key={trade.id}>
            <Paper shadow="xs" padding="sm" radius="md">
              <Text size="sm" fw={600}>
                {showLeagueName && `${trade.leagueName}: `}
                {trade.proposingManagerName} ↔ {trade.receivingManagerName}
              </Text>
            </Paper>
            {trade.pairings.map((p) => (
              <Text key={p.id} size="sm">
                {p.proposerPlayerName} ↔ {p.receiverPlayerName}
              </Text>
            ))}
            <Group grow mt={4}>
              <Button
                size="xs"
                variant="default"
                loading={submittingId === trade.id}
                onClick={() => handleRespond(trade.id, false)}
              >
                Decline
              </Button>
              <Button
                size="xs"
                loading={submittingId === trade.id}
                onClick={() => handleRespond(trade.id, true)}
              >
                {showLeagueName ? "Approve" : "Accept"}
              </Button>
            </Group>
          </div>
        ))}
      </Stack>
    </Card>
  );
}
