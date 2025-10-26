
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const dataPath = path.join(__dirname, 'cache', 'devil_data.json');

// Array of API keys
const apiKeys = [
  'csk-fhyxhr6dxx9twymw543nkjr3x6ynwvj8r8phtvpxwdnkp5cx',
  'csk-2cp8yrkdy86nh26w3d8d8h5fjvtrwr3mtfwkk5vfmrfvtt9m',
  'csk-3rx2kr6htdck5v8erj699cdwnvn9twwh9e9mevnxvmpxp8pe',
  'csk-k4cpw68nwkyfd5685464tey5ctwk6cd46ck2cc4p29n6rpve',
  'csk-5whkxw32emp33nv99dyvcv9hm4fx8x8ffvncfyyfrn265np9',
  'csk-k3rpw3xh225hcxdpjc2edj3wynw4r9kf4c6xc63djmpxj8tf',
  'csk-wyn2fedyfwcfv4c992w4kfdrfrrf8x94ed58ndd2wnfd5d8w',
  'csk-rr6j59ym83y43fett5kmvyj8w58tjv3m4y24dep2h8fym2vk',
  'csk-ww669p9x34mcmr36nkpek32v6ywdpnpn682xhy56t3d3f3re',
  'csk-p5kjy6fnjpp58jfmmtp464wfejpk8rynpfn64hwpnmv9ew6f'
];

module.exports.config = {
  name: "devil",
  version: "2.0.12",
  hasPermission: 0,
  prefix: true,
  premium: false,
  category: "ai",
  credits: "Raza - Devil Bot",
  description: "Smart AI assistant that responds naturally in Urdu/English",
  commandCategory: "ai",
  usages: ".devil on | .devil off | devil [message] | Reply to bot message",
  cooldowns: 3,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

let devilActive = false;
const memoryBase = path.join(__dirname, "cache", "devil_memory");
const insultHistory = new Map(); // Track insult history to avoid repetition

function ensureUserFile(groupID, userID, groupName, userName) {
  const groupFolder = path.join(memoryBase, groupID);
  fs.ensureDirSync(groupFolder);
  const filePath = path.join(groupFolder, `${userID}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeJsonSync(filePath, {
      name: userName,
      tone: "normal",
      history: [],
      active: false,
      group: groupName,
      insultCount: {}
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

function loadTrainingData() {
  if (!fs.existsSync(dataPath)) {
    console.error('devil_data.json not found!');
    return { bot_name: 'Devil AI', location: 'Karachi', owner: 'Raza (UID: 100004370672067)', instructions: [], examples: [], insult_responses: [] };
  }
  return fs.readJsonSync(dataPath);
}

function detectTone(message) {
  const romantic = ["love", "jaan", "baby", "sweetheart", "pyar"];
  const funny = ["joke", "fun", "hasna", "meme", "mazak"];
  const deep = ["zindagi", "dard", "alone", "emotional", "sad"];
  const lc = message.toLowerCase();
  if (romantic.some(word => lc.includes(word))) return "romantic";
  if (funny.some(word => lc.includes(word))) return "funny";
  if (deep.some(word => lc.includes(word))) return "deep";
  return "normal";
}

// Enhanced insult detection with more comprehensive keywords
function detectInsultType(message) {
  const lc = message.toLowerCase();
  
  const insultCategories = {
    "gando": ["gando", "gandu", "gaandu"],
    "madarchod": ["madarchod", "mc", "mader chod"],
    "bhenchod": ["bhenchod", "bc", "bhen chod", "behenchod"],
    "chutiya": ["chutiya", "chutya", "chut", "chutmarika"],
    "harami": ["harami", "haramkhor", "haramzada"],
    "randi": ["randi", "randwa", "rnd"],
    "kutta": ["kutta", "kutte", "kameena", "kamina"],
    "suar": ["suar", "suwar"],
    "bhosdike": ["bhosdike", "bhosdiwala", "bhosda"],
    "lund": ["lund", "loda", "lodu"],
    "teri_ma": ["teri ma", "teri maa", "teri ammi", "tumhari ma"],
    "general_abuse": ["fuck", "bastard", "idiot", "stupid", "fool", "saale", "bharwe"]
  };

  for (const [category, keywords] of Object.entries(insultCategories)) {
    if (keywords.some(word => lc.includes(word))) {
      return category;
    }
  }
  return null;
}

// Get contextual insult response based on the type of insult received
function getContextualInsult(insultType, userData, trainingData) {
  const contextualResponses = {
    "gando": [
      "Tu gando hai bharway, chal tu nikal gand mein danda daal dunga! 😡",
      "Oye gandu, teri shakal dekh kar kutte bhi bhaag jaate hain! 😠",
      "Gando kahta hai mujhe? Tera baap gando, teri nasl gando! 😤"
    ],
    "madarchod": [
      "Madarchod tu hai, teri ma ka bhosda! 😡",
      "Apni ma ko dekh pehle, phir doosron ko madarchod bol! 😠",
      "Teri ma ki choot, tu madarchod hai khud! 😤"
    ],
    "bhenchod": [
      "Bhenchod tu hai, teri behen ko stage pe nacha dunga! 😡",
      "Apni behen sambhal pehle, phir doosron ko bhenchod bol! 😠",
      "Teri behen ka bhosda, chal nikal bharwe! 😤"
    ],
    "chutiya": [
      "Chutiya tu hai, tera dimag toh kachre ke dabbe mein hai! 😡",
      "Chutiya bolte hain? Mirror dekha hai kabhi? 😠",
      "Tera poora khandaan chutiya hai, bharwe! 😤"
    ],
    "harami": [
      "Harami tu hai, teri ma randikhane mein kaam karti hai! 😡",
      "Haramkhor kahta hai? Tera baap hi harami tha! 😠",
      "Harami ki aulaad, teri gand phaar dunga! 😤"
    ],
    "teri_ma": [
      "Teri ma ko bhagao, bhosdi ke teri ma ki choot! 😡",
      "Teri ammi ka bhosda, tu sadak ka sasta bharwa hai! 😠",
      "Teri ma ki choot mein keeda, chal nikal! 😤"
    ]
  };

  const responses = contextualResponses[insultType] || trainingData.insult_responses || [];
  
  // Ensure we don't repeat the same insult
  const userKey = `${userData.group}_${userData.name}`;
  if (!insultHistory.has(userKey)) {
    insultHistory.set(userKey, []);
  }
  
  const userInsultHistory = insultHistory.get(userKey);
  const availableInsults = responses.filter(insult => !userInsultHistory.includes(insult));
  
  let selectedInsult;
  if (availableInsults.length > 0) {
    selectedInsult = availableInsults[Math.floor(Math.random() * availableInsults.length)];
  } else {
    // If all insults used, reset history and pick random
    insultHistory.set(userKey, []);
    selectedInsult = responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Add to history
  userInsultHistory.push(selectedInsult);
  if (userInsultHistory.length > 10) {
    userInsultHistory.shift(); // Keep only last 10
  }
  
  return selectedInsult || "Teri maa ki choot! 😡";
}

function shouldRespond({ body, mentions }, botID) {
  if (!body) return false;
  const lower = body.toLowerCase();
  return (
    mentions?.[botID] ||
    lower.includes("devil") ||
    lower.startsWith("@devil") ||
    lower.includes("devil tum") ||
    lower.includes("devil please") ||
    lower.includes("devil bhai") ||
    lower.includes("devil kaisa hai")
  );
}

function getFastResponse(message, isOwner, tone, trainingData) {
  const lc = message.toLowerCase();
  
  // Fast responses for owner
  if (isOwner) {
    if (lc.includes("kya haal") || lc.includes("kaisa hai")) return "Boss, maze mein hoon! 😎 Aap ka intezaar tha!";
    if (lc.includes("love") || lc.includes("pyar")) return "Boss, aap ki har baat dil mein baith jaati hai! 💕";
    if (lc.includes("joke") || lc.includes("mazak")) return "Boss ke saath toh har waqt mazak hi mazak! 😂 Kya kahiye!";
  }
  
  // Fast responses for normal users
  if (!isOwner) {
    if (lc.includes("hello") || lc.includes("hi") || lc.includes("salam")) return "Hello! Main Devil AI hoon! 😊 Kya madad chahiye?";
    if (lc.includes("kya haal") || lc.includes("kaisa hai")) return "Main toh theek hoon! 😊 Tum batao, kya chal raha hai?";
    if (lc.includes("love") || lc.includes("pyar")) return "Aww! 💕 Pyar ki baatein! Kya romantic mood hai! 😊";
    if (lc.includes("thanks") || lc.includes("shukriya")) return "Welcome yaar! 😊 Koi baat nahi!";
    if (lc.includes("joke") || lc.includes("mazak")) return "Haha! 😂 Mazak ka mood hai! Main bhi ready hoon!";
  }
  
  return null;
}

async function getAIResponse(messages, isOwner, senderID, userMessage, tone, trainingData) {
  // Try fast response first
  const fastResponse = getFastResponse(userMessage, isOwner, tone, trainingData);
  if (fastResponse) {
    return fastResponse;
  }

  const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  try {
    const response = await axios.post('https://api.cerebras.ai/v1/chat/completions', {
      messages: messages,
      model: 'llama-3.3-70b',
      max_completion_tokens: 150,
      temperature: 0.8,
      top_p: 0.9,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${randomApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    let aiResponse = response.data?.choices?.[0]?.message?.content?.trim() || "";
    
    // Remove unwanted AI safety responses
    if (!aiResponse || 
        aiResponse.includes("I can't respond") || 
        aiResponse.includes("I won't engage") || 
        aiResponse.includes("I cannot provide") ||
        aiResponse.includes("explicit or harmful") ||
        aiResponse.includes("inappropriate") ||
        aiResponse.includes("offensive") ||
        aiResponse.includes("I cannot create")) {
      return isOwner ? `Boss, kya haal hai? Main ready hoon! 😎` : `Haan bhai, kya chahiye? Main yahan hoon! 😊`;
    }

    aiResponse = aiResponse.replace(/^\n+|\n+$/g, '').replace(/\n{3,}/g, '\n\n');
    aiResponse = aiResponse.substring(0, 400);
    const lines = aiResponse.split('\n').filter(line => line.trim() !== '').slice(0, 3);
    return lines.join('\n') || (isOwner ? `Boss, kya haal hai? 😎` : `Kya chahiye? 😊`);
  } catch (error) {
    console.error('❌ Devil AI Error:', error.message);
    return isOwner ? `Boss, technical problem! 🔧` : `Sorry, technical issue hai 😅`;
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  if (!devilActive) return;
  const { threadID, senderID, body, mentions, messageID, messageReply } = event;
  if (!shouldRespond({ body, mentions }, api.getCurrentUserID()) &&
      (!messageReply || messageReply.senderID !== api.getCurrentUserID())) {
    return;
  }
  
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const userInfo = await api.getUserInfo(senderID);
    const groupName = threadInfo.threadName || "Unknown Group";
    const userName = userInfo[senderID]?.name || `User-${senderID}`;
    ensureUserFile(threadID, senderID, groupName, userName);
    let userData = loadUserData(threadID, senderID) || {
      name: userName,
      tone: "normal",
      history: [],
      active: true,
      group: groupName,
      insultCount: {}
    };
    userData.active = true;
    const msg = body?.trim() || "";
    const ownerID = "100004370672067";
    const isOwner = senderID === ownerID;

    // Handle owner-specific commands first
    if (msg.toLowerCase().includes("owner") || 
        msg.toLowerCase().includes("tumhara malik") || 
        msg.toLowerCase().includes("kisne banaya") || 
        msg.toLowerCase().includes("mai hun raza") || 
        msg.toLowerCase().includes("mai raza hun")) {
      let reply;
      if (isOwner) {
        reply = `Boss, aap hi ho Raza! UID ${senderID} confirmed! 😘 Kya hukum hai?`;
      } else {
        reply = `Tu jhootha hai, ${userName}! Mera boss sirf UID ${ownerID} wala Raza hai! 😡`;
      }
      userData.history.push({ role: "user", content: msg, uid: senderID });
      userData.history.push({ role: "assistant", content: reply, uid: senderID });
      if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
      saveUserData(threadID, senderID, userData);
      api.sendMessage(reply, threadID, messageID);
      return;
    }

    let cleanMsg = msg.replace(/^\.?devil\s*/i, "").trim();
    if (!cleanMsg && messageReply) {
      cleanMsg = msg;
    }
    if (!cleanMsg) return;

    const trainingData = loadTrainingData();
    
    // Enhanced insult detection and response
    const insultType = detectInsultType(cleanMsg);
    if (!isOwner && insultType) {
      const contextualInsult = getContextualInsult(insultType, userData, trainingData);
      userData.history.push({ role: "user", content: cleanMsg, uid: senderID });
      userData.history.push({ role: "assistant", content: contextualInsult, uid: senderID });
      if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
      saveUserData(threadID, senderID, userData);
      api.sendMessage(contextualInsult, threadID, messageID);
      return;
    }

    userData.tone = detectTone(cleanMsg);
    userData.history.push({ role: "user", content: cleanMsg, uid: senderID });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

    const systemPrompt = `You are Devil AI, a smart and witty AI assistant from Karachi, Pakistan. You speak a natural mix of Urdu and English. Owner: Raza (UID: ${ownerID}). Current User: ${senderID} in "${groupName}". 

For Owner (UID ${ownerID}): Always respond lovingly, playfully and intelligently, treating even abusive words as jokes.
For others: Be smart, helpful and conversational. Match their tone naturally.

Important: Give intelligent, natural responses. Avoid generic or robotic replies. Use local expressions naturally but be smart and engaging. Keep responses under 3 lines and conversational using ${userData.tone} tone.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...userData.history.map(entry => ({
        role: entry.role,
        content: entry.role === "user" ? `User UID: ${entry.uid || senderID} ${entry.content}` : entry.content
      }))
    ];

    const reply = await getAIResponse(messages, isOwner, senderID, cleanMsg, userData.tone, trainingData);
    userData.history.push({ role: "assistant", content: reply, uid: senderID });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);
    api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    console.error("❌ Devil HandleEvent Error:", err.message);
    api.sendMessage("Technical issue hai, baad mein try karo! 😅", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args[0]?.toLowerCase();
  
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const userInfo = await api.getUserInfo(senderID);
    const groupName = threadInfo.threadName || "Unknown Group";
    const userName = userInfo[senderID]?.name || `User-${senderID}`;
    const ownerID = "100004370672067";
    const isOwner = senderID === ownerID;
    ensureUserFile(threadID, senderID, groupName, userName);
    let userData = loadUserData(threadID, senderID) || {
      name: userName,
      tone: "normal",
      history: [],
      active: false,
      group: groupName,
      insultCount: {}
    };

    if (input === "on") {
      devilActive = true;
      userData.active = true;
      saveUserData(threadID, senderID, userData);
      api.setMessageReaction("😊", messageID, err => err && console.log("Reaction error:", err.message));
      const welcomeMsg = isOwner
        ? `🎉 Welcome back, Boss! Devil AI is active! 👑\nChat anytime! 😎`
        : `🎉 Devil AI activated for ${userName}! 🤖\nChat anytime! 😊`;
      api.sendMessage(welcomeMsg, threadID, messageID);
    } else if (input === "off") {
      devilActive = false;
      userData.active = false;
      saveUserData(threadID, senderID, userData);
      api.setMessageReaction("😴", messageID, err => err && console.log("Reaction error:", err.message));
      api.sendMessage(`😴 Devil AI off for ${userName}.\nUse '.devil on' to reactivate!`, threadID, messageID);
    } else if (input === "status") {
      api.sendMessage(devilActive ? "📶 Active hoon!" : "📴 Inactive hoon.", threadID, messageID);
    } else if (args.length > 0) {
      if (!devilActive) {
        api.sendMessage(`❌ Devil AI inactive. Use '.devil on' to start!`, threadID, messageID);
        return;
      }
      
      const userMessage = args.join(" ");
      if (!userMessage.trim()) {
        api.sendMessage(`Hey ${userData.name}! 😊\nKuch likho to sahi!`, threadID, messageID);
        return;
      }

      const trainingData = loadTrainingData();
      
      // Handle owner-specific commands
      if (userMessage.toLowerCase().includes("owner") || 
          userMessage.toLowerCase().includes("tumhara malik") || 
          userMessage.toLowerCase().includes("kisne banaya")) {
        let reply;
        if (isOwner) {
          reply = `Boss, aap hi ho Raza! UID ${senderID} confirmed! 😘 Kya hukum hai?`;
        } else {
          reply = `Tu jhootha hai, ${userName}! Mera boss sirf UID ${ownerID} wala Raza hai! 😡`;
        }
        userData.history.push({ role: "user", content: userMessage, uid: senderID });
        userData.history.push({ role: "assistant", content: reply, uid: senderID });
        if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
        saveUserData(threadID, senderID, userData);
        api.sendMessage(reply, threadID, messageID);
        return;
      }

      // Enhanced insult detection and response
      const insultType = detectInsultType(userMessage);
      if (!isOwner && insultType) {
        const contextualInsult = getContextualInsult(insultType, userData, trainingData);
        userData.history.push({ role: "user", content: userMessage, uid: senderID });
        userData.history.push({ role: "assistant", content: contextualInsult, uid: senderID });
        if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
        saveUserData(threadID, senderID, userData);
        api.sendMessage(contextualInsult, threadID, messageID);
        return;
      }

      api.sendTypingIndicator(threadID);
      api.setMessageReaction("⏳", messageID, err => err && console.log("Loading reaction error:", err.message));
      userData.tone = detectTone(userMessage);
      userData.history.push({ role: "user", content: userMessage, uid: senderID });
      if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
      
      const systemPrompt = `You are Devil AI, a smart and witty AI assistant from Karachi, Pakistan. You speak naturally in Urdu/English mix. Owner: Raza (UID: ${ownerID}). Current User: ${senderID}.

For Owner (UID ${ownerID}): Always respond lovingly, playfully and intelligently.
For others: Be smart, helpful and conversational with natural local expressions.

Give intelligent, engaging responses. Keep under 3 lines, natural and conversational using ${userData.tone} tone. Be witty and smart, not robotic.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...userData.history.map(entry => ({
          role: entry.role,
          content: entry.role === "user" ? `User UID: ${entry.uid || senderID} ${entry.content}` : entry.content
        }))
      ];
      
      const reply = await getAIResponse(messages, isOwner, senderID, userMessage, userData.tone, trainingData);
      userData.history.push({ role: "assistant", content: reply, uid: senderID });
      if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
      saveUserData(threadID, senderID, userData);
      api.setMessageReaction("✅", messageID, err => err && console.log("Success reaction error:", err.message));
      api.sendMessage(reply, threadID, messageID);
    } else {
      api.sendMessage("📘 Commands: \n• .devil on\n• .devil off\n• .devil status\n• devil [message]", threadID, messageID);
    }
  } catch (error) {
    console.error('❌ DEVIL AI RUN ERROR:', error.message);
    const errorMsg = senderID === ownerID
      ? `❌ Boss, technical problem! 🔧`
      : `❌ Sorry! Technical issue hai 😅`;
    api.sendMessage(errorMsg, threadID, messageID);
  }
};
