"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jot_1 = __importDefault(require("jot"));
var useValue_1 = __importDefault(require("./useValue"));
var useSelections_1 = __importDefault(require("./useSelections"));
var useClientId_1 = __importDefault(require("./useClientId"));
var useParticipants_1 = __importDefault(require("./useParticipants"));
/**
 * Field component providing cursor data and accepting string updates.
 * In case of a conflict, OT algorithm will try to preserve intentions
 * of all conflicting changes.
 */
function TextField(_a) {
    var path = _a.path, children = _a.children;
    var clientId = useClientId_1.default();
    var participants = useParticipants_1.default();
    var _b = useValue_1.default(path), value = _b[0], updateValue = _b[1];
    var selections = useSelections_1.default(path);
    if (typeof value !== 'string') {
        return 'Bad value';
    }
    var participantsMap = Object.fromEntries(participants.map(function (p) { return [p.id, p]; }));
    var cursors = Object.fromEntries(Object.entries(selections)
        .filter(function (_a) {
        var id = _a[0];
        return id in participantsMap;
    })
        .map(function (_a) {
        var id = _a[0], range = _a[1];
        return [id, __assign(__assign({}, range), { color: participantsMap[id].color })];
    }));
    var onChange = function (change) {
        updateValue(new jot_1.default.SPLICE(change.index, change.removed, change.inserted));
    };
    var onSelectionChange = function (range) {
        updateValue(new jot_1.default.SELECT(clientId, range));
    };
    return children({
        value: value,
        cursors: cursors,
        userCursor: clientId,
        onChange: onChange,
        onSelectionChange: onSelectionChange,
    });
}
exports.default = TextField;
//# sourceMappingURL=TextField.js.map