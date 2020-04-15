import jot from 'jot';
declare type Props = {
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
export default function ReplaceField({ path, children }: Props): any;
export {};
