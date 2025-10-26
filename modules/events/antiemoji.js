const fs = require('fs-extra');
const path = require('path');
const pathData = path.join(__dirname, '../commands/cache/antiemoji.json');

module.exports.config = {
    name: "antiemoji",
    eventType: ["log:thread-icon"],
    version: "1.0.0",
    credits: "",
    description: "Prevent changing the group emoji",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { threadID, logMessageData } = event;

    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) {
            api.sendMessage("⚠️ This group has not enabled the anti-emoji change feature.", threadID);
            return;
        }

        const originalEmoji = threadEntry.emoji;
        const newEmoji = logMessageData.thread_icon;

        if (newEmoji !== originalEmoji) {
            api.sendMessage("❌ Detected emoji change, restoring...", threadID);

            api.changeThreadEmoji(originalEmoji, threadID, (err) => {
                if (err) {
                    api.sendMessage("⚠️ An error occurred while restoring the emoji. Please check the bot's permissions.", threadID);
                } else {
                    api.sendMessage("✅ Group emoji restored successfully!", threadID);
                }
            });
        }
    } catch (error) {
        api.sendMessage("❌ An error occurred during processing.", threadID);
    }
};