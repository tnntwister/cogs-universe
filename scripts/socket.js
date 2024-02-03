import {MODULE_ID} from "../main.js";

export let socket = null;

export function initSocket() {
    socket = new SocketInterface();
    return socket;
}

class SocketInterface{
    constructor () {
        game.socket.on(`module.${MODULE_ID}`, this.__$onMessage);      
        this.__$callbacks = {};
        this.__$socket = game.socket;
        this.__$promises = {};
        this.USERS = {
            GMS: "gms",
            PLAYERS: "players",
            ALL: "all",
            OTHERS: "others",
            FIRSTGM: "firstGM",
            SELF: "self",
        };
        this.__$reserved = [
            "__$eventName",
            "__$response",
            "__$onMessage",
            "__$parseUsers",
            "register",
        ]
    }

    async __$onMessage(data, options) {
        if (options.__$eventName === "__$response") {
            const key = options.__$responseKey;
            if (this.__$promises[key]) {
                this.__$promises[key].resolve({user: options.user, response: data});
                delete this.__$promises[key];
            }
            return;
        }
        if (!options.users.includes(game.user.id)) return;
        const callback = this.__$callbacks[options.__$eventName];
        const result = await callback(data);
        if(options.response) {
            const key = `${options.__$eventId}.${game.user.id}`;
            this.__$socket.emit(`module.${MODULE_ID}`, result, {__$eventName: "__$response", __$responseKey: key, user: game.user.id});
        }
    }

    __$parseUsers(options) {
        if(typeof options === "string") options = {users: options};
        options.users = options.users || this.USERS.ALL;
        const active = game.users.filter(u => u.active);
        if (users === this.USERS.ALL) {
            options.users = active.map(u => u.id);
        } else if (users === this.USERS.GMS) {
            options.users = active.filter(u => u.isGM).map(u => u.id);
        } else if (users === this.USERS.PLAYERS) {
            options.users = active.filter(u => !u.isGM).map(u => u.id);
        } else if (users === this.USERS.OTHERS) {
            options.users = active.filter(u => u.id !== game.user.id).map(u => u.id);
        } else if (users === this.USERS.FIRSTGM) {
            options.users = active.find(u => u.isGM).map(u => u.id);
        } else if (users === this.USERS.SELF) {
            options.users = [game.user.id];
        }
        return options;
    }

    register(eventName, callback) {

        if (this.__$reserved.includes(eventName)) {
            throw new Error(`Socket event name ${eventName} is reserved`);
        }

        this.__$callbacks[eventName] = callback;

        const wrappedCallback = async (data, options = {}) => {
            options = this.__$parseUsers(options);
            const eventId = randomID();
            options.__$eventId = eventId;
            options.__$eventName = eventName;
            const promises = [];
            const local = options.users.includes(game.user.id);
            options.users = options.users.filter(u => u !== game.user.id);
            if (options.response) {
                for (const user of options.users) {
                    promises.push(new Promise((resolve, reject) => {
                        const key = `${eventId}.${user}`;
                        this.__$promises[key] = {resolve, reject};
                    }));
                }

                setTimeout(() => {
                        for (const user of options.users) {
                            const key = `${eventId}.${user}`;
                            if (this.__$promises[key]) {
                                this.__$promises[key].reject('timeout');
                                delete this.__$promises[key];
                            }
                        }
                }, options.timeout || 30000);

            }

            this.__$socket.emit(`module.${MODULE_ID}`, data, options);

            const results = [];

            if (options.response) {
                const allPromises = await Promise.all(promises);
                for (const promise of allPromises) {
                    results.push(promise);
                }
            }
            if (local) {
                results.push({user: game.user.id, response: await callback(data)});
            }

            return results;
        };

        this[eventName] = wrappedCallback.bind(this);
    }
            
            
}