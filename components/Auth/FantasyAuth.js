import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  Stack,
  Group,
  Button,
  Text,
  TextInput,
  PasswordInput,
  Flex,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useManager } from "../../contexts/ManagerContext";
import { User } from "@phosphor-icons/react";

export function FantasyAuth() {
  const { user, manager, supabase } = useManager();
  const [mode, setMode] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signUp") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      }
      close();
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/`
            : undefined,
      },
    });

    if (error) {
      setMessage(error.message);
    }

    setLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMessage("Signed out.");
    setMode("signIn");
  }

  if (!supabase) {
    return <p>Something is broken. Please ping me.</p>;
  }

  return (
    <Group miw="400px" maw="70%" justify="space-between">
      {user === null ? null : manager ? (
        <Text>Hello {manager && manager.name}</Text>
      ) : (
        <Text>Please ping me to link your account!</Text>
      )}
      <Modal opened={opened} onClose={close} centered title="Authentication">
        <Stack gap="xs">
          <Group padding="sm" gap={0}>
            {!user && (
              <Group justify="space-between" style={{ width: "100%" }}>
                <Text c="white" fw="700">
                  {mode === "signIn" ? "Sign in!" : "Sign up!"}
                </Text>
                <Button
                  onClick={() =>
                    setMode(mode === "signIn" ? "signUp" : "signIn")
                  }
                  disabled={loading}
                  padding="xs"
                >
                  {mode === "signIn" ? "Sign up" : "Sign in"}
                </Button>
              </Group>
            )}
          </Group>

          {user ? (
            <Stack gap="xs" mt={0}>
              <Text>Signed in as {user.email}</Text>
              <Button onClick={handleSignOut} disabled={loading}>
                Sign out
              </Button>
            </Stack>
          ) : (
            <form onSubmit={handleEmailSubmit}>
              <Stack>
                <TextInput
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@email.com"
                  required
                />
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Put your password here"
                  required
                  minLength={6}
                />

                <Button type="submit" disabled={loading}>
                  {mode === "signUp" ? "Create account" : "Sign in"}
                </Button>
              </Stack>
            </form>
          )}

          {!user && (
            <Flex align="center" justify="center">
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                w={200}
                size="xs"
              >
                Sign in with Google
              </Button>
            </Flex>
          )}
        </Stack>
      </Modal>
      {!user ? (
        <Button variant="default" onClick={open}>
          Sign in
        </Button>
      ) : (
        <Button size="compact-sm" fz={20} variant="default" onClick={open}>
          <User />
        </Button>
      )}
    </Group>
  );
}
