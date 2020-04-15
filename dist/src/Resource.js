"use strict";
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
var sundae_collab_client_1 = require("sundae-collab-client");
var Provider_1 = require("./Provider");
var log_1 = __importDefault(require("./utils/log"));
/**
 * Context with session instance from sundae-collab-client.
 */
exports.sessionContext = react_1.default.createContext(null);
/**
 * Injects session to the React context. Takes resource data and initial value
 * to start/join a collaboration session.
 */
function Resource(_a) {
    var id = _a.id, type = _a.type, value = _a.value, children = _a.children, fallback = _a.fallback;
    var client = react_1.useContext(Provider_1.clientContext);
    var _b = react_1.useState(null), session = _b[0], setSession = _b[1];
    react_1.useEffect(function () {
        var localSession = null;
        if (client) {
            sundae_collab_client_1.initSession(client, type, id, value)
                .then(function (s) {
                localSession = s;
                setSession(s);
            })
                .catch(function (err) { return log_1.default.error('Can not open session', err); });
        }
        else {
            setSession(null);
        }
        return function () {
            if (localSession) {
                localSession.stop();
            }
        };
    }, [client, type, id, value]);
    if (!session) {
        return fallback !== undefined ? fallback : react_1.default.createElement("span", null, "waiting for session");
    }
    return (react_1.default.createElement(exports.sessionContext.Provider, { value: session }, children));
}
exports.default = Resource;
//# sourceMappingURL=Resource.js.map