import { TextareaHTMLAttributes } from 'react';
import { Change, Range } from './TextField';
import './style.css';
/**
 * Range + cursor integer.
 */
declare type Cursor = {
    start: number;
    end: number;
    color: number;
};
declare type Props = Omit<TextareaHTMLAttributes<any>, 'value' | 'onChange'> & {
    value: string;
    cursors: {
        [id: string]: Cursor;
    };
    userCursor: string;
    colors: string[];
    fallbackColor: string;
    onChange?: (change: Change) => void;
    onSelectionChange?: (range: Range | null) => void;
};
/**
 * Plain text input that displays multiple cursors coming from TextField.
 * It outputs selection and content updates in a format understood by TextField.
 * The implementation is rather questionable: I render two stacked elements:
 * - textarea with visible text and invisible selection.
 * - div with invisible text and colored selections made out of spans.
 *   line breaks are replaced with div wrapping.
 */
export default function MultiCursorText(props: Props): JSX.Element;
export {};
