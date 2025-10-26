const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const pathData = path.join(__dirname, '../commands/cache/antiavtbox.json');

module.exports.config = {
    name: "antiavtbox",
    eventType: ["log:thread-icon"],
    version: "1.0.0",
    credits: "",
    description: "Prevent changing the group avatar",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageData, threadID, author } = event;
    try {
        let antiData = await fs.readJSON(pathData);
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        if (!threadEntry) return;

        // Don't restore if author is admin or bot admin
        if (global.config.ADMINBOT.includes(author) || global.config.NDH.includes(author)) return;

        // Wait a bit for the image to be updated
        await new Promise(resolve => setTimeout(resolve, 3000));

        const thread = await Threads.getInfo(threadID);
        const currentImgSrc = thread.imageSrc;

        if (currentImgSrc !== threadEntry.url) {
            api.sendMessage("❌ Detected unauthorized avatar change, restoring...", threadID);
            try {
                const response = await axios.get(threadEntry.url, { responseType: 'stream' });
                api.changeGroupImage(response.data, threadID, (err) => {
                    if (err) {
                        console.error("Error restoring avatar:", err);
                        api.sendMessage("⚠️ An error occurred while restoring the avatar", threadID);
                    } else {
                        api.sendMessage("✅ Group avatar restored successfully!", threadID);
                    }
                });
            } catch (error) {
                console.error("Error fetching original avatar:", error);
                api.sendMessage("⚠️ An error occurred while restoring the group avatar", threadID);
            }
        }
    } catch (error) {
        console.error("Error in antiavtbox event:", error);
    }
};