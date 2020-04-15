"use strict";
// turns one line into 5
/* eslint-disable react/jsx-one-expression-per-line */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var changeFromEvent_1 = __importDefault(require("./utils/changeFromEvent"));
require("./style.css");
/**
 * The purpose of a string cut. Used for multi cursor text rendering.
 */
var CutType;
(function (CutType) {
    CutType[CutType["END"] = 0] = "END";
    CutType[CutType["CARET"] = 1] = "CARET";
    CutType[CutType["START"] = 2] = "START";
    CutType[CutType["LF"] = 3] = "LF";
})(CutType || (CutType = {}));
/**
 * Generates unique keys. Assigning non-static keys to react elements
 * is not recommended and can decrease performance, but I could not find
 * a better strategy.
 */
var uniqueKey = (function () {
    var key = 0;
    return function () { return key++; }; /* eslint-disable-line */
})();
/**
 * Finds all all occurrences of substring in a string. Returns an array of
 * indexes.
 */
function findAllOccurrences(substr, string) {
    var occurrences = [];
    var start = 0;
    var occurrence = string.indexOf(substr, start);
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
function renderRange(text, editors, _a) {
    var cursors = _a.cursors, colors = _a.colors, fallbackColor = _a.fallbackColor;
    var _b, _c;
    var color;
    if (editors.length === 1) {
        color = (_c = colors[(_b = cursors[editors[0]]) === null || _b === void 0 ? void 0 : _b.color]) !== null && _c !== void 0 ? _c : fallbackColor;
    }
    else if (editors.length > 1) {
        color = fallbackColor;
    }
    return (react_1.default.createElement("span", { key: uniqueKey(), className: "multi-cursor-text__range", style: color ? { backgroundColor: color } : {} }, text));
}
/**
 * Renders a caret belonging to editor.
 */
function renderCaret(editors, _a) {
    var cursors = _a.cursors, colors = _a.colors, fallbackColor = _a.fallbackColor;
    var _b, _c;
    var color = editors.length === 1
        ? (_c = colors[(_b = cursors[editors[0]]) === null || _b === void 0 ? void 0 : _b.color]) !== null && _c !== void 0 ? _c : fallbackColor : fallbackColor;
    return (react_1.default.createElement("span", { key: uniqueKey(), className: "multi-cursor-text__caret", style: { color: color } }));
}
/**
 * Renders contents of cursor area in multi cursor input.
 * Strategy: cut the string in places where some selection changes or a line
 * feed character appears. At every cut: end earlier selections, render caret,
 * start new selections and break line with a div.
 */
function renderCursorAreaContent(props) {
    var value = props.value, cursors = props.cursors;
    var cuts = [];
    // Convert each cursor into a cut or two.
    Object.entries(cursors).forEach(function (_a) {
        var id = _a[0], cursor = _a[1];
        if (cursor.start === cursor.end) {
            cuts.push({ type: CutType.CARET, id: id, position: cursor.start });
        }
        else {
            cuts.push({ type: CutType.START, id: id, position: cursor.start });
            cuts.push({ type: CutType.END, id: id, position: cursor.end });
        }
    });
    // Convert each line feed into a cut.
    findAllOccurrences('\n', value).forEach(function (position, index) {
        cuts.push({ type: 3, id: "lf" + position + index, position: position });
    });
    // Sort cuts by their position.
    cuts.sort(function (a, b) { return a.position - b.position; });
    // Chunks are string parts not separated by line breaks.
    var chunks = [];
    // When line break appears, chunks are wrapped with a div and pushed to this list.
    var divs = [];
    // last cut's position
    var lastCutPosition = 0;
    // people working on the current string part
    // this data is not reset on cut position change
    var editors = [];
    for (var i = 0; i < cuts.length; /* no increment */) {
        // render last string part with previously updated editors
        var fragment = value.slice(lastCutPosition, cuts[i].position).replace('\n', '');
        chunks.push(renderRange(fragment, editors, props));
        // we'll now consider cuts with the same position
        // whether this is a break position
        var shouldBreak = false;
        // editors with caret at this position
        var caretEditors = [];
        // index of the last same position
        var lastSameIndex = i;
        // iterate over cuts with the same position
        for (var j = i; j < cuts.length; j += 1) {
            // check if the cut position is still the same
            if (cuts[j].position !== cuts[i].position)
                break;
            lastSameIndex += 1;
            var cut = cuts[j];
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
            divs.push(react_1.default.createElement("div", { key: uniqueKey() },
                "\u200B",
                chunks));
            chunks = [];
        }
        // prepare for the next group
        lastCutPosition = cuts[i].position;
        i = lastSameIndex;
    }
    // push the last part of the string, with no cursors or carets
    // use zero width space character to force non-zero height
    var lastFragment = value.slice(lastCutPosition).replace('\n', '');
    var lastChunk = renderRange(lastFragment, [], props);
    divs.push(react_1.default.createElement("div", { key: uniqueKey() },
        "\u200B", __spreadArrays(chunks, [lastChunk])));
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
function MultiCursorText(props) {
    var editArea = react_1.useRef(null);
    var cursorBox = react_1.useRef(null);
    var value = props.value, cursors = props.cursors, userCursor = props.userCursor, onChange = props.onChange, onSelectionChange = props.onSelectionChange;
    // The real select event is not emitted "on mouse up" and we have to rely on
    // many other events. This function checks if update is necessary before
    // emitting, so that we can avoid unnecessary and costly updates.
    function handleSelect() {
        var _a, _b, _c, _d, _e;
        if (!onSelectionChange) {
            return;
        }
        var currentSelection = document.activeElement === editArea.current
            ? {
                start: (_b = (_a = editArea.current) === null || _a === void 0 ? void 0 : _a.selectionStart) !== null && _b !== void 0 ? _b : 0,
                end: (_d = (_c = editArea.current) === null || _c === void 0 ? void 0 : _c.selectionEnd) !== null && _d !== void 0 ? _d : 0,
            }
            : null;
        var prevSelection = (_e = cursors[userCursor]) !== null && _e !== void 0 ? _e : null;
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
        var changed = currentSelection
            && prevSelection
            && (currentSelection.start !== prevSelection.start
                || currentSelection.end !== prevSelection.end);
        if (changed) {
            onSelectionChange(currentSelection);
        }
    }
    // send content and selection update on real textarea change
    function handleInput(event) {
        var _a, _b, _c, _d;
        if (onChange) {
            onChange(changeFromEvent_1.default(event, value));
        }
        if (onSelectionChange) {
            onSelectionChange({
                start: (_b = (_a = editArea.current) === null || _a === void 0 ? void 0 : _a.selectionStart) !== null && _b !== void 0 ? _b : 0,
                end: (_d = (_c = editArea.current) === null || _c === void 0 ? void 0 : _c.selectionEnd) !== null && _d !== void 0 ? _d : 0,
            });
        }
    }
    // when a cursor data changes, update real textarea selection
    react_1.useEffect(function () {
        var _a, _b, _c, _d;
        if (editArea.current) {
            editArea.current.selectionStart = (_b = (_a = cursors[userCursor]) === null || _a === void 0 ? void 0 : _a.start) !== null && _b !== void 0 ? _b : 0;
            editArea.current.selectionEnd = (_d = (_c = cursors[userCursor]) === null || _c === void 0 ? void 0 : _c.end) !== null && _d !== void 0 ? _d : 0;
        }
    }, [cursors, userCursor]);
    return (react_1.default.createElement("div", { className: "multi-cursor-text" },
        react_1.default.createElement("textarea", { className: "multi-cursor-text__edit-area", ref: editArea, value: value, onChange: handleInput, onMouseDown: handleSelect, onMouseMove: handleSelect, onSelect: handleSelect, onBlur: handleSelect }),
        react_1.default.createElement("div", { className: "multi-cursor-text__cursor-area", ref: cursorBox }, renderCursorAreaContent(props))));
}
exports.default = MultiCursorText;
//# sourceMappingURL=MultiCursorText.js.map