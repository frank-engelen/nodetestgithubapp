"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var fs = __importStar(require("fs"));
var octokit_1 = require("octokit");
var app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Get private key (temporary from file)
var privateKeyPath = '/Users/frank/projects/codeint/githubapp/ruby/meinegithubapp1.2021-09-14.private-key.pem'; // TODO: Put into environment
var privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
app.get('/', function (req, res) {
    handleWebHook(req, res);
});
app.post('/', function (req, res) {
    handleWebHook(req, res);
});
app.listen(3000, function () {
    console.log('The application is listening on port 3000!');
});
function handleWebHook(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var webHookRequest, installationId, appId, app, slug, octokit;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Request received');
                    res.status(200).send('OK!');
                    // After the 'res.send' above the request is already finished. The caller (browser, github) can
                    // terminate the network connection! We can do "async" processing after this line.
                    console.log('Response send ');
                    webHookRequest = req.body;
                    installationId = (_a = webHookRequest === null || webHookRequest === void 0 ? void 0 : webHookRequest.installation) === null || _a === void 0 ? void 0 : _a.id;
                    console.log("Installation-Id " + installationId);
                    if (webHookRequest.action != "created" || webHookRequest.starred_at == undefined) {
                        console.log(webHookRequest.action + " / " + webHookRequest.starred_at);
                        return [2 /*return*/];
                    }
                    appId = 138103 // TODO: Put into environment
                    ;
                    app = new octokit_1.App({ appId: appId, privateKey: privateKey });
                    return [4 /*yield*/, app.octokit.rest.apps.getAuthenticated()];
                case 1:
                    slug = (_b.sent()).data;
                    return [4 /*yield*/, app.getInstallationOctokit(installationId)];
                case 2:
                    octokit = _b.sent();
                    return [4 /*yield*/, octokit.rest.issues.create({
                            owner: "frank-engelen",
                            repo: "propertypath",
                            title: "New Version Issue " + Date.now(),
                        })];
                case 3:
                    _b.sent();
                    console.log("done!");
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=index.js.map