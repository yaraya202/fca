const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const pathData = path.join(__dirname, '../commands/cache/antidpbox.json');

module.exports.config = {
    name: "antidpbox",
    eventType: ["log:thread-icon"],
    version: "1.0.0",
    credits: "100001854531633",
    description: "Auto restore locked group display picture when changed"
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageData, threadID, author } = event;

    try {
        // Check if data file exists
        if (!fs.existsSync(pathData)) {
            return;
        }

        let antiData = [];
        try {
            antiData = JSON.parse(fs.readFileSync(pathData, 'utf8'));
        } catch (err) {
            console.error("❌ Error reading antidpbox data:", err);
            return;
        }

        const threadEntry = antiData.find(entry => entry.threadID === threadID);

        // If this group is not protected, return
        if (!threadEntry) {
            return;
        }

        // Don't restore if the author is bot admin or NDH
        if (global.config.ADMINBOT.includes(author) || global.config.NDH.includes(author)) {
            console.log("🔧 Admin/NDH changed group photo, skipping restore");
            return;
        }

        console.log("🔍 Group photo change detected, starting restore process...");

        // Wait a moment for the image change to complete
        setTimeout(async () => {
            try {
                const cachedImagePath = threadEntry.imagePath || path.join(__dirname, '../commands/cache', `dp_${threadID}.jpg`);

                // Try to use cached image first
                if (fs.existsSync(cachedImagePath)) {
                    console.log("📁 Using cached image for restore...");

                    try {
                        const imageStream = fs.createReadStream(cachedImagePath);
                        await api.changeGroupImage(imageStream, threadID);
                        api.sendMessage("🔒 Group display picture protection activated!\n🖼️ Restored to locked image from cache.\n⚠️ This group's display picture is protected and cannot be changed.", threadID);
                        console.log("✅ Group photo restored successfully from cache");
                        return;
                    } catch (restoreError) {
                        console.error("❌ Cache restore failed, trying URL method:", restoreError);
                    }
                }

                // Fallback to URL method if cache fails
                const lockedImageUrl = threadEntry.imageUrl;

                if (!lockedImageUrl) {
                    console.error("❌ No locked image URL found and no cache available");
                    return;
                }

                console.log("🌐 Restoring group photo from URL...");

                // Download and restore the locked image
                const response = await axios.get(lockedImageUrl, { 
                    responseType: 'stream',
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                // Create a temporary file
                const tempPath = path.join(__dirname, '../commands/cache', `temp_restore_${Date.now()}.jpg`);
                const writer = fs.createWriteStream(tempPath);

                response.data.pipe(writer);

                writer.on('finish', async () => {
                    try {
                        const imageStream = fs.createReadStream(tempPath);
                        await api.changeGroupImage(imageStream, threadID);

                        // Update cache with new download
                        const cachedPath = path.join(__dirname, '../commands/cache', `dp_${threadID}.jpg`);
                        fs.copyFileSync(tempPath, cachedPath);

                        // Clean up temp file
                        fs.unlinkSync(tempPath);

                        api.sendMessage("🔒 Group display picture protection activated!\n🖼️ Restored to locked image.\n⚠️ This group's display picture is protected and cannot be changed.", threadID);
                        console.log("✅ Group photo restored successfully from URL");
                    } catch (err) {
                        console.error("❌ URL restore method failed:", err);
                        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                        api.sendMessage("❌ Failed to restore group display picture. Please check bot permissions.", threadID);
                    }
                });

                writer.on('error', (err) => {
                    console.error("❌ File write error:", err);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                });

            } catch (error) {
                console.error("❌ Error in antidpbox restore process:", error);
                api.sendMessage("❌ Failed to restore group display picture. Error: " + error.message, threadID);
            }
        }, 2000);

    } catch (error) {
        console.error("❌ Error in antidpbox event handler:", error);
    }
};