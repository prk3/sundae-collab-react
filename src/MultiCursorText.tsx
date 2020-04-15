// turns one line into 5
/* eslint-disable react/jsx-one-expression-per-line */

import React, {
  useRef, TextareaHTMLAttributes, useEffect,
} from 'react';
import { Change, Range } from './TextField';
import changeFromEvent from './utils/changeFromEvent';
import './style.css';

/**
 * Range + cursor integer.
 */
type Cursor = {
  start: number;
  end: number;
  color: number;
};

/**
 * The purpose of a string cut. Used for multi cursor text rendering.
 */
enum CutType {
  END,
  CARET,
  START,
  LF,
}

/**
 * Cut in a string. See renderCursorAreaContent for usage explanation.
 */
type Cut = { type: CutType, id: string, position: number };

type Props = Omit<TextareaHTMLAttributes<any>, 'value' | 'onChange'> & {
  value: string;
  cursors: { [id: string]: Cursor };
  userCursor: string;
  colors: string[];
  fallbackColor: string;
  onChange?: (change: Change) => void;
  onSelectionChange?: (range: Range | null) => void;
};

/**
 * Generates unique keys. Assigning non-static keys to react elements
 * is not recommended and can decrease performance, but I could not find
 * a better strategy.
 */
const uniqueKey = (() => {
  let key = 0;
  return () => key++; /* eslint-disable-line */
})();

/**
 * Finds all all occurrences of substring in a string. Returns an array of
 * indexes.
 */
function findAllOccurrences(substr: string, string: string) {
  const occurrences: number[] = [];
  let start = 0;
  let occurrence = string.indexOf(substr, start);
  while (occurrence !== -1) {
    occurrences.push(occurrence);
    start = occurrence + substr.length;
    occurrence = string.indexOf(substr, start);
  }
  return occurrences;
}

/**
 * Renders a chunk of text, possibly selected by editors.
 */
function renderRange(
  text: string,
  editors: string[],
  { cursors, colors, fallbackColor }: Props,
) {
  let color: string | undefined;

  if (editors.length === 1) {
    color = colors[cursors[editors[0]]?.color] ?? fallbackColor;
  } else if (editors.length > 1) {
    color = fallbackColor;
  }

  return (
    <span
      key={uniqueKey()}
      className="multi-cursor-text__range"
      style={color ? { backgroundColor: color } : {}}
    >
      {text}
    </span>
  );
}

/**
 * Renders a caret belonging to editor.
 */
function renderCaret(
  editors: string[],
  { cursors, colors, fallbackColor }: Props,
) {
  const color = editors.length === 1
    ? colors[cursors[editors[0]]?.color] ?? fallbackColor
    : fallbackColor;

  return (
    <span
      key={uniqueKey()}
      className="multi-cursor-text__caret"
      style={{ color }}
    />
  );
}

/**
 * Renders contents of cursor area in multi cursor input.
 * Strategy: cut the string in places where some selection changes or a line
 * feed character appears. At every cut: end earlier selections, render caret,
 * start new selections and break line with a div.
 */
function renderCursorAreaContent(props: Props) {
  const { value, cursors } = props;

  const cuts: Cut[] = [];

  // Convert each cursor into a cut or two.
  Object.entries(cursors).forEach(([id, cursor]) => {
    if (cursor.start === cursor.end) {
      cuts.push({ type: CutType.CARET, id, position: cursor.start });
    } else {
      cuts.push({ type: CutType.START, id, position: cursor.start });
      cuts.push({ type: CutType.END, id, position: cursor.end });
    }
  });

  // Convert each line feed into a cut.
  findAllOccurrences('\n', value).forEach((position, index) => {
    cuts.push({ type: 3, id: `lf${position}${index}`, position });
  });

  // Sort cuts by their position.
  cuts.sort((a, b) => a.position - b.position);

  // Chunks are string parts not separated by line breaks.
  let chunks: JSX.Element[] = [];

  // When line break appears, chunks are wrapped with a div and pushed to this list.
  const divs: JSX.Element[] = [];

  // last cut's position
  let lastCutPosition = 0;

  // people working on the current string part
  // this data is not reset on cut position change
  const editors: string[] = [];

  for (let i = 0; i < cuts.length; /* no increment */) {
    // render last string part with previously updated editors
    const fragment = value.slice(lastCutPosition, cuts[i].position).replace('\n', '');
    chunks.push(renderRange(fragment, editors, props));

    // we'll now consider cuts with the same position

    // whether this is a break position
    let shouldBreak = false;

    // editors with caret at this position
    const caretEditors: string[] = [];

    // index of the last same position
    let lastSameIndex = i;

    // iterate over cuts with the same position
    for (let j = i; j < cuts.length; j += 1) {
      // check if the cut position is still the same
      if (cuts[j].position !== cuts[i].position) break;
      lastSameIndex += 1;

      const cut = cuts[j];

      switch (cut.type) {
        case CutType.END:
          editors.splice(editors.indexOf(cut.id), 1);
          break;
        case CutType.CARET:
          caretEditors.push(cut.id);
          break;
        case CutType.START:
          editors.push(cut.id);
          break;
        case CutType.LF:
          shouldBreak = true;
          break;
        default:
      }
    }

    // after iterating over all cuts with the same position

    if (caretEditors.length > 0) {
      chunks.push(renderCaret(caretEditors, props));
    }

    if (shouldBreak) {
      // use zero width space character to force non-zero height
      divs.push(<div key={uniqueKey()}>&#8203;{chunks}</div>);
      chunks = [];
    }

    // prepare for the next group
    lastCutPosition = cuts[i].position;
    i = lastSameIndex;
  }

  // push the last part of the string, with no cursors or carets
  // use zero width space character to force non-zero height
  const lastFragment = value.slice(lastCutPosition).replace('\n', '');
  const lastChunk = renderRange(lastFragment, [], props);
  divs.push(<div key={uniqueKey()}>&#8203;{[...chunks, lastChunk]}</div>);

  // return all "paragraphs"
  return divs;
}

/**
 * Plain text input that displays multiple cursors coming from TextField.
 * It outputs selection and content updates in a format understood by TextField.
 * The implementation is rather questionable: I render two stacked elements:
 * - textarea with visible text and invisible selection.
 * - div with invisible text and colored selections made out of spans.
 *   line breaks are replaced with div wrapping.
 */
export default function MultiCursorText(props: Props) {
  const editArea = useRef<HTMLTextAreaElement>(null);
  const cursorBox = useRef<HTMLDivElement>(null);

  const {
    value,
    cursors,
    userCursor,
    onChange,
    onSelectionChange,
  } = props;

  // The real select event is not emitted "on mouse up" and we have to rely on
  // many other events. This function checks if update is necessary before
  // emitting, so that we can avoid unnecessary and costly updates.
  function handleSelect() {
    if (!onSelectionChange) {
      return;
    }

    const currentSelection = document.activeElement === editArea.current
      ? {
        start: editArea.current?.selectionStart ?? 0,
        end: editArea.current?.selectionEnd ?? 0,
      }
      : null;

    const prevSelection = cursors[userCursor] ?? null;

    if (!currentSelection && !prevSelection) {
      // both missing, ok
      return;
    }
    if (currentSelection && !prevSelection) {
      onSelectionChange(currentSelection);
      return;
    }
    if (!currentSelection && prevSelection) {
      onSelectionChange(currentSelection);
      return;
    }
    const changed = currentSelection
      && prevSelection
      && (currentSelection.start !== prevSelection.start
        || currentSelection.end !== prevSelection.end);

    if (changed) {
      onSelectionChange(currentSelection);
    }
  }

  // send content and selection update on real textarea change
  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (onChange) {
      onChange(changeFromEvent(event, value));
    }
    if (onSelectionChange) {
      onSelectionChange({
        start: editArea.current?.selectionStart ?? 0,
        end: editArea.current?.selectionEnd ?? 0,
      });
    }
  }

  // when a cursor data changes, update real textarea selection
  useEffect(() => {
    if (editArea.current) {
      editArea.current.selectionStart = cursors[userCursor]?.start ?? 0;
      editArea.current.selectionEnd = cursors[userCursor]?.end ?? 0;
    }
  }, [cursors, userCursor]);

  return (
    <div className="multi-cursor-text">
      <textarea
        className="multi-cursor-text__edit-area"
        ref={editArea}
        value={value}
        onChange={handleInput}
        onMouseDown={handleSelect}
        onMouseMove={handleSelect}
        onSelect={handleSelect}
        onBlur={handleSelect}
      />
      <div
        className="multi-cursor-text__cursor-area"
        ref={cursorBox}
      >
        {renderCursorAreaContent(props)}
      </div>
    </div>
  );
}
