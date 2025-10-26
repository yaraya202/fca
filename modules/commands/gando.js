
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "gando",
  version: "1.0.0",
  hasPermssion: 2, // Admin-only (changed from permission to hasPermssion)
  credits: "Kashif Raza",
  description: "Tags a user and insults them with desi abusive lines every 2 seconds when enabled.",
  commandCategory: "Fun",
  usages: ".gando on/off | .gando @tag",
  cooldowns: 0,
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

// Store active intervals globally
global.gandoIntervals = global.gandoIntervals || {};

module.exports.run = async ({ api, event, args }) => {
  const configPath = path.join(__dirname, "cache", "gando_config.json");
  const cacheDir = path.join(__dirname, "cache");
  
  // Create cache directory if it doesn't exist
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  let config = fs.existsSync(configPath) ? fs.readJsonSync(configPath) : {
    enabled: {},
    taggedUsers: {},
    insults: [
      "Tu gando hai bharway!",
      "Teri ma ka bhosda!",
      "Chal nikal yahan se!",
      "Tu pagal hai kya?",
      "Teri ma ki chut!",
      "Bhag yahan se!",
      "Tu kutta hai!",
      "Teri behan ka lavda!",
      "Gandu saala!",
      "Tu madarchod hai!"
    ]
  };
  
  const adminUID = "100004370672067"; // Raza's UID
  const threadID = event.threadID;
  const senderID = event.senderID;

  // Check if sender is admin
  if (senderID !== adminUID) {
    return api.sendMessage("Sirf admin (Raza) is command ko use kar sakta hai! 😡", threadID, event.messageID);
  }

  // Handle on/off or tag command
  if (args.length === 0 && (!event.mentions || Object.keys(event.mentions).length === 0)) {
    return api.sendMessage("Command usage: .gando on/off | .gando @tag", threadID, event.messageID);
  }

  const command = args[0] ? args[0].toLowerCase() : "";

  if (command === "on") {
    if (config.enabled[threadID]) {
      return api.sendMessage("Gando mode pehle se ON hai! 😈", threadID, event.messageID);
    }
    
    config.enabled[threadID] = true;
    config.taggedUsers[threadID] = config.taggedUsers[threadID] || [];
    fs.writeJsonSync(configPath, config);
    return api.sendMessage("Gando mode ON! Ab koi bhi tag karo toh usko har 2 seconds mein galiyan padengi! 😈\nUsage: .gando @username", threadID, event.messageID);
    
  } else if (command === "off") {
    if (!config.enabled[threadID]) {
      return api.sendMessage("Gando mode pehle se OFF hai! 😇", threadID, event.messageID);
    }
    
    config.enabled[threadID] = false;
    config.taggedUsers[threadID] = [];
    
    // Clear all intervals for this thread
    if (global.gandoIntervals[threadID]) {
      Object.values(global.gandoIntervals[threadID]).forEach(interval => {
        clearInterval(interval);
      });
      delete global.gandoIntervals[threadID];
    }
    
    fs.writeJsonSync(configPath, config);
    return api.sendMessage("Gando mode OFF! Ab koi gali nahi padegi. 😇", threadID, event.messageID);
    
  } else if (event.mentions && Object.keys(event.mentions).length > 0) {
    // Handle tagging users
    if (!config.enabled[threadID]) {
      return api.sendMessage("Gando mode is OFF! Pehle .gando on karo. 😤", threadID, event.messageID);
    }
    
    const taggedUserID = Object.keys(event.mentions)[0];
    const taggedUserName = event.mentions[taggedUserID].replace("@", "");
    
    // Initialize intervals object for this thread if not exists
    if (!global.gandoIntervals[threadID]) {
      global.gandoIntervals[threadID] = {};
    }
    
    // Check if user is already being targeted
    if (config.taggedUsers[threadID].includes(taggedUserID)) {
      return api.sendMessage(`${taggedUserName} ko pehle se hi target kiya ja raha hai! 😈`, threadID, event.messageID);
    }
    
    // Add user to tagged list
    config.taggedUsers[threadID].push(taggedUserID);
    fs.writeJsonSync(configPath, config);
    
    // Start continuous tagging for this specific user
    global.gandoIntervals[threadID][taggedUserID] = setInterval(async () => {
      try {
        // Check if gando mode is still enabled
        const currentConfig = fs.existsSync(configPath) ? fs.readJsonSync(configPath) : config;
        if (!currentConfig.enabled[threadID]) {
          clearInterval(global.gandoIntervals[threadID][taggedUserID]);
          delete global.gandoIntervals[threadID][taggedUserID];
          return;
        }
        
        // Load insults from devil_data.json if available
        const devilDataPath = path.join(__dirname, "cache", "gando_config.json");
        let insults = currentConfig.insults;
        
        if (fs.existsSync(devilDataPath)) {
          try {
            const devilData = fs.readJsonSync(devilDataPath);
            if (devilData.insult_responses && devilData.insult_responses.length > 0) {
              insults = devilData.insult_responses;
            }
          } catch (error) {
            console.error("Error reading devil_data.json:", error);
          }
        }
        
        if (insults.length === 0) return;
        
        const userInfo = await api.getUserInfo(taggedUserID);
        const userName = userInfo[taggedUserID].name;
        const randomInsult = insults[Math.floor(Math.random() * insults.length)];
        
        api.sendMessage(`@${userName}, ${randomInsult}`, threadID);
        
      } catch (error) {
        console.error("Gando interval error:", error.message);
        // Clear interval if there's an error
        clearInterval(global.gandoIntervals[threadID][taggedUserID]);
        delete global.gandoIntervals[threadID][taggedUserID];
      }
    }, 1000); // 2 seconds
    
    return api.sendMessage(`${taggedUserName} ko target kar diya! Ab usko har 2 seconds mein galiyan padengi! 😈\nBand karne ke liye: .gando off`, threadID, event.messageID);
    
  } else {
    return api.sendMessage("Command usage: .gando on/off | .gando @tag", threadID, event.messageID);
  }
};
