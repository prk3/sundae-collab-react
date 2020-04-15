import jot from 'jot';
import useValue from './useValue';
import useSelections from './useSelections';
import useClientId from './useClientId';
import useParticipants from './useParticipants';

/**
 * Represents change to a string. Index defines where the change started,
 * removed is a number of a removed section, inserted is a string that
 * got inserted.
 */
export type Change = {
  index: number;
  removed: number;
  inserted: string;
};

/**
 * The same as selection.
 */
export type Range = {
  start: number;
  end: number;
};

/**
 * Range + color integer.
 */
type Cursor = {
  start: number;
  end: number;
  color: number;
};

type Props = {
  path: string;
  children: (data: {
    value: string;
    cursors: { [id: string]: Cursor };
    userCursor: string;
    onChange: (change: Change) => void;
    onSelectionChange: (range: Range | null) => void;
  }) => any;
};

/**
 * Field component providing cursor data and accepting string updates.
 * In case of a conflict, OT algorithm will try to preserve intentions
 * of all conflicting changes.
 */
export default function TextField({ path, children }: Props) {
  const clientId = useClientId();
  const participants = useParticipants();
  const [value, updateValue] = useValue(path);
  const selections = useSelections(path);

  if (typeof value !== 'string') {
    return 'Bad value';
  }

  const participantsMap = Object.fromEntries(participants.map((p) => [p.id, p]));

  const cursors = Object.fromEntries(Object.entries(selections)
    .filter(([id]) => id in participantsMap)
    .map(([id, range]) => [id, { ...range, color: participantsMap[id].color }]));

  const onChange = (change: Change) => {
    updateValue(new jot.SPLICE(change.index, change.removed, change.inserted));
  };

  const onSelectionChange = (range: Range | null) => {
    updateValue(new jot.SELECT(clientId as string, range));
  };

  return children({
    value,
    cursors,
    userCursor: clientId as string,
    onChange,
    onSelectionChange,
  });
}
