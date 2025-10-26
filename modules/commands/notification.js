
module.exports.config = {
    name: "notification",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Modified for notification forwarding",
    description: "Control Facebook notification forwarding to admin",
    commandCategory: "Admin",
    usages: "[on/off/check/test/force]",
    cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (!global.config.ADMINBOT.includes(senderID) && !global.config.NDH.includes(senderID)) {
        return api.sendMessage("❌ You don't have permission to use this command!", threadID, messageID);
    }
    
    const action = args[0]?.toLowerCase();
    
    switch(action) {
        case "on":
        case "enable":
            global.config.notificationForwarding = true;
            api.sendMessage("✅ Facebook notification forwarding has been ENABLED!\n📱 Bot will now forward all FB notifications to admin inbox.", threadID, messageID);
            break;
            
        case "off":
        case "disable":
            global.config.notificationForwarding = false;
            api.sendMessage("❌ Facebook notification forwarding has been DISABLED!\n📱 Bot will stop forwarding FB notifications.", threadID, messageID);
            break;
            
        case "check":
        case "status":
            const status = global.config.notificationForwarding !== false ? "✅ ENABLED" : "❌ DISABLED";
            const adminID = global.config.ADMINBOT?.[0] || global.config.NDH?.[0];
            api.sendMessage(
                `📱 NOTIFICATION STATUS\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `🔔 Status: ${status}\n` +
                `👤 Admin ID: ${adminID || 'Not found'}\n` +
                `⏰ Check Interval: 90 seconds\n` +
                `📋 Time Window: 3 minutes\n` +
                `━━━━━━━━━━━━━━━━━━━`,
                threadID, messageID
            );
            break;
            
        case "test":
            const testAdminID = "100004370672067"; // Your UID
            const fallbackTestAdminID = global.config.ADMINBOT?.[0] || global.config.NDH?.[0];
            const targetTestAdminID = testAdminID || fallbackTestAdminID;
            
            if (targetTestAdminID) {
                const testMsg = "🧪 TEST NOTIFICATION\n" +
                              "━━━━━━━━━━━━━━━━━━━\n" +
                              "⏰ Time: " + new Date().toLocaleString() + "\n" +
                              "💬 Message: This is a test notification from your Facebook bot\n" +
                              "✅ Notification system is working properly!\n" +
                              "━━━━━━━━━━━━━━━━━━━\n" +
                              "📱 Bot Notification System";
                
                // Try sending to admin inbox only
                api.sendMessage(testMsg, targetTestAdminID, (err) => {
                    if (err) {
                        console.log(`Test notification error: ${err.errorDescription || err.error}`);
                        
                        api.sendMessage(
                            `❌ Cannot send to admin inbox (thread disabled/privacy settings)\n\n` +
                            `📱 Test notification content:\n"${testMsg}"\n\n` +
                            `💡 To fix this issue:\n` +
                            `1. Go to your Facebook inbox\n` +
                            `2. Find messages from this bot account\n` +
                            `3. Enable messages/notifications from this account\n` +
                            `4. Or check your Message Requests folder\n\n` +
                            `⚠️ Bot will NOT send notifications to groups - only to inbox!`,
                            threadID, messageID
                        );
                    } else {
                        api.sendMessage("✅ Test notification sent successfully to admin inbox!", threadID, messageID);
                    }
                });
            } else {
                api.sendMessage("❌ No admin ID configured!", threadID, messageID);
            }
            break;

        case "force":
        case "forcecheck":
            api.sendMessage("🔄 Forcing notification check...", threadID, messageID);
            try {
                const notificationHandler = require('../../includes/handle/handleNotification');
                notificationHandler({ api: api });
                api.sendMessage("✅ Forced notification check completed!", threadID, messageID);
            } catch (error) {
                api.sendMessage(`❌ Error during forced check: ${error}`, threadID, messageID);
            }
            break;
            
        default:
            const currentStatus = global.config.notificationForwarding !== false ? "✅ ENABLED" : "❌ DISABLED";
            api.sendMessage(
                "📱 FACEBOOK NOTIFICATION CONTROL\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "Usage: notification [action]\n\n" +
                "📋 Available Actions:\n" +
                "• on/enable - Enable notification forwarding\n" +
                "• off/disable - Disable notification forwarding\n" +
                "• check/status - Check current status\n" +
                "• test - Send test notification to admin\n" +
                "• force - Force check notifications now\n\n" +
                `🔔 Current Status: ${currentStatus}\n` +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                threadID, messageID
            );
    }
};
