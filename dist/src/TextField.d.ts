/**
 * Represents change to a string. Index defines where the change started,
 * removed is a number of a removed section, inserted is a string that
 * got inserted.
 */
export declare type Change = {
    index: number;
    removed: number;
    inserted: string;
};
/**
 * The same as selection.
 */
export declare type Range = {
    start: number;
    end: number;
};
/**
 * Range + color integer.
 */
declare type Cursor = {
    start: number;
    end: number;
    color: number;
};
declare type Props = {
    path: string;
    children: (data: {
        value: string;
        cursors: {
            [id: string]: Cursor;
        };
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
export default function TextField({ path, children }: Props): any;
export {};
