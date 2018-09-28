"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
exports.__esModule = true;
var filterXML_1 = require("../filterXML");
var recursiveSearch_1 = require("../recursiveSearch");
var convertToXML_1 = require("../convertToXML");
describe('filterXML', function () {
    it('should return json', function () {
        var filtered = filterXML_1.filterXML(__dirname + "/home.xml", function (slot) {
            return false;
        });
        expect(filtered.elements[0].elements).toHaveLength(0);
        expect(filtered).toMatchSnapshot();
    });
    it('should filter results based upon callback', function () {
        var filtered = filterXML_1.filterXML(__dirname + "/home.xml", function (slot) {
            return slot.attributes['slot-id'] === 'slot-15';
        });
        expect(filtered.elements[0].elements.length).toBe(15);
        expect(filtered).toMatchSnapshot();
    });
});
describe('recursiveSearch', function () {
    it('should find key in object', function () {
        var testObject = { batman: 'batman' };
        expect(recursiveSearch_1.recursiveSearch(testObject, 'batman', 'batman')).toBe(true);
    });
    it('should find and object nested inside of an object', function () {
        var testObject = { batman: { robin: 'robin' } };
        expect(recursiveSearch_1.recursiveSearch(testObject, 'robin', 'robin')).toBe(true);
    });
    it('should object nested in array', function () {
        var testObject = {
            batman: {
                robin: [{ '$': { joker: 'joker' } }],
                soup: 'warm'
            }
        };
        expect(recursiveSearch_1.recursiveSearch(testObject, 'soup', 'warm')).toBe(true);
        expect(recursiveSearch_1.recursiveSearch(testObject, 'joker', 'joker')).toBe(true);
    });
});
describe('integration of filterXML with recursiveSearch', function () {
    it('should return correct slots', function () { return __awaiter(_this, void 0, void 0, function () {
        var filtered;
        return __generator(this, function (_a) {
            filtered = filterXML_1.filterXML(__dirname + "/home.xml", function (slot) { return recursiveSearch_1.recursiveSearch(slot, 'slot-id', 'slot-15'); });
            expect(filtered.elements[0].elements).toHaveLength(15);
            expect(filtered).toMatchSnapshot();
            return [2 /*return*/];
        });
    }); });
});
describe('convertToXML', function () {
    it('should be xml', function () {
        var filtered = filterXML_1.filterXML(__dirname + "/home.xml", function (slot) { return recursiveSearch_1.recursiveSearch(slot, 'slot-id', 'slot-15'); });
        expect(convertToXML_1.convertToXML(filtered)).toMatchSnapshot();
    });
});
describe('exportXMLtoFIle', function () {
    var fs = require('fs');
    it('should export xml to file', function () {
        var testPath = __dirname + "/slots.xml";
        var testString = 'this is a test';
        convertToXML_1.exportXMLToFile(testPath, testString);
        var file = fs.readFileSync(__dirname + "/slots.xml", 'utf-8');
        expect(file).toBe(testString);
        fs.unlinkSync(testPath);
    });
});
