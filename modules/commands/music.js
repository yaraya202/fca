
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

async function baseApiUrl() {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
  );
  return base.data.api;
}

(async () => {
  global.apis = {
    diptoApi: await baseApiUrl()
  };
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

// Polyfill for replaceAll
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search, replace) {
    return this.split(search).join(replace);
  };
}

global.utils = {
  ...global.utils,
  getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

function getVideoID(url) {
  const checkurl =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
  const match = url.match(checkurl);
  return match ? match[1] : null;
}

module.exports.config = {
  name: "music",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 ☠ 𝐑𝐀𝐙𝐀",
  description: "Download and play music from YouTube",
  commandCategory: "media",
  usages: "music [song name or YouTube link]",
  cooldowns: 5,
  dependencies: {
    "yt-search": "",
    "axios": ""
  }
};

module.exports.run = async function ({ api, args, event }) {
  try {
    let videoID;
    const url = args[0];
    let waitingMsg;

    if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
      videoID = getVideoID(url);
      if (!videoID) {
        return api.sendMessage("❌ | Invalid YouTube URL.", event.threadID, event.messageID);
      }
    } else {
      const songName = args.join(" ");
      if (!songName) {
        return api.sendMessage("Please provide a song name or YouTube link.", event.threadID, event.messageID);
      }
      
      waitingMsg = await api.sendMessage(
        `🔍 Searching song "${songName}"...`,
        event.threadID
      );

      const r = await yts(songName);
      if (!r.videos || r.videos.length === 0) {
        return api.sendMessage("❌ | No results found for your search.", event.threadID, event.messageID);
      }
      const videos = r.videos.slice(0, 50);
      const videoData = videos[Math.floor(Math.random() * videos.length)];
      videoID = videoData.videoId;
    }

    const response = await axios.get(
      `${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`
    );
    
    if (!response.data || !response.data.downloadLink) {
      return api.sendMessage("❌ | Failed to fetch download link.", event.threadID, event.messageID);
    }
    
    const { title, quality, downloadLink } = response.data;

    if (waitingMsg) api.unsendMessage(waitingMsg.messageID);

    let shortenedLink;
    try {
      shortenedLink = (
        await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)
      ).data;
    } catch {
      shortenedLink = downloadLink;
    }

    return api.sendMessage(
      {
        body: `🎶 𝗠𝘂𝘀𝗶𝗰 𝗙𝗲𝘁𝗰𝗵𝗲𝗱 🎶\n\n🔖 Title: ${title}\n✨ Quality: ${quality}\n\n📥 Download: ${shortenedLink}`,
        attachment: await global.utils.getStreamFromURL(downloadLink, title + ".mp3")
      },
      event.threadID,
      event.messageID
    );

  } catch (e) {
    return api.sendMessage(`❌ | Error: ${e.message}`, event.threadID, event.messageID);
  }
};
