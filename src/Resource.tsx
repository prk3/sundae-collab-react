import React, { useContext, useEffect, useState } from 'react';
import { Session, initSession } from 'sundae-collab-client';
import { clientContext } from './Provider';
import log from './utils/log';

type Props = {
  id: string;
  type: string;
  value: any;
  children?: any;
  fallback?: any;
};

/**
 * Context with session instance from sundae-collab-client.
 */
export const sessionContext = React.createContext<Session | null>(null);

/**
 * Injects session to the React context. Takes resource data and initial value
 * to start/join a collaboration session.
 */
export default function Resource({
  id,
  type,
  value,
  children,
  fallback,
}: Props) {
  const client = useContext(clientContext);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let localSession: Session | null = null;
    if (client) {
      initSession(client, type, id, value)
        .then((s) => {
          localSession = s;
          setSession(s);
        })
        .catch((err) => log.error('Can not open session', err));
    } else {
      setSession(null);
    }
    return () => {
      if (localSession) {
        localSession.stop();
      }
    };
  }, [client, type, id, value]);

  if (!session) {
    return fallback !== undefined ? fallback : <span>waiting for session</span>;
  }

  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
}
