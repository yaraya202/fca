const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "tiktok",
    version: "1.0.0",
    permission: 0,
    prefix: true,
    premium: false,
    category: "media",
    credits: "Your Name",
    description: "Download TikTok video by search query",
    commandCategory: "utility",
    usages: ".tiktok [video name]",
    cooldowns: 5,
    dependencies: {
        "axios": "0.21.1",
        "fs-extra": "10.0.0",
        "path": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    console.log("run function triggered", { api, event, args });

    if (!api || !event || !args) {
        console.error("Missing required parameters", { api, event, args });
        return api.sendMessage("❌ Internal error: Missing parameters.", event.threadID, event.messageID);
    }

    const query = args.join(" ");
    console.log("Parsed query:", query);
    if (!query) {
        console.log("No query provided");
        return api.sendMessage("❌ Please provide a video name after .tiktok", event.threadID, event.messageID);
    }

    // Set loading reaction
    api.setMessageReaction("⏳", event.messageID, (err) => {
        if (err) console.error("Failed to set loading reaction:", err);
        else console.log("Loading reaction set successfully");
    }, true);

    try {
        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);
        console.log("Cache directory ensured:", cacheDir);

        const apiUrl = `https://kaiz-apis.gleeze.com/api/tiksearch?search=${encodeURIComponent(query)}&apikey=375a98c7-2bd5-4b89-91a7-696e31d48886`;
        console.log("API call:", apiUrl);

        let apiRes;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                apiRes = await axios.get(apiUrl, { timeout: 45000 });
                break;
            } catch (apiErr) {
                console.error(`API attempt ${attempt} failed: ${apiErr.message}`);
                if (attempt === 3) throw apiErr;
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
            }
        }

        const videoData = apiRes.data.data.videos[0];
        if (!videoData || !videoData.play) {
            throw new Error("No video found for the query.");
        }
        console.log("Selected video:", videoData);

        const downloadLink = videoData.play;
        if (!downloadLink || typeof downloadLink !== "string") {
            throw new Error("Invalid or missing download URL");
        }
        console.log("Download link received:", downloadLink);

        const fileName = `tiktok_${Date.now()}.mp4`;
        const filePath = path.join(cacheDir, fileName);

        const response = await axios.get(downloadLink, { responseType: "arraybuffer", timeout: 60000 });
        await fs.writeFile(filePath, Buffer.from(response.data, "binary"));
        console.log("Video file saved:", filePath);

        const stats = await fs.stat(filePath);
        if (stats.size / (1024 * 1024) > 25) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            api.setMessageReaction("⚠️", event.messageID, (err) => {
                if (err) console.error("Warning reaction error:", err);
            }, true);
            return api.sendMessage("⚠️ Video size exceeds 25MB. Can't send.", event.threadID, event.messageID);
        }

        // Send the video and set done reaction
        api.sendMessage({
            body: `🎬 Here's the TikTok video for "${query}":\nTitle: ${videoData.title}\nAuthor: ${videoData.author.nickname}`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, (err) => {
            if (err) {
                console.error("Send message error:", err);
                api.sendMessage("❌ Failed to send video. Try again later.", event.threadID, event.messageID);
                api.setMessageReaction("❌", event.messageID, (err) => {
                    if (err) console.error("Error reaction error:", err);
                }, true);
            } else {
                console.log("Video sent successfully");
                api.setMessageReaction("✅", event.messageID, (err) => {
                    if (err) console.error("Done reaction error:", err);
                    else console.log("Done reaction set successfully");
                }, true);
            }
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Clean up on success or error
            console.log("Video file cleaned up:", filePath);
        }, event.messageID);
    } catch (err) {
        console.error("Download Error:", err.message || err);
        api.setMessageReaction("❌", event.messageID, (err) => {
            if (err) console.error("Error reaction error:", err);
        }, true);
        let errorMessage = "❌ Error downloading video. Try again later.";
        if (err.message.includes("timeout")) errorMessage = "❌ Download timed out. Try again later.";
        else if (err.message.includes("Invalid or missing download URL")) errorMessage = "❌ Invalid API response.";
        else if (err.message.includes("No video found")) errorMessage = "❌ No video found for the query.";
        api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
};