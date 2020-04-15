import { useContext, useEffect, useReducer } from 'react';
import { Session } from 'sundae-collab-client';
import { sessionContext } from './Resource';

type Range = { start: number, end: number };

/**
 * Provides selections in a document field pointed by path. This hook assumes
 * presence of sessionContext in React elements tree.
 */
export default function useSelections(path: string): { [id: string]: Range } {
  const session = useContext(sessionContext) as Session;
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const listener = () => refresh(); // force refresh
    session.emitter.addEventListener('meta', listener);
    return () => session.emitter.removeEventListener('meta', listener);
  }, [path, session]);

  const selections = session.meta.selections?.[path] ?? {};

  return selections;
}
