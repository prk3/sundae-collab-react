"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates change (index, removed, inserted) from change event.
 * oldValue is needed for fallback strategy.
 *
 * TODO implement proper change detection using event.inputType and event.data
 */
function changeFromEvent(event, oldValue) {
    // fallback strategy looks for where strings differ by iterating from both ends
    // this method can not find an accurate position when working with repeating characters
    // for example, adding "a" into "aa" at position 2 generates [insert "a" @ 0]
    var _a, _b;
    // @ts-ignore we are not sure what element is emitting event
    var newValue = (_b = (_a = event.target.value) !== null && _a !== void 0 ? _a : event.target.innerText) !== null && _b !== void 0 ? _b : '';
    var oldStart = 0;
    var newStart = 0;
    while (oldStart < oldValue.length
        && newStart < newValue.length
        && oldValue[oldStart] === newValue[newStart]) {
        oldStart += 1;
        newStart += 1;
    }
    var oldEnd = oldValue.length;
    var newEnd = newValue.length;
    while (oldEnd > oldStart
        && newEnd > newStart
        && oldValue[oldEnd - 1] === newValue[newEnd - 1]) {
        oldEnd -= 1;
        newEnd -= 1;
    }
    var removed = oldEnd - oldStart;
    var inserted = newValue.substring(newStart, newEnd);
    return { index: oldStart, removed: removed, inserted: inserted };
}
exports.default = changeFromEvent;
//# sourceMappingURL=changeFromEvent.js.map