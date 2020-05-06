"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var sundae_collab_client_1 = require("sundae-collab-client");
/**
 * Context with the client class from sundae-collab-client.
 */
exports.clientContext = react_1.default.createContext(null);
/**
 * Injects collaboration client to the React context. Takes collaboration
 * server url and user identity to establish web socket connection and
 * authenticate the client.
 */
function Provider(_a) {
    var url = _a.url, identity = _a.identity, children = _a.children;
    var _b = react_1.useState(null), client = _b[0], setClient = _b[1];
    react_1.useEffect(function () {
        var socket = new WebSocket(url + "/");
        var localClient = new sundae_collab_client_1.Client(socket, identity);
        setClient(localClient);
        return function () { return localClient.stop(); };
    }, [identity, url]);
    return (react_1.default.createElement(exports.clientContext.Provider, { value: client }, children));
}
exports.default = Provider;
//# sourceMappingURL=Provider.js.map