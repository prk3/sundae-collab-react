import jot from 'jot';
/**
 * Provides value and onChange function accepting jot operation. Takes a path
 * (JSON pointer) pointing to a part of session resource document. This hook
 * assumes presence of sessionContext in React elements tree.
 */
export default function useValue(path?: string): [jot.Document, (update: jot.Operation) => void];
