exports.config = {
    name: 'wordchain',
    version: '1.1.1',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Word Chain Game!',
    commandCategory: 'Games',
    usages: 'wordchain + amount > 10000 VND',
    cooldowns: 3
};

let fs = require('fs');
let path = __dirname+'/Game/noitu/noitu.txt';
let data = [];
let stream_url= async url=>await require('axios').get(url, {
    responseType: 'stream'
}).then(res=>res.data);
let save = ()=>fs.writeFileSync(path, data.join(','), 'utf8');
let word_valid = word=>/^[a-zA-Zà-ỹÀ-Ỹ]+ [a-zA-Zà-ỹÀ-Ỹ]+$/.test(word);

exports.onLoad = async function() {
    if (!fs.existsSync(path)) {
        data = (await require('axios').get(`https://raw.githubusercontent.com/J-JRT/api2/mainV2/linkword.json`)).data.split(',').filter(word_valid);
    } else data = fs.readFileSync(path, 'utf8').split(',').filter(word_valid);
    save();
};

exports.handleReply = async function(o) {
    let _ = o.handleReply;
    if (o.event.senderID != _.event.senderID)return;

    let word = (o.event.body || '').split(' ');
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, callback == 0?undefined: o.event.messageID);

    if (!word_valid(word.join(' ')))return send(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n[⚜️] ➜ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐰𝐨𝐫𝐝 𝐭𝐨 𝐜𝐡𝐚𝐢𝐧!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`); 
    o.api.unsendMessage(_.messageID);

    if (_.type == 'player_vs_bot') {
        if (word[0].toLowerCase() != _.word_bot.split(' ')[1].toLowerCase()) {
            let image_all = [  
              "https://i.imgur.com/ct7CqS5.jpeg",
              "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
              "https://thietbimaycongnghiep.net/wp-content/uploads/2021/07/choi-noi-tu-online.jpg",
              "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
            ];
            let image_random = image_all[Math.random()*image_all.length<<0];
            send({
                body: `≿━━━━༺❀༻━━━━≾\n\n❎ ➜ 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭!\n❗ ➜ 𝐖𝐨𝐫𝐝𝐬 𝐜𝐡𝐚𝐢𝐧𝐞𝐝: ${_.loop}\n💸 ➜ 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭: ${_.bet} VND\n\n≿━━━━༺❀༻━━━━≾`,
                attachment: await stream_url(image_random)
            }, 0);

            send(`⚝──⭒─⭑─⭒──⚝\n\n👎 ➜ 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐬, 𝐲𝐨𝐮 𝐥𝐨𝐬𝐭!\n\n⚝──⭒─⭑─⭒──⚝`);
            o.Currencies.decreaseMoney(o.event.senderID, _.bet);
            return;
        };
        let word_matching = data.filter($=>$.split(' ')[0].toLowerCase() == word[1].toLowerCase());
        let random_word_ = word_matching[Math.random()*word_matching.length<<0];

        if (!word_valid(random_word_)) {
            if (!data.includes(word.join(' '))) {
                data.push(word.join(' '));
                save();
            };
            o.Currencies.increaseMoney(o.event.senderID, _.bet*3);

            let image_all = [
                "https://i.imgur.com/ct7CqS5.jpeg",
                "https://cdnmedia.webthethao.vn/thumb/720-405/uploads/2021-02-11/noi-tu.jpg",
                "https://thietbimaycongnghiep.net/wp-content/uploads/2021/07/choi-noi-tu-online.jpg",
                "https://i.ytimg.com/vi/eqURQBpbJ1A/maxresdefault.jpg"
            ];
            let image_random = image_all[Math.random()*image_all.length<<0];
            send({
                body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✅ ➜ 𝐘𝐨𝐮 𝐰𝐨𝐧!\n❗ ➜ 𝐖𝐨𝐫𝐝𝐬 𝐜𝐡𝐚𝐢𝐧𝐞𝐝: ${_.loop}\n💵 ➜ 𝐑𝐞𝐰𝐚𝐫𝐝: ${_.bet*3} VND\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
                attachment: [await stream_url(image_random)]
            });
            send(`≿━━━━༺❀༻━━━━≾\n\n👏 ➜ 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐬, 𝐲𝐨𝐮 𝐝𝐞𝐟𝐞𝐚𝐭𝐞𝐝 𝐭𝐡𝐞 𝐛𝐨𝐭!\n\n≿━━━━༺❀༻━━━━≾`);
        }else send(`⚝──⭒─⭑─⭒──⚝\n\n📝 ➜ 𝐁𝐨𝐭 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞𝐬: ${random_word_}\n💬 ➜ 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐛𝐨𝐭 𝐭𝐨 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞\n❗ ➜ 𝐓𝐨𝐭𝐚𝐥 𝐜𝐡𝐚𝐢𝐧𝐬: ${_.loop+1}\n\n⚝──⭒─⭑─⭒──⚝`, 
            (err, res)=>(res.type = 'player_vs_bot', res.name = exports.config.name, res.event = o.event, res.word_bot = random_word_, res.loop = _.loop+1, res.bet = _.bet, client.handleReply.push(res)));
    };
};

exports.run = async function(o) {
    let send = (msg, callback)=>o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);
    let bet = +o.args[0] || 0;
    let word_bot = data[Math.random()*data.length<<0];

    if (o.args[0] == 'bot')return send(`༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚜️ ➜ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲, 𝐛𝐨𝐭 𝐡𝐚𝐬: ${data.length} 𝐰𝐨𝐫𝐝𝐬 𝐟𝐨𝐫 𝐜𝐡𝐚𝐢𝐧𝐢𝐧𝐠!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`);
    if (bet < 10000 || bet > (await o.Currencies.getData(o.event.senderID)).money)return send(`≿━━━━༺❀༻━━━━≾\n\n⚜️ ➜ 𝐘𝐨𝐮 𝐦𝐮𝐬𝐭 𝐛𝐞𝐭 𝐦𝐨𝐧𝐞𝐲 𝐭𝐨 𝐩𝐥𝐚𝐲!\n💵 ➜ 𝐌𝐢𝐧𝐢𝐦𝐮𝐦 𝐛𝐞𝐭: 10000 VND\n💬 ➜ 𝐔𝐬𝐞: wordchain + [𝐚𝐦𝐨𝐮𝐧𝐭]\n\n≿━━━━༺❀༻━━━━≾`);

    let image_all = [
        "https://i.imgur.com/ct7CqS5.jpeg"
    ];
    let image_random = image_all[Math.random()*image_all.length<<0];
    send({
        body: `⚝──⭒─⭑─⭒──⚝\n\n💵 ➜ 𝐁𝐞𝐭 𝐀𝐦𝐨𝐮𝐧𝐭: ${bet} VND\n📝 ➜ 𝐁𝐨𝐭 𝐬𝐭𝐚𝐫𝐭𝐬 𝐰𝐢𝐭𝐡: ${word_bot}\n💬 ➜ 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐜𝐨𝐧𝐭𝐢𝐧𝐮𝐞\n❗ ➜ 𝐂𝐡𝐚𝐢𝐧 𝐜𝐨𝐮𝐧𝐭: 0\n\n⚝──⭒─⭑─⭒──⚝`,
        attachment: await stream_url(image_random)
    },
        (err, res)=>(res.type = 'player_vs_bot', res.name = exports.config.name, res.event = o.event, res.word_bot = word_bot, res.loop = 0, res.bet = bet, client.handleReply.push(res)));
};