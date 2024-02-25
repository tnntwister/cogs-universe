import { MODULE_ID } from "./main.js";

export const registerSettings = function () {
    game.settings.register(MODULE_ID, "first-run-journal-shown", {
        name: game.i18n.localize("SETTINGS.world.first_journal.name"),
        hint: game.i18n.localize("SETTINGS.world.first_journal.hint"),
        scope: "system",
        config: true,
        type: Boolean,
        default: false
    });

}  