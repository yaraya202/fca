const axios = require("axios");

module.exports.config = {
    name: "banchanle",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "**Kashif Raza**",
    description: "Play an Even-Odd betting game",
    commandCategory: "Games",
    usages: "[create/join/start/end]",
    cooldowns: 5
};

module.exports.run = async function({
    api: e,
    event: n,
    Currencies: a,
    Threads: s,
    Users: t,
    args: r
}) {
    try {
        global.chanle || (global.chanle = new Map);
        const {
            threadID: s,
            messageID: o,
            senderID: i
        } = n;
        var g = global.chanle.get(s);
        const c = (await axios.get("https://i.imgur.com/LClPl36.jpg", {
            responseType: "stream"
        })).data;
        switch (r[0]) {
            case "create":
            case "new":
            case "-c": {
                if (!r[1] || isNaN(r[1])) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You need to enter the bet amount!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                if (parseInt(r[1]) < 50) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**The bet amount must be greater than or equal to 50!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                const g = await a.getData(n.senderID);
                if (g.money < parseInt(r[1])) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You don’t have enough ${r[1]} to create a new game table!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                if (global.chanle.has(s)) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**This group already has an active game table!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                var h = await t.getNameUser(i);
                return global.chanle.set(s, {
                    box: s,
                    start: !1,
                    author: i,
                    player: [{
                        name: h,
                        userID: i,
                        choose: {
                            status: !1,
                            msg: null
                        }
                    }],
                    money: parseInt(r[1])
                }), e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**Successfully created an Even-Odd game room with a bet of ${r[1]} by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, s);
            }
            case "join":
            case "-j": {
                if (!global.chanle.has(s)) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**This group currently has no game table!\n=> Please create a new game table to join!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                if (1 == g.start) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**This game table has already started!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                const r = await a.getData(n.senderID);
                if (r.money < g.money) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You don’t have enough $ to join this game table! ${g.money}$**\n≿━━━━༺❀༻━━━━≾`, s, o);
                if (g.player.find((e => e.userID == i))) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You have already joined this game table!**\n≿━━━━༺❀༻━━━━≾`, s, o);
                h = await t.getNameUser(i);
                return g.player.push({
                    name: h,
                    userID: i,
                    choose: {
                        stats: !1,
                        msg: null
                    }
                }), global.chanle.set(s, g), e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You have joined the game table!\n=> Current number of players: ${g.player.length} by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, s, o);
            }
            case "start":
            case "-s":
                return g ? g.author != i ? e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You are not the creator of this game table, so you cannot start the game!**\n≿━━━━༺❀༻━━━━≾`, s, o) : g.player.length <= 1 ? e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**Your game table doesn’t have enough players to start!**\n≿━━━━༺❀༻━━━━≾`, s, o) : 1 == g.start ? e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**This game table has already started!**\n≿━━━━༺❀༻━━━━≾`, s, o) : (g.start = !0, global.chanle.set(s, g), e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**Game started\n\nNumber of players: ${g.player.length}\n\nPlease type "Even" or "Odd" by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, s)) : e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**This group currently has no game table!\n=> Please create a new game table to join!**\n≿━━━━༺❀༻━━━━≾`, s, o);
            case "end":
            case "-e":
                return g ? g.author != i ? e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You are not the creator of this game table, so you cannot delete it!**\n≿━━━━༺❀༻━━━━≾`, s, o) : (global.chanle.delete(s), e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**Game table deleted by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, s, o)) : e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**This group currently has no game table!\n=> Please create a new game table to join!**\n≿━━━━༺❀༻━━━━≾`, s, o);
            default:
                return e.sendMessage({
                    body: `≿━━━━༺❀༻━━━━≾\n**Play Multiplayer Even-Odd Game\n1. =>banchanle -c/create <price> to create a room\n2. =>banchanle join to join a room\n3. =>banchanle start to start the game\n4. =>banchanle end to delete the room by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`,
                    attachment: c
                }, s, o);
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports.handleEvent = async function({
    api: e,
    event: n,
    Currencies: a
}) {
    const {
        threadID: s,
        messageID: t,
        body: r,
        senderID: g
    } = n, h = ["even", "odd"], o = ((await a.getData(n.senderID)).money, h[Math.floor(Math.random() * h.length)]);
    if (r && ("even" == r.toLowerCase() || "odd" == r.toLowerCase())) {
        const n = global.chanle.get(s) || {};
        if (!n) return;
        if (1 != n.start) return;
        if (!n.player.find((e => e.userID == g))) return;
        var i, c = n.player.findIndex((e => e.userID == g));
        if (1 == (i = n.player[c]).choose.status) return e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**You have already chosen and cannot choose again!**\n≿━━━━༺❀༻━━━━≾`, s, t);
        "even" == r.toLowerCase() ? (n.player.splice(c, 1), n.player.push({
            name: i.name,
            userID: g,
            choose: {
                status: !0,
                msg: "even"
            }
        }), e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**${i.name} has chosen Even by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, s, t)) : (n.player.splice(c, 1), n.player.push({
            name: i.name,
            userID: g,
            choose: {
                status: !0,
                msg: "odd"
            }
        }), e.sendMessage(`≿━━━━༺❀༻━━━━≾\n**${i.name} has chosen Odd by **Kashif Raza****\n≿━━━━༺❀༻━━━━≾`, s, t));
        var m = 0,
            u = n.player.length;
        for (var l of n.player) 1 == l.choose.status && m++;
        if (m != u) return;
        const r = (await axios.get("https://i.imgur.com/P3UEpfF.gif", {
            responseType: "stream"
        })).data;
        e.sendMessage({
            body: `≿━━━━༺❀༻━━━━≾\n**Checking results...**\n≿━━━━༺❀༻━━━━≾`,
            attachment: r
        }, s, ((r, g) => {
            if (r) return e.sendMessage(r, s, t);
            setTimeout((async function() {
                e.unsendMessage(g.messageID);
                var t = o,
                    r = [],
                    h = [];
                var i = images();
                if (0 == t.indexOf("even"))
                    for (var c of n.player) "even" == c.choose.msg ? r.push({
                        name: c.name,
                        userID: c.userID
                    }) : h.push({
                        name: c.name,
                        userID: c.userID
                    });
                else
                    for (var c of n.player) "odd" == c.choose.msg ? r.push({
                        name: c.name,
                        userID: c.userID
                    }) : h.push({
                        name: c.name,
                        userID: c.userID
                    });
                const m = (await axios.get(i[Math.floor(5 * Math.random())], {
                    responseType: "stream"
                })).data;
                var u = `**RESULT: ${t.toUpperCase()}\n\nWinners:\n**`,
                    l = 0,
                    p = 0;
                for (var d of r) {
                    await a.getData(d.userID);
                    await a.increaseMoney(d.userID, n.money), u += ++l + ". " + d.name + "\n";
                }
                for (var y of h) {
                    await a.getData(y.userID);
                    await a.decreaseMoney(y.userID, n.money), 0 == p && (u += "**Losers:\n**"), u += ++p + ". " + y.name + "\n";
                }
                u += `**Winners + ${n.money} PKR**\n`;
                u += `**Losers - ${n.money} PKR**`;
                global.chanle.delete(s);
                return e.sendMessage({
                    body: `≿━━━━༺❀༻━━━━≾\n${u} by **Kashif Raza**\n≿━━━━༺❀༻━━━━≾`,
                    attachment: m
                }, s);

                function images() {
                    if ("even" == t)
                        var i = [
                            "https://i.imgur.com/6fIJU1q.jpg", "https://i.imgur.com/XPg6Uvq.jpg", "https://i.imgur.com/IWjB9kN.jpg", "https://i.imgur.com/XVxgPhY.png", "https://i.imgur.com/dRzktqf.png"
                        ];
                    else if ("odd" == t)
                        i = ["https://i.imgur.com/u1DjwX0.png", "https://i.imgur.com/unnBcv9.png", "https://i.imgur.com/181R8Te.jpg", "https://i.imgur.com/y67IGtv.jpg", "https://i.imgur.com/y67IGtv.jpg"];
                    return i;
                }
            }), 5000);
        }));
    }
};