
const fs = require('fs-extra');
const path = require('path');

const pathData = path.join(__dirname, '../commands/cache/antinamebox.json');

module.exports.config = {
    name: "antinamebox",
    eventType: ["log:thread-name"],
    version: "1.0.0",
    credits: "100001854531633",
    description: "Auto restore locked group name when changed"
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageData, threadID, author } = event;
    
    try {
        console.log(`Antinamebox: Processing event for thread ${threadID}`);
        
        // Check if data file exists
        if (!fs.existsSync(pathData)) {
            console.log("Antinamebox: Data file not found");
            return;
        }
        
        let antiData = [];
        try {
            const fileContent = fs.readFileSync(pathData, 'utf8');
            antiData = JSON.parse(fileContent) || [];
        } catch (err) {
            console.log("Error reading antinamebox event data:", err);
            return;
        }
        
        let threadEntry = antiData.find(entry => entry.threadID === threadID);
        
        // If this group is not protected, return
        if (!threadEntry) {
            console.log(`Antinamebox: Thread ${threadID} is not protected`);
            return;
        }
        
        console.log(`Antinamebox: Thread ${threadID} is protected with name: "${threadEntry.namebox}"`);
        
        // Don't restore if the author is bot admin, NDH, or the bot itself
        const botID = api.getCurrentUserID();
        if (author === botID || 
            (global.config.ADMINBOT && global.config.ADMINBOT.includes(author)) || 
            (global.config.NDH && global.config.NDH.includes(author))) {
            console.log(`Antinamebox: Skipping restoration - author is admin/bot`);
            return;
        }
        
        const newName = logMessageData.name;
        const lockedName = threadEntry.namebox;
        
        console.log(`Antinamebox: New name: "${newName}", Locked name: "${lockedName}"`);
        
        // If the new name is different from locked name, restore it
        if (newName && newName !== lockedName) {
            console.log(`Antinamebox: Restoring name from "${newName}" to "${lockedName}" in thread ${threadID}`);
            
            // Wait a moment to ensure the change has been processed
            setTimeout(async () => {
                try {
                    await api.setTitle(lockedName, threadID);
                    console.log(`Successfully restored group name to: ${lockedName}`);
                    api.sendMessage(`🔒 Group name protection activated!\n📝 Restored to locked name: "${lockedName}"\n⚠️ This group's name is protected and cannot be changed.`, threadID);
                } catch (error) {
                    console.error("Error restoring group name:", error);
                    // Try again after a longer delay
                    setTimeout(async () => {
                        try {
                            await api.setTitle(lockedName, threadID);
                            console.log(`Successfully restored group name on retry to: ${lockedName}`);
                        } catch (retryError) {
                            console.error("Failed to restore group name on retry:", retryError);
                            api.sendMessage("❌ Failed to restore group name. Please check bot permissions or contact admin.", threadID);
                        }
                    }, 3000);
                }
            }, 1500);
        } else {
            console.log(`Antinamebox: No restoration needed. Names match.`);
        }
        
    } catch (error) {
        console.error("Error in antinamebox event:", error);
    }
};
