const axios = require("axios");
const fs = require("fs");
let urls = require("./../../includes/datajson/vdgai.json");

class Command {
  constructor(config) {
    this.config = config;
    global.krystal = [];
  }

  async onLoad({ api }) {
    let busy = false;
    if (!global.client.xxll) {
      global.client.xxll = setInterval(async () => {
        if (busy === true || global.krystal.length >= 20) return;
        busy = true;
        try {
          const results = await Promise.all(
            [...Array(5)].map(() =>
              fetchAndUpload(urls[Math.floor(Math.random() * urls.length)])
            )
          );
          global.krystal.push(...results);
        } finally {
          busy = false;
        }
      }, 5000);

      async function downloadFile(url, ext) {
        return axios
          .get(url, { responseType: "arraybuffer" })
          .then((res) => {
            const filePath = __dirname + "/cache/" + Date.now() + "." + ext;
            fs.writeFileSync(filePath, res.data);
            setTimeout((f) => fs.unlinkSync(f), 60000, filePath);
            return fs.createReadStream(filePath);
          });
      }

      async function fetchAndUpload(url) {
        return api
          .httpPostFormData("https://upload.facebook.com/ajax/mercury/upload.php", {
            upload_1024: await downloadFile(url, "mp4"),
          })
          .then((res) => {
            const json = JSON.parse(res.replace("for (;;);", ""));
            return Object.entries(json.payload?.metadata?.[0] || {})[0][0];
          });
      }
    }
  }

  async run({ api, event }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    api.sendMessage(
      {
        body: `≿━━━━༺❀༻━━━━≾  

𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲 ⏰: ${hours}:${minutes}:${seconds}  

≿━━━━༺❀༻━━━━≾`,
        attachment: global.krystal.splice(0, 1),
      },
      event.threadID,
      event.messageID
    );
  }
}

module.exports = new Command({
  name: "xxll",
  version: "0.0.1",
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Utility command that fetches and uploads random videos",
  commandCategory: "Utility",
  usages: "[]",
  cooldowns: 0,
});