"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var jot_1 = __importDefault(require("jot"));
var sundae_collab_shared_1 = require("sundae-collab-shared");
var Resource_1 = require("./Resource");
/**
 * Provides value and onChange function accepting jot operation. Takes a path
 * (JSON pointer) pointing to a part of session resource document. This hook
 * assumes presence of sessionContext in React elements tree.
 */
function useValue(path) {
    if (path === void 0) { path = ''; }
    var session = react_1.useContext(Resource_1.sessionContext);
    var _a = react_1.useReducer(function (x) { return x + 1; }, 0), refresh = _a[1];
    react_1.useEffect(function () {
        var listener = function () { return refresh(); }; // force refresh
        session.emitter.addEventListener('value', listener);
        return function () { return session.emitter.removeEventListener('value', listener); };
    }, [path, session]);
    var _b = sundae_collab_shared_1.reach(session.value, path, jot_1.default), value = _b[0], nest = _b[1];
    return [value, function (update) { return session.update(nest(update)); }];
}
exports.default = useValue;
//# sourceMappingURL=useValue.js.map