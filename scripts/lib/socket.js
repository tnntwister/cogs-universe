import { MODULE_ID } from "../main.js";


let socketRegistered = false;

export class Socket{

    static __$callbacks = {};

    static __$promises = {};

    static USERS = {
        GMS: "gms",
        PLAYERS: "players",
        ALL: "all",
        OTHERS: "others",
        FIRSTGM: "firstGM",
        SELF: "self",
    }

    static __$reserved = [
        "__$eventName",
        "__$response",
        "__$onMessage",
        "__$parseUsers",
        "register",
    ]

    static async __$onMessage(data) {
        const options = data.__$socketOptions;
        if (options.__$eventName === "__$response") {
            const key = options.__$responseKey;
            if (this.__$promises[key]) {
                this.__$promises[key].resolve({user: game.users.get(options.__$userId), response: data.result});
                delete this.__$promises[key];
            }
            return;
        }
        if (!options.users.includes(game.user.id)) return;
        const callback = this.__$callbacks[options.__$eventName];
        delete data.__$socketOptions;
        const result = await callback(data);
        if(options.response) {
            const key = `${options.__$eventId}.${game.user.id}`;
            const data = {__$socketOptions: {__$eventName: "__$response", __$responseKey: key, __$userId: game.user.id}, result};
            this.__$socket.emit(`module.${MODULE_ID}`, data);
        }
    }

    static __$parseUsers(options) {
        if(Array.isArray(options?.users)) return options;
        if(typeof options === "string") options = {users: options};
        options.users = options.users || this.USERS.ALL;
        const active = game.users.filter(u => u.active);
        const users = options.users;
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

    static register(eventName, callback) {

        if (!socketRegistered) {
            this.__$socket = game.socket;
            game.socket.on(`module.${MODULE_ID}`, this.__$onMessage.bind(this));      
            socketRegistered = true;
        }

        if (this.__$reserved.includes(eventName)) {
            throw new Error(`Socket event name ${eventName} is reserved`);
        }

        this.__$callbacks[eventName] = callback;

        const wrappedCallback = async (data, options = {}) => {
            console.log("SOCKET - Sending", data, options);
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

            data.__$socketOptions = options;
            this.__$socket.emit(`module.${MODULE_ID}`, data);

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