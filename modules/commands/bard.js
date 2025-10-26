const axios = require("axios");
const fs = require("fs");
const gtts = require("gtts");
const path = require("path");

module.exports.config = {
  name: "bard",
  version: "1.0.0",
  hasPermission: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Bard with voice and image support",
  commandCategory: "Utility",
  usages: "command + question",
  cooldowns: 5,
};

async function convertImageToText(imageURL) {
  try {
    const response = await axios.get(`https://bard-ai.arjhilbard.repl.co/api/other/img2text?input=${encodeURIComponent(imageURL)}`);
    return response.data.extractedText;
  } catch (error) {
    console.error("Error: Unable to load image:", error);
    return null;
  }
}

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }
  return formattedText;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, type, messageReply } = event;
  let question = "";

  if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
    const attachment = messageReply.attachments[0];
    const imageURL = attachment.url;
    question = await convertImageToText(imageURL);

    if (!question) {
      api.sendMessage(
        `≿━━━━༺❀༻━━━━≾

𝗖𝗮𝗻𝗻𝗼𝘁 𝗰𝗼𝗻𝘃𝗲𝗿𝘁 𝗶𝗺𝗮𝗴𝗲 𝘁𝗼 𝘁𝗲𝘅𝘁. **Please try again with a clearer image.**

≿━━━━༺❀༻━━━━≾`,
        threadID,
        messageID
      );
      return;
    }
  } else {
    question = args.join(" ").trim();

    if (!question) {
      api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺

**Please provide a question or query.**

༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID,
        messageID
      );
      return;
    }
  }

  api.sendMessage("🔎", threadID, messageID);

  try {
    const bardResponse = await axios.get(`https://a8417ca2-e03c-455b-9abd-c13b938d563f-00-2r3h3wdweq8ru.sisko.replit.dev/bard?ask=`);
    const bardData = bardResponse.data;
    const bardMessage = bardData.message;

    const pinterestResponse = await axios.get(`https://api-all-1.arjhilbard.repl.co/pinterest?search=${encodeURIComponent(question)}`);
    const pinterestImageUrls = pinterestResponse.data.data.slice(0, 6);

    const pinterestImageAttachments = [];

    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    for (let i = 0; i < pinterestImageUrls.length; i++) {
      const imageUrl = pinterestImageUrls[i];
      try {
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imagePath = path.join(cacheDir, `pinterest_image${i + 1}.jpg`);
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));
        pinterestImageAttachments.push(fs.createReadStream(imagePath));
      } catch (error) {
        console.error("Error fetching Pinterest image:", error);
      }
    }

    const formattedBardAnswer = `⚝──⭒─⭑─⭒──⚝

**${formatFont(bardMessage)}**

⚝──⭒─⭑─⭒──⚝`;
    api.sendMessage(formattedBardAnswer, threadID);

    const gttsPath = path.join(cacheDir, 'voice.mp3');
    const gttsInstance = new gtts(bardMessage, 'en');
    gttsInstance.save(gttsPath, function (error) {
      if (error) {
        console.error("Error saving gTTS:", error);
      } else {
        api.sendMessage({
          body: "🗣️",
          attachment: fs.createReadStream(gttsPath)
        }, threadID);
      }
    });

    if (pinterestImageAttachments.length > 0) {
      api.sendMessage(
        {
          attachment: pinterestImageAttachments,
          body: `≿━━━━༺❀༻━━━━≾

**Images related to your question: ${question}**

≿━━━━༺❀༻━━━━≾`,
        },
        threadID
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
    api.sendMessage(
      `༻﹡﹡﹡﹡﹡﹡﹡༺

**An error occurred while processing your request.**

༻﹡﹡﹡﹡﹡﹡﹡༺`,
      threadID,
      messageID
    );
  }
};