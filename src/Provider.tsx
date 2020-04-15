import React, { useEffect, useState } from 'react';
import { Client } from 'sundae-collab-client';

/**
 * Context with the client class from sundae-collab-client.
 */
export const clientContext = React.createContext<Client | null>(null);

type Props = {
  identity: any;
  url: string;
  children: any;
};

/**
 * Injects collaboration client to the React context. Takes collaboration
 * server url and user identity to establish web socket connection and
 * authenticate the client.
 */
export default function Provider({ url, identity, children }: Props) {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const localClient = new Client(url, identity);
    setClient(localClient);
    return () => localClient.stop();
  }, [identity, url]);

  return (
    <clientContext.Provider value={client}>
      {children}
    </clientContext.Provider>
  );
}
