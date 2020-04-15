"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jot_1 = __importDefault(require("jot"));
var useValue_1 = __importDefault(require("./useValue"));
/**
 * Component field that provides a number and accepts numeric operations.
 * Possible operations: and, or, xor, and, mult.
 */
function NumberField(_a) {
    var path = _a.path, children = _a.children;
    var _b = useValue_1.default(path), value = _b[0], updateValue = _b[1];
    if (typeof value !== 'number') {
        return 'Bad value';
    }
    var onChange = function (op, val) { return updateValue(new jot_1.default.MATH(op, val)); };
    return children({ value: value, onChange: onChange });
}
exports.default = NumberField;
//# sourceMappingURL=NumberField.js.map