import jot from 'jot';
import useValue from './useValue';

type NumberOp = 'and' | 'or' | 'xor' | 'add' | 'mult';

type Props = {
  path: string;
  children: (data: {
    value: number;
    onChange: (op: NumberOp, value: number) => void;
  }) => any;
};

/**
 * Component field that provides a number and accepts numeric operations.
 * Possible operations: and, or, xor, and, mult.
 */
export default function NumberField({ path, children }: Props) {
  const [value, updateValue] = useValue(path);

  if (typeof value !== 'number') {
    return 'Bad value';
  }

  const onChange = (op: NumberOp, val: number) => updateValue(new jot.MATH(op, val));
  return children({ value, onChange });
}
