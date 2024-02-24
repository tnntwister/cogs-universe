function compact(array) {
    var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index2 < length) {
        var value2 = array[index2];
        if (value2) {
        result[resIndex++] = value2;
        }
    }
    return result;
    }
    class CreateActorDialog extends FormApplication {
        constructor() {
          super({});
        }
        async _updateObject() {
        }
        static get defaultOptions() {
          return mergeObject(super.defaultOptions, {
            title: game.i18n.format("DOCUMENT.Create", {
              type: game.i18n.localize("DOCUMENT.Actor")
            }),
            template: "systems/cogs-universe/templates/actor/create.hbs",
            id: "new-actor-dialog",
            resizable: false,
            classes: ["cogs-universe", "sheet", "new-actor"],
            width: 650,
            height: 200
          });
        }
        getData(_options) {
          return {
            // sfenabled: IronswornSettings.starforgedToolsEnabled
          };
        }
        activateListeners(html) {
          super.activateListeners(html);
          html.find(".vermine__character__create").on("click", async (ev) => {
            await this._characterCreate.call(this, ev);
          });
          html.find(".vermine__shared__create").on("click", async (ev) => {
            await this._sharedCreate.call(this, ev);
          });
          html.find(".vermine__site__create").on("click", async (ev) => {
            await this._siteCreate.call(this, ev);
          });
          html.find(".vermine__foe__create").on("click", async (ev) => {
            await this._foeCreate.call(this, ev);
          });
        }
    }
    class VermineTour extends Tour {
        /** @override */
        async _preStep() {
            var _a2, _b, _c, _d, _e;
            await super._preStep();
            if ((_a2 = this.currentStep) == null ? void 0 : _a2.sidebarTab) {
            await ((_b = ui.sidebar) == null ? void 0 : _b.activateTab(this.currentStep.sidebarTab));
            }
            if ((_c = this.currentStep) == null ? void 0 : _c.layer) {
            const layer = canvas == null ? void 0 : canvas[this.currentStep.layer];
            if (layer.active && this.currentStep.tool)
                (_d = ui.controls) == null ? void 0 : _d.initialize({ tool: this.currentStep.tool });
            else
                layer.activate({ tool: this.currentStep.tool });
            }
            if (((_e = this.currentStep) == null ? void 0 : _e.hook) != null) {
            await this.currentStep.hook();
            }
        }
    }
    
    class WelcomeTour extends VermineTour {
        constructor() {
          super({
            title: "TOURS.Welcome.Title",
            description: "TOURS.Welcome.Description",
            canBeResumed: false,
            display: true,
            steps: []
          });
        }
        get steps() {
          var _a2;
          return compact([
            {
              id: "welcome",
              title: "TOURS.Welcome.WelcomeTitle",
              content: "TOURS.Welcome.WelcomeContent"
            },
            {
              id: "character-tab",
              title: "TOURS.Welcome.ActorTabTitle",
              content: "TOURS.Welcome.ActorTabContent",
              sidebarTab: "actors",
              selector: "#actors .create-document"
            },
            {
              id: "character-create",
              title: "TOURS.Welcome.CharacterCreateTitle",
              content: "TOURS.Welcome.CharacterCreateContent",
              hook: async () => {
                this.createActorDialog = new CreateActorDialog();
                await this.createActorDialog.render(true);
                await new Promise((r) => setTimeout(r, 100));
              },
              selector: "#new-actor-dialog #new-group"
            },
            /*{
              id: "compendia",
              title: "TOURS.Welcome.CompendiumTitle",
              content: "TOURS.Welcome.CompendiumContent",
              hook: async () => {
                var _a3;
                return await ((_a3 = this.createActorDialog) == null ? void 0 : _a3.close());
              },
              sidebarTab: "compendium",
              selector: 'li[data-pack="cogs-universe.verminescenes"]'
            },*/
            /*((_a2 = game.user) == null ? void 0 : _a2.viewedScene) && {
              id: "oracletool",
              title: "TOURS.Welcome.OracleToolTitle",
              content: "TOURS.Welcome.OracleToolContent",
              layer: "tokens",
              selector: '[data-tool="Oracles"]'
            },*/
            {
              id: "tours",
              title: "TOURS.Welcome.ToursTitle",
              content: "TOURS.Welcome.ToursContent",
              hook: async () => {
                var _a3;
                return await ((_a3 = this.createActorDialog) == null ? void 0 : _a3.close());
              },
              sidebarTab: "settings",
              selector: 'button[data-action="tours"]'
            }
          ]);
        }
      }
      export async function registerTours() {
        game.tours.register("cogs-universe", "welcome", new WelcomeTour());
        $(document).on("click", "#chat-log #vermine-tour-chat-button", (el) => {
          const tour = game.tours.get("cogs-universe.welcome");
          tour == null ? void 0 : tour.start();
        });
        if (game.settings.get("cogs-universe", "first-run-tips-shown"))
            return;
        console.log("Posting first-start messages...");
        const gms = ChatMessage.getWhisperRecipients("GM");
        ChatMessage.implementation;
        ChatMessage.create({
          whisper: gms,
          speaker: { alias: game.i18n.localize("VERMINE.name") },
          content: game.i18n.localize("TOURS.ChatMessage")
        });
        game.settings.set("cogs-universe", "first-run-tips-shown", true);
      }