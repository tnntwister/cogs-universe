import {initConfig } from "./config.js";
import { registerSettings } from "./settings.js";
import { registerHooks } from './hooks.js';

export const MODULE_ID = "cogs-universe";

Hooks.on("init", () => {
    initConfig();
    registerSettings();
    registerHooks(MODULE_ID);
});