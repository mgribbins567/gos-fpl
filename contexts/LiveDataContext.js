import { createContext, useContext } from "react";

const LiveDataContext = createContext(null);

export function useLiveData() {
  return useContext(LiveDataContext);
}

export default LiveDataContext;
