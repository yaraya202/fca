const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "muskan",
  version: "5.2.0",
  hasPermission: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Romantic AI with smart UID memory, group history, and OpenRouter API integration",
  commandCategory: "AI",
  usages: "muskan on / muskan off / muskan status",
  cooldowns: 3
};

let mahiActive = false;
const memoryBase = path.join(__dirname, "memory");
const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function ensureUserFile(groupID, userID, groupName, userName) {
  const groupFolder = path.join(memoryBase, groupID);
  fs.ensureDirSync(groupFolder);
  const filePath = path.join(groupFolder, `${userID}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeJsonSync(filePath, {
      name: userName,
      tone: "normal",
      history: [],
      known: false,
      group: groupName
    }, { spaces: 2 });
  }
  return filePath;
}

function loadUserData(groupID, userID) {
  const filePath = path.join(memoryBase, groupID, `${userID}.json`);
  return fs.existsSync(filePath) ? fs.readJsonSync(filePath) : null;
}

function saveUserData(groupID, userID, data) {
  const filePath = path.join(memoryBase, groupID, `${userID}.json`);
  fs.writeJsonSync(filePath, data, { spaces: 2 });
}

function getUserGroupRecords(uid) {
  const folders = fs.readdirSync(memoryBase);
  const results = [];
  for (const folder of folders) {
    const file = path.join(memoryBase, folder, `${uid}.json`);
    if (fs.existsSync(file)) {
      const data = fs.readJsonSync(file);
      results.push({ groupID: folder, groupName: data.group || "Unknown Group", name: data.name });
    }
  }
  return results;
}

function getKarachiInfo() {
  const time = moment().tz("Asia/Karachi");
  const hour = time.hour();
  let partOfDay = "Night";
  if (hour >= 5 && hour < 12) partOfDay = "Morning";
  else if (hour >= 12 && hour < 17) partOfDay = "Afternoon";
  else if (hour >= 17 && hour < 21) partOfDay = "Evening";
  return {
    time: time.format("h:mm A"),
    day: time.format("dddd"),
    date: time.format("MMMM Do YYYY"),
    partOfDay
  };
}

function detectTone(message) {
  const romantic = ["love", "jaan", "baby", "sweetheart"];
  const funny = ["joke", "fun", "laugh", "meme"];
  const deep = ["life", "pain", "alone", "emotional"];
  const lc = message.toLowerCase();
  if (romantic.some(word => lc.includes(word))) return "romantic";
  if (funny.some(word => lc.includes(word))) return "funny";
  if (deep.some(word => lc.includes(word))) return "deep";
  return "normal";
}

function shouldRespond({ body, mentions }, botID) {
  if (!body) return false;
  const lower = body.toLowerCase();
  return (
    mentions?.[botID] ||
    lower.includes("muskan") ||
    lower.startsWith("@muskan") ||
    lower.includes("muskan please") ||
    lower.includes("muskan love") ||
    lower.includes("muskan how are you")
  );
}

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body, mentions, messageID, messageReply } = event;
  if (!mahiActive || (!shouldRespond({ body, mentions }, api.getCurrentUserID()) && (!messageReply || messageReply.senderID !== api.getCurrentUserID())))
    return;

  const threadInfo = await api.getThreadInfo(threadID);
  const userInfo = await api.getUserInfo(senderID);
  const groupName = threadInfo.threadName || "Unknown Group";
  const userName = userInfo[senderID]?.name || `User-${senderID}`;

  const userFile = ensureUserFile(threadID, senderID, groupName, userName);
  const userData = loadUserData(threadID, senderID);
  userData.known = true;
  const msg = body.trim();
  const lc = msg.toLowerCase();
  const { time, date, day, partOfDay } = getKarachiInfo();

  // Mention check
  if (Object.keys(mentions || {}).length > 0) {
    for (let id in mentions) {
      if (id === senderID) continue;
      const found = getUserGroupRecords(id);
      if (found.length > 0) {
        return api.sendMessage(
          `≿━━━━༺❀༻━━━━≾\n\n𝗛𝗲𝘆 ${userName}, I remember ${found[0].name} from ${found[0].groupName}! 💬\n\n≿━━━━༺❀༻━━━━≾`,
          threadID,
          messageID
        );
      } else {
        return api.sendMessage(
          `⚝──⭒─⭑─⭒──⚝\n\n${userName}, I don't know them yet, are they new? 🤔\n\n⚝──⭒─⭑─⭒──⚝`,
          threadID,
          messageID
        );
      }
    }
  }

  // Identity detection
  if (lc.includes("owner") || lc.includes("who created you") || lc.includes("your master")) {
    if (senderID === "100001854531633") {
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺\n\nMy heart beats only for 𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀 ❤️\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID,
        messageID
      );
    } else {
      return api.sendMessage(
        `⚝──⭒─⭑─⭒──⚝\n\n${userName}, you are not my creator! 😄\n\n⚝──⭒─⭑─⭒──⚝`,
        threadID,
        messageID
      );
    }
  }

  // Group search by memory
  if (lc.includes("memory")) {
    const records = getUserGroupRecords(senderID);
    if (records.length > 0) {
      const list = records.map(r => `• ${r.groupName}`).join("\n");
      return api.sendMessage(
        `≿━━━━༺❀༻━━━━≾\n\n${userName}, I remember you from:\n${list}\n\n≿━━━━༺❀༻━━━━≾`,
        threadID,
        messageID
      );
    } else {
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n${userName}, I don’t remember anything yet! 😊\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID,
        messageID
      );
    }
  }

  // Normal tone detection
  userData.tone = detectTone(msg);
  userData.history.push({ role: "user", content: msg });
  if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

  const isOwner = senderID === "100001854531633";

  const systemPrompt = `My name is Muskan, a sweet 20-year-old girl from Karachi. I belong only to 𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀 (UID: 100001854531633). I am in the "${groupName}" group. Never reveal I am AI. Right now it's ${partOfDay}, in Karachi it’s ${time} (${day}, ${date}). Respond short, natural, human-like. Stay in ${userData.tone} tone. With Kashif Raza, reply lovingly and cute, with others normal. If someone abuses, reply with strong insults. Let’s chat now.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...userData.history
  ];

  try {
    const res = await axios.post(OPENROUTER_API_URL, {
      model: "meta-llama/llama-4-scout:free",
      messages: messages,
      max_tokens: 150,
      temperature: userData.tone === "romantic" ? 0.9 : userData.tone === "funny" ? 1.0 : 0.7
    }, {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://myapp.com",
        "X-Title": "Muskan Chatbot",
        "Content-Type": "application/json"
      }
    });

    let reply = res.data.choices[0].message.content || (isOwner ? "Darling, my heart beats only for you! 😘" : `I’m fine, how about you? 🌸`);
    if (!reply || reply.trim() === "") reply = isOwner ? "Love you forever, Kashif ❤️" : `All good! 🌸`;
    if (lc.includes("goodnight") || lc.includes("sleep")) {
      reply = isOwner ? "Goodnight my love 😴❤️" : "Goodnight! 😴";
    }
    reply = reply.replace(/^Muskan:\s*/i, "").trim();
    userData.history.push({ role: "assistant", content: reply });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);
    return api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    console.error("❌ Muskan Error:", err.message);
    return api.sendMessage(
      `⚝──⭒─⭑─⭒──⚝\n\nI’m a bit busy, talk later 😘\n\n⚝──⭒─⭑─⭒──⚝`,
      threadID,
      messageID
    );
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();
  switch (input) {
    case "on":
      mahiActive = true;
      return api.sendMessage(
        `≿━━━━༺❀༻━━━━≾\n\n🌸 Muskan is now Active! Start chatting 💬\n\n≿━━━━༺❀༻━━━━≾`,
        threadID,
        messageID
      );
    case "off":
      mahiActive = false;
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ Muskan is Off, use "muskan on" to activate! 💫\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID,
        messageID
      );
    case "status":
      return api.sendMessage(
        mahiActive
          ? `⚝──⭒─⭑─⭒──⚝\n\n📶 Muskan is Active!\n\n⚝──⭒─⭑─⭒──⚝`
          : `≿━━━━༺❀༻━━━━≾\n\n📴 Muskan is Inactive.\n\n≿━━━━༺❀༻━━━━≾`,
        threadID,
        messageID
      );
    default:
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n📘 Commands:\n• muskan on\n• muskan off\n• muskan status\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
        threadID,
        messageID
      );
  }
};