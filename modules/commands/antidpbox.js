const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const pathData = path.join(__dirname, 'cache/antidpbox.json');

module.exports.config = {
  name: "antidpbox",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "100001854531633",
  description: "Lock group display picture to prevent changes",
  commandCategory: "Group Management",
  usages: "[on/off]",
  cooldowns: 3
};

module.exports.run = async ({ api, event, Threads, args }) => {
  const { threadID, messageID } = event;

  try {
    // Ensure cache directory and file exist
    const cacheDir = path.dirname(pathData);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (!fs.existsSync(pathData)) {
      fs.writeFileSync(pathData, JSON.stringify([], null, 2));
    }

    let antiData = [];
    try {
      antiData = JSON.parse(fs.readFileSync(pathData, 'utf8'));
    } catch (err) {
      antiData = [];
    }

    const threadEntry = antiData.find(entry => entry.threadID === threadID);

    if (args[0] === "off" && threadEntry) {
      // Remove protection and cached image
      antiData = antiData.filter(entry => entry.threadID !== threadID);

      // Delete cached image file if exists
      const imagePath = path.join(__dirname, 'cache', `dp_${threadID}.jpg`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      fs.writeFileSync(pathData, JSON.stringify(antiData, null, 2));
      return api.sendMessage("✅ Group display picture protection has been disabled successfully!", threadID, messageID);
    }

    if (threadEntry) {
      // Already protected, show status
      return api.sendMessage(`🔒 Group display picture is already protected!\n🖼️ Current protection is active.\n\nUse "${global.config.PREFIX}antidpbox off" to disable protection.`, threadID, messageID);
    }

    // Enable protection
    api.sendMessage("⏳ Setting up display picture protection, please wait...", threadID, messageID);

    try {
      const threadInfo = await Threads.getInfo(threadID);
      const currentImageUrl = threadInfo.imageSrc;

      if (!currentImageUrl) {
        // Removed api.unsendMessage(loadingMsg.messageID); as loadingMsg is not defined here
        return api.sendMessage("❌ This group doesn't have a display picture to protect!", threadID, messageID);
      }

      // Download and cache the image locally
      const imagePath = path.join(__dirname, 'cache', `dp_${threadID}.jpg`);

      try {
        const response = await axios.get(currentImageUrl, {
          responseType: 'stream',
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`✅ Successfully cached image for group ${threadID}`);

      } catch (downloadError) {
        console.error("❌ Failed to download image:", downloadError);
        // Removed api.unsendMessage(loadingMsg.messageID); as loadingMsg is not defined here
        return api.sendMessage("❌ Failed to download and cache group image. Please try again.", threadID, messageID);
      }

      const newEntry = {
        threadID: threadID,
        imageUrl: currentImageUrl,
        imagePath: imagePath,
        lockedBy: event.senderID,
        lockedAt: new Date().toISOString()
      };

      antiData.push(newEntry);
      fs.writeFileSync(pathData, JSON.stringify(antiData, null, 2));

      // Removed api.unsendMessage(loadingMsg.messageID); as loadingMsg is not defined here
      api.sendMessage("🔒 Group display picture protection enabled successfully!\n🖼️ Current image has been locked and cached.\n⚠️ Any changes to the group display picture will be automatically reverted.", threadID, messageID);

    } catch (infoError) {
      // Removed api.unsendMessage(loadingMsg.messageID); as loadingMsg is not defined here
      console.error("❌ Error getting thread info:", infoError);
      api.sendMessage("❌ Failed to get group information. Please try again.", threadID, messageID);
    }

  } catch (error) {
    console.error("❌ Error in antidpbox command:", error);
    api.sendMessage("❌ An error occurred while processing the command: " + error.message, threadID, messageID);
  }
};