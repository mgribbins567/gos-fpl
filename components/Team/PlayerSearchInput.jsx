import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { TextInput } from "@mantine/core";

export function PlayerSearchInput({ onDebouncedChange }) {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);

  useEffect(() => {
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange]);

  return (
    <TextInput
      size="xs"
      placeholder="Search players..."
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}
