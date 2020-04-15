import { useContext, useEffect, useReducer } from 'react';
import { Client } from 'sundae-collab-client';
import { clientContext } from './Provider';

/**
 * Provides collaboration client id. This hook assumes presence of
 * clientContext in React elements tree.
 */
export default function useSelections(): string | null {
  const client = useContext(clientContext) as Client;
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const listener = () => refresh();
    client.emitter.addEventListener('id', listener);
    return () => client.emitter.removeEventListener('id', listener);
  }, [client]);

  return client.id;
}
