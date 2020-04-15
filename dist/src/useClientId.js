"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Provider_1 = require("./Provider");
/**
 * Provides collaboration client id. This hook assumes presence of
 * clientContext in React elements tree.
 */
function useSelections() {
    var client = react_1.useContext(Provider_1.clientContext);
    var _a = react_1.useReducer(function (x) { return x + 1; }, 0), refresh = _a[1];
    react_1.useEffect(function () {
        var listener = function () { return refresh(); };
        client.emitter.addEventListener('id', listener);
        return function () { return client.emitter.removeEventListener('id', listener); };
    }, [client]);
    return client.id;
}
exports.default = useSelections;
//# sourceMappingURL=useClientId.js.map