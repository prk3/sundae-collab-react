"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jot_1 = __importDefault(require("jot"));
var useValue_1 = __importDefault(require("./useValue"));
/**
 * Component field that provides and accepts any type of value. In case of a
 * conflict, one of two values will be selected for the new value.
 */
function ReplaceField(_a) {
    var path = _a.path, children = _a.children;
    var _b = useValue_1.default(path), value = _b[0], updateValue = _b[1];
    var onChange = function (newValue) { return updateValue(new jot_1.default.SET(newValue)); };
    return children({ value: value, onChange: onChange });
}
exports.default = ReplaceField;
//# sourceMappingURL=ReplaceField.js.map