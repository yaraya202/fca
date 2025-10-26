const axios = require("axios");

module.exports.config = {
  name: "aipic",
  version: "1.0.1",
  hasPermission: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Generate AI image using Stable Diffusion",
  commandCategory: "AI",
  usages: "[prompt]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ").trim();
  if (!prompt) {
    return api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n𝗣𝗿𝗼𝗺𝗽𝘁 𝗺𝗶𝘀𝘀𝗶𝗻𝗴 ❌\nUsage: aipic <your prompt>\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
      event.threadID,
      event.messageID
    );
  }

  try {
    const response = await axios.get("https://api.princetechn.com/api/ai/sd", {
      params: {
        apikey: "prince",
        prompt: prompt
      },
      responseType: "stream"
    });

    return api.sendMessage({
      body: `≿━━━━༺❀༻━━━━≾\n\n𝗔𝗜 𝗜𝗺𝗮𝗴𝗲 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 ✅\nPrompt: ${prompt}\n\n≿━━━━༺❀༻━━━━≾`,
      attachment: response.data
    }, event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ API Error:", err.message);
    return api.sendMessage(
      `⚝──⭒─⭑─⭒──⚝\n\n𝗜𝗺𝗮𝗴𝗲 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗼𝗻 𝗳𝗮𝗶𝗹𝗲𝗱 ❌\nPlease try again later or change your prompt.\n\n⚝──⭒─⭑─⭒──⚝`,
      event.threadID,
      event.messageID
    );
  }
};