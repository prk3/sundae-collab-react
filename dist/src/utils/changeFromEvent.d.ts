import React from 'react';
import { Change } from '../TextField';
/**
 * Creates change (index, removed, inserted) from change event.
 * oldValue is needed for fallback strategy.
 *
 * TODO implement proper change detection using event.inputType and event.data
 */
export default function changeFromEvent(event: React.ChangeEvent, oldValue: string): Change;
