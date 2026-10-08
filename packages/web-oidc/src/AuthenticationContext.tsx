"use client";

import axios from "axios";
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Profile } from "./Profile";

interface IAuthenticationContext {
	isAuthenticated: boolean;
	profile: Profile | null;
	accessToken: string;
}

export const AuthenticationContext =
	createContext<IAuthenticationContext | null>(null);

interface IAuthenticationContextProviderProps extends PropsWithChildren {
	initialIsAuthenticated: boolean;
	initialProfile: Profile | null;
	initialAccessToken: string;
}

export function AuthenticationContextProvider(
	props: IAuthenticationContextProviderProps,
) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		props.initialIsAuthenticated,
	);
	const [profile, setProfile] = useState<Profile | null>(props.initialProfile);
	const [accessToken, setAccessToken] = useState(props.initialAccessToken);

	const refetch = useCallback(async () => {
		const { data: tokenRes } = await axios.get<{
			token: string;
		} | null>("/auth/token");
		if (!tokenRes) {
			setIsAuthenticated(false);
			setProfile(null);
			setAccessToken("");

			return;
		}

		setAccessToken(tokenRes.token);

		const { data } = await axios.get<Profile | null>("/auth/profile");
		setProfile(data);
		setIsAuthenticated(true); // Profile is pretty much guaranteed when we have got token
	}, []);

	const scheduleFetch = useCallback(() => {
		const expiresIn = (profile?.expiresAt ?? 0) - Date.now();

		const timeout = setTimeout(() => {
			void refetch();
		}, expiresIn);

		return () => {
			clearTimeout(timeout);
		};
	}, [refetch, profile]);

	useEffect(() => {
		return scheduleFetch();
	}, [scheduleFetch]);

	return (
		<AuthenticationContext.Provider
			value={{
				isAuthenticated,
				profile,
				accessToken,
			}}
		>
			{props.children}
		</AuthenticationContext.Provider>
	);
}

export function useAuthentication() {
	const context = useContext(AuthenticationContext);
	if (!context)
		throw new Error("useAuthentication must be used in AuthenticationProvider");

	return {
		...context,
		signOut: () => (location.href = "/auth/signout"), // next router does prefetch (which causes error screen to load)
	};
}
