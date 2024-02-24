import { MODULE_ID } from "./main.js";

export const registerSettings = function () {
    game.settings.register(MODULE_ID, "game-mode", {
        name: game.i18n.localize("SETTINGS.world.game_mode.name"),
        hint: game.i18n.localize("SETTINGS.world.game_mode.hint"),
        scope: "system",
        config: true,
        type: String,
        choices: {
        "1": "Survie",
        "2": "Cauchemar",
        "3": "Apocalypse"
        },
        default: 'e',
        onChange: value => {
        // console.log(value);
        }
    });

    game.settings.register(MODULE_ID, "first-run-tips-shown", {
        name: game.i18n.localize("SETTINGS.world.first_run.name"),
        hint: game.i18n.localize("SETTINGS.world.first_run.hint"),
        scope: "system",
        config: true,
        type: Boolean,
        default: false
    });
}  