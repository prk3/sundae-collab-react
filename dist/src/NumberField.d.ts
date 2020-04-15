declare type NumberOp = 'and' | 'or' | 'xor' | 'add' | 'mult';
declare type Props = {
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
export default function NumberField({ path, children }: Props): any;
export {};
