import { useNativeState as useJetpackNativeState } from "@expo/ui/jetpack-compose";

export function useNativeState<T>(def: T) {
  return useJetpackNativeState<T>(def);
}
