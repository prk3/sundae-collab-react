import jot from 'jot';
import useValue from './useValue';

type Props = {
  path: string;
  children: (data: {
    value: jot.Document;
    onChange: (value: jot.Document) => void;
  }) => any;
};

/**
 * Component field that provides and accepts any type of value. In case of a
 * conflict, one of two values will be selected for the new value.
 */
export default function ReplaceField({ path, children }: Props) {
  const [value, updateValue] = useValue(path);
  const onChange = (newValue: jot.Document) => updateValue(new jot.SET(newValue));
  return children({ value, onChange });
}
