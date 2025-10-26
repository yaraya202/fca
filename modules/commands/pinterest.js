module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Search and get random Pinterest images",
    commandCategory: "Search",
    usages: "pinterest <keyword> - <number_of_images>",
    cooldowns: 0,
};

module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const request = require("request");
    const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "tpk.jpeg")) request("https://i.imgur.com/r1DtySa.jpeg").pipe(fs.createWriteStream(dirMaterial + "tpk.jpeg"));
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");

    const keySearch = args.join(" ");
    if (keySearch.includes("-") == false) {
        return api.sendMessage(
            {
                body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧 𝗜𝗠𝗔𝗚𝗘 𝗦𝗘𝗔𝗥𝗖𝗛\n\n➡ Please enter in the format:\n <keyword> - <number_of_images>\n➡ Example: pinterest doraemon - 10\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
                attachment: fs.createReadStream(__dirname + `/noprefix/tpk.jpeg`)
            },
            event.threadID,
            event.messageID
        );
    }

    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
    const numberSearch = keySearch.split("-").pop() || 6;
    const res = await axios.get(`https://api.sumiproject.net/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;

    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
        let path = __dirname + `/cache/${num += 1}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
        imgData.push(fs.createReadStream(path));
    }

    api.sendMessage(
        {
            attachment: imgData,
            body: `≿━━━━༺❀༻━━━━≾\n\n𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧 𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n\n➡ Keyword: ${keySearchs}\n➡ Total Images Found: ${numberSearch} 💗\n\n≿━━━━༺❀༻━━━━≾`
        },
        event.threadID,
        event.messageID
    );

    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
};