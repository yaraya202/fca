const axios = require("axios");

// Polyfill for replaceAll
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search, replace) {
    return this.split(search).join(replace);
  };
}

async function baseApiUrl() {
  try {
    const base = await axios.get(
      "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
    );
    return base.data.api;
  } catch {
    return "https://api.dipto.eu.org";
  }
}

(async () => {
  try {
    global.apis = {
      diptoApi: await baseApiUrl()
    };
  } catch (e) {
    global.apis = {
      diptoApi: "https://api.dipto.eu.org"
    };
  }
})();

async function getStreamFromURL(url, pathName) {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    response.data.path = pathName;
    return response.data;
  } catch (err) {
    throw err;
  }
}

global.utils = {
  ...global.utils,
  getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

module.exports.config = {
  name: "music2",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 ☠ 𝐑𝐀𝐙𝐀",
  description: "Download and play music from YouTube",
  commandCategory: "media",
  usages: "music2 [song name]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const songName = args.join(" ");
    if (!songName) {
      return api.sendMessage("Please provide a song name.", event.threadID, event.messageID);
    }

    const waitingMsg = await api.sendMessage(
      `🔍 Searching song "${songName}"...`,
      event.threadID
    );

    const response = await axios.get(
      `${global.apis.diptoApi}/search/song?song=${encodeURIComponent(songName)}`
    );

    if (!response.data || !response.data.downloadLink) {
      if (waitingMsg) api.unsendMessage(waitingMsg.messageID);
      return api.sendMessage("❌ | Failed to find or download the song.", event.threadID, event.messageID);
    }

    const { title, downloadLink } = response.data;

    if (waitingMsg) api.unsendMessage(waitingMsg.messageID);

    return api.sendMessage(
      {
        body: `🎶 𝗠𝘂𝘀𝗶𝗰 𝗙𝗲𝘁𝗰𝗵𝗲𝗱 🎶\n\n🔖 Title: ${title}`,
        attachment: await global.utils.getStreamFromURL(downloadLink, title + ".mp3")
      },
      event.threadID,
      event.messageID
    );

  } catch (e) {
    return api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};