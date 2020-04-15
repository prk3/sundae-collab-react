"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Resource_1 = require("./Resource");
/**
 * Provides session participants list. This hook assumes presence of
 * sessionContext in React elements tree.
 */
function useParticipants() {
    var session = react_1.useContext(Resource_1.sessionContext);
    var _a = react_1.useReducer(function (x) { return x + 1; }, 0), refresh = _a[1];
    react_1.useEffect(function () {
        var listener = function () { return refresh(); };
        session.emitter.addEventListener('participants', listener);
        return function () { return session.emitter.removeEventListener('participants', listener); };
    }, [session]);
    return session.participants;
}
exports.default = useParticipants;
//# sourceMappingURL=useParticipants.js.map