"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Resource_1 = require("./Resource");
/**
 * Provides selections in a document field pointed by path. This hook assumes
 * presence of sessionContext in React elements tree.
 */
function useSelections(path) {
    var _a, _b;
    var session = react_1.useContext(Resource_1.sessionContext);
    var _c = react_1.useReducer(function (x) { return x + 1; }, 0), refresh = _c[1];
    react_1.useEffect(function () {
        var listener = function () { return refresh(); }; // force refresh
        session.emitter.addEventListener('meta', listener);
        return function () { return session.emitter.removeEventListener('meta', listener); };
    }, [path, session]);
    var selections = (_b = (_a = session.meta.selections) === null || _a === void 0 ? void 0 : _a[path]) !== null && _b !== void 0 ? _b : {};
    return selections;
}
exports.default = useSelections;
//# sourceMappingURL=useSelections.js.map