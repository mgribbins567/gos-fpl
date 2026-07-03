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
} from "@mantine/core";
import { useManager } from "../../contexts/ManagerContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function fetchManager(userId) {
  const { data: manager, error } = await supabase
    .from("Manager")
    .select("*")
    .eq("auth_id", userId)
    .single();

  if (error) return null;
  return manager;
}

export function FantasyAuth() {
  const { user, manager, supabase } = useManager();
  const [mode, setMode] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
            ? `${window.location.origin}/fantasy`
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
    <Card shadow="sm" padding="sm" radius="md" maw={520} miw={340} withBorder>
      <Stack gap="xs">
        <Group padding="sm" gap={0}>
          {!user && (
            <Group justify="space-between" style={{ width: "100%" }}>
              <Text c="white" fw="700">
                {mode === "signIn" ? "Sign in!" : "Sign up!"}
              </Text>
              <Button
                onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
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
            {manager === undefined ? (
              <Text>Welcome</Text>
            ) : manager ? (
              <Text>Welcome {manager.name}</Text>
            ) : (
              <Text>Welcome - please ping me to link your account!</Text>
            )}
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
    </Card>
  );
}
