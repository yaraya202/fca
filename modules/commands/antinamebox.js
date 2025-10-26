
const fs = require('fs-extra');
const path = require('path');

const pathData = path.join(__dirname, 'cache/antinamebox.json');

module.exports.config = {
  name: "antinamebox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "100001854531633",
  description: "Lock group name to prevent changes",
  commandCategory: "Group Management",
  usages: "[on/off]",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Threads, args }) => {
  const { threadID, messageID } = event;
  
  try {
    // Ensure cache directory exists
    const cacheDir = path.dirname(pathData);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Ensure file exists
    if (!fs.existsSync(pathData)) {
      fs.writeFileSync(pathData, JSON.stringify([], null, 2));
    }
    
    let antiData = [];
    try {
      const fileContent = fs.readFileSync(pathData, 'utf8');
      antiData = JSON.parse(fileContent) || [];
    } catch (err) {
      console.log("Error reading antinamebox data, creating new file");
      antiData = [];
    }
    
    let threadEntry = antiData.find(entry => entry.threadID === threadID);
    
    if (args[0] === "off") {
      if (threadEntry) {
        // Remove protection
        antiData = antiData.filter(entry => entry.threadID !== threadID);
        fs.writeFileSync(pathData, JSON.stringify(antiData, null, 2));
        return api.sendMessage("✅ Group name protection has been disabled successfully!", threadID, messageID);
      } else {
        return api.sendMessage("❌ Group name protection is not enabled for this group!", threadID, messageID);
      }
    }
    
    if (threadEntry) {
      // Already protected, show status
      return api.sendMessage(`🔒 Group name is already protected!\n📝 Locked name: "${threadEntry.namebox}"\n\nUse "antinamebox off" to disable protection.`, threadID, messageID);
    }
    
    // Enable protection - get current group name
    try {
      const threadInfo = await Threads.getInfo(threadID);
      const currentName = threadInfo.threadName || threadInfo.name || "Unknown Group";
      
      const newEntry = {
        threadID: threadID,
        namebox: currentName,
        lockedBy: event.senderID,
        lockedAt: new Date().toISOString()
      };
      
      antiData.push(newEntry);
      fs.writeFileSync(pathData, JSON.stringify(antiData, null, 2));
      
      console.log(`Antinamebox: Protection enabled for thread ${threadID} with name: "${currentName}"`);
      
      api.sendMessage(`🔒 Group name protection enabled successfully!\n📝 Locked name: "${currentName}"\n⚠️ Any changes to the group name will be automatically reverted.`, threadID, messageID);
      
    } catch (infoError) {
      console.error("Error getting thread info:", infoError);
      api.sendMessage("❌ Failed to get group information. Please ensure the bot has proper permissions.", threadID, messageID);
    }
    
  } catch (error) {
    console.error("Error in antinamebox command:", error);
    api.sendMessage("❌ An error occurred while processing the command. Please try again.", threadID, messageID);
  }
};
