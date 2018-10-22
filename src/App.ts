import * as fs from 'fs';
import {ConfigInterface, KeyPair} from './interfaces/Config';
import {createConfig} from './utils/configFactory';
import {filterXML} from './utils/filterXML';
import {isSlotAlive} from "./utils/isSlotLive";
import {recursiveSearch} from "./utils/recursiveSearch";
import {FilteredPayload, Slot} from "./interfaces/Slot";
import {curriedCheckForContentId} from "./utils/checkContentAssetForSiteSpecific";

const jsonfile = require('jsonfile');

interface AppState {
    config: ConfigInterface;
    filteredPayload: FilteredPayload
}

export class App {
    private readonly state: AppState;

    constructor (config: ConfigInterface) {
        this.state = {
            config,
            filteredPayload: ({} as FilteredPayload)
        };
    }

    public get config (): ConfigInterface {
        return this.state.config;
    }

    private static checkForConfig = (path: string): boolean  => {
        return fs.existsSync(path);
    };

    public static getConfig = async (path: string): Promise<ConfigInterface|void>  => {
        try {
            if (App.checkForConfig(path)) {
                return await jsonfile.readFile(path);
            } else {
                throw new Error('cant find config exists please change the name or call createConfigTemplate');
            }
        } catch (error) {
            throw error;
        }
    };

    public static createConfigTemplate = async (template: ConfigInterface, name: string): Promise<void> => {
        try {
            await createConfig(template, name);
        } catch (err) {
            console.error(err);
            throw new Error('could not create config template');
        }
    };

    public checkSlotForValues = (slot: Slot, values: KeyPair[]): boolean => {
        for (const check of values) {
            if (slot[check.key] === check.value) {
                return true;
            }
        }
        return false;
    };

    private configHasKeys = (values: KeyPair[]): boolean => {
       return values.length > 0;
    };

    public filterXML = (config: ConfigInterface = this.state.config): FilteredPayload => {
        // function uses partial application to store value in clojure
        const siteSpecificCheck = curriedCheckForContentId(config.siteSpecificKey);

        this.state.filteredPayload = filterXML(config.inputPath, (slot): boolean => {
            // by default we should keep the slot
            let remove = false;
            let siteSpecific = false;
            let keep = false;
            // if keep alive and its false return false
            if (config.keepAlive && !isSlotAlive(slot)) {
                return false;
            }

            recursiveSearch(slot, (slot) => {
                if (config.siteSpecificKey.length > 0 && siteSpecificCheck(slot)) {
                    siteSpecific = true;
                    return true;
                }

                if (this.configHasKeys(config.toRemove)) {
                    if (this.checkSlotForValues(slot, config.toRemove)) {
                        remove = true;
                        return true;
                    }
                }

                if (this.configHasKeys(config.toKeep)) {
                    if (this.checkSlotForValues(slot, config.toKeep)) {
                        keep = true;
                        return true;
                    }
                } else {
                    // if no values then keep is true by default but we dont want to return
                    // but this overrides all the other configs so we need specific varialbes for the checks
                    keep = true;
                }

                return false;
            });

            if (siteSpecific) {
                return false;
            }

            if (remove) {
                return false;
            }

            return keep;
        });

        return this.state.filteredPayload;
    };
}