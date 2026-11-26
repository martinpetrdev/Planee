import { Children } from '@repo-shared/mobile-utils';
import {
  QueryClient,
  QueryClientProvider as TanstackQueryProvider,
} from '@tanstack/react-query';

export const queryClient = new QueryClient();

interface IQueryClientProviderProps {
  children: Children;
}

export function QueryClientProvider(props: IQueryClientProviderProps) {
  return (
    <TanstackQueryProvider client={queryClient}>
      {props.children}
    </TanstackQueryProvider>
  );
}
