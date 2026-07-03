import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const ManagerContext = createContext(null);

async function fetchManager(userId) {
  const { data: manager, error } = await supabase
    .from("Manager")
    .select("*")
    .eq("auth_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return manager;
}

export function ManagerProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [manager, setManager] = useState(undefined);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setManager(undefined);
      if (currentUser) {
        fetchManager(currentUser.id).then(setManager).catch(console.error);
      } else {
        setManager(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ManagerContext.Provider value={{ user, manager, supabase }}>
      {children}
    </ManagerContext.Provider>
  );
}

export function useManager() {
  const context = useContext(ManagerContext);
  if (!context) throw new Error("ManagerProvider is missing.");
  return context;
}
