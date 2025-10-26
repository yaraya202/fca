module.exports.config = {
    name: "convert",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Convert MP4 to MP3",
    commandCategory: "Utility",
    usages: "convert",
    cooldowns: 5
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const axios = require("axios");
    const fs = require("fs-extra");

    let audioss = [];
    let audio = args.join(" ") || event.messageReply.attachments[0].url;

    let { data } = await axios.get(audio, { method: 'GET', responseType: 'arraybuffer' });
    fs.writeFileSync(__dirname + "/cache/vdtoau.m4a", Buffer.from(data, 'utf-8'));
    audioss.push(fs.createReadStream(__dirname + "/cache/vdtoau.m4a"));

    let msg = { 
      body: "✅ 𝐂𝐨𝐧𝐯𝐞𝐫𝐬𝐢𝐨𝐧 𝐌𝐏𝟒 → 𝐌𝐏𝟑 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!", 
      attachment: audioss 
    };

    api.sendMessage(msg, event.threadID, event.messageID);
  } catch (e) {
    console.log(e);
  }
};