import { createLaunchJournal } from "./journals.js";

export const registerHooks = function (moduleId) {
    /**
     * Ready hook loads tables, and override's foundry's entity link functions to provide extension to pseudo entities
     */
    console.log('registering hooks begins');
    Hooks.once("ready", async () => {
        console.info("Cogs universe | Module Initialized.");
      
        createLaunchJournal(moduleId);
    });

    // changement de la pause 
    Hooks.on("renderPause", async function () {
        if ($("#pause").attr("class") !== "paused") return;
        $(".paused img").attr("src", `modules/${moduleId}/assets/images/layout/pause.webp`);
        $(".paused img").css({ "opacity": 1});
        $("#pause.paused figcaption").text("Univers endormi...");
    });

    // Hooks.on('renderChatLog', (log, html, data) => VermineFight.chatListeners(html));
    // Hooks.on('renderChatMessage', (message, html, data) => VermineFight.chatMessageHandler(message, html, data));

    /**
     * Create a macro when dropping an entity on the hotbar
     * Item      - open roll dialog for item
     * Actor     - open actor sheet
     * Journal   - open journal sheet
     */
    Hooks.on("hotbarDrop", async (bar, data, slot) => {
        // console.log(data.type);
        // Create item macro if rollable item - weapon, spell, prayer, trait, or skill

        return false;
    });

    Hooks.on('getSceneControlButtons', (controls) => {
        /*controls.find((c) => c.name === 'token').tools.push({
        name: 'Dice Roller',
        title: game.i18n.localize("VERMINE.RollTool"),
        icon: 'fas fa-dice-d6',
        button: true,
        onClick() {
            VermineRoll.ui();
        }
        });*/
    });

    /* -------------------------------------------- */
    /*  PreCreate Hooks                                */
    /* -------------------------------------------- */

    Hooks.on("preCreateActor", function (actor) {
        console.log('pre create actor', actor.img);
        if (actor.img == "icons/svg/mystery-man.svg") {
            actor.updateSource({"img": `modules/${moduleId}/assets/icons/actors/${actor.type}.webp`});
        }
    });
    
    Hooks.on("preCreateItem", function (item) {
        if (item.img == "icons/svg/item-bag.svg") {
        item.updateSource({"img": `modules/${moduleId}/assets/icons/items/${item.type}.webp`});
        // item.updateSource({"img": `modules/${moduleId}/icons/competence.webp`});
        }
    });
    
    /* -------------------------------------------- */
    /*  Combat Hooks                                */
    /* -------------------------------------------- */

    /*
    Hooks.on("createCombatant", function (combatant) {
    if (game.user.isGM) {
        let actor = combatant.actor;

        console.log('create combatant', actor);
    }
    });*/

    Hooks.on("updateCombat", function () {
        if (game.user.isGM) {
        let combatant = (game.combat.combatant) ? game.combat.combatant.actor : "";
    
        console.log('update combat', game.combat);
    
        /*if (combatant.type == "marker" && combatant.system.settings.general.isCounter == true) {
            let step = (!combatant.system.settings.general.counting) ? -1 : combatant.system.settings.general.counting;
            let newQuantity = combatant.system.pools.quantity.value + step;
            combatant.update({"system.pools.quantity.value": newQuantity});
        }*/
        }
    });

   /* Hooks.on("chatCommandsReady", function (chatCommands) {
        chatCommands.registerCommand(chatCommands.createCommandFromData({
          commandKey: "/dr",
          invokeOnCommand: (chatlog, messageText, chatdata) => {
            Roll.get().parse(messageText);
          },
          shouldDisplayToChat: false,
          iconClass: "fa-dice-d6",
          description: "Roll Vermine 2047 check"
        }));
      });*/
  
    
}
