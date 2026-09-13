import Constants from "expo-constants";

const EXPO_DEV_IP = Constants.expoConfig?.hostUri?.split(":").shift();

export const API_BASE = __DEV__ ? `http://${EXPO_DEV_IP}:4001` : ""; // TODO: Add production address
