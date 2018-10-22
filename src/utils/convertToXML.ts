import * as convert from 'xml-js';
import {Element} from "xml-js";
import * as fs from 'fs';

export const convertToXML = (json: Element): string => {
    return convert.js2xml(json, {ignoreComment: true, spaces: 4});
};

export const exportXMLToFile = (path: string, xml: string) => {
    fs.writeFileSync(path, xml);
};