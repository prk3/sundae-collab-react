import { useContext, useEffect, useReducer } from 'react';
import { Session, SessionParticipant } from 'sundae-collab-client';
import { sessionContext } from './Resource';

/**
 * Provides session participants list. This hook assumes presence of
 * sessionContext in React elements tree.
 */
export default function useParticipants(): SessionParticipant[] {
  const session = useContext(sessionContext) as Session;
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const listener = () => refresh();
    session.emitter.addEventListener('participants', listener);
    return () => session.emitter.removeEventListener('participants', listener);
  }, [session]);

  return session.participants as SessionParticipant[];
}
