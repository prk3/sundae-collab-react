import { useContext, useEffect, useReducer } from 'react';
import jot from 'jot';
import { reach } from 'sundae-collab-shared';
import { Session } from 'sundae-collab-client';
import { sessionContext } from './Resource';

/**
 * Provides value and onChange function accepting jot operation. Takes a path
 * (JSON pointer) pointing to a part of session resource document. This hook
 * assumes presence of sessionContext in React elements tree.
 */
export default function useValue(path: string = ''): [jot.Document, (update: jot.Operation) => void] {
  const session = useContext(sessionContext) as Session;
  const [, refresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const listener = () => refresh(); // force refresh
    session.emitter.addEventListener('value', listener);
    return () => session.emitter.removeEventListener('value', listener);
  }, [path, session]);

  const [value, nest] = reach(session.value, path, jot);

  return [value, (update) => session.update(nest(update))];
}
