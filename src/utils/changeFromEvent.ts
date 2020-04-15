import React from 'react';
import { Change } from '../TextField';

/**
 * Creates change (index, removed, inserted) from change event.
 * oldValue is needed for fallback strategy.
 *
 * TODO implement proper change detection using event.inputType and event.data
 */
export default function changeFromEvent(event: React.ChangeEvent, oldValue: string): Change {
  // fallback strategy looks for where strings differ by iterating from both ends
  // this method can not find an accurate position when working with repeating characters
  // for example, adding "a" into "aa" at position 2 generates [insert "a" @ 0]

  // @ts-ignore we are not sure what element is emitting event
  const newValue = event.target.value ?? event.target.innerText ?? '';
  let oldStart = 0;
  let newStart = 0;

  while (oldStart < oldValue.length
    && newStart < newValue.length
    && oldValue[oldStart] === newValue[newStart]) {
    oldStart += 1;
    newStart += 1;
  }

  let oldEnd = oldValue.length;
  let newEnd = newValue.length;

  while (oldEnd > oldStart
    && newEnd > newStart
    && oldValue[oldEnd - 1] === newValue[newEnd - 1]) {
    oldEnd -= 1;
    newEnd -= 1;
  }

  const removed = oldEnd - oldStart;
  const inserted = newValue.substring(newStart, newEnd);

  return { index: oldStart, removed, inserted };
}
