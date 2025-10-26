
/**
 * @warn Do not edit code or edit credits
 * @author D-Jukie
 * @source Disme Project
 * Modified for notification forwarding
 */
module.exports = function ({ api }) {
    const moment = require("moment-timezone");
    const botID = api.getCurrentUserID();

    // Function to check and send notifications
    const checkNotifications = () => {
        // Check if notification forwarding is enabled
        if (global.config.notificationForwarding === false) {
            return;
        }

        const form = {
            av: botID,
            fb_api_req_friendly_name: "CometNotificationsDropdownQuery",
            fb_api_caller_class: "RelayModern",
            doc_id: "5025284284225032",
            variables: JSON.stringify({
                "count": 20,
                "environment": "MAIN_SURFACE",
                "menuUseEntryPoint": true,
                "scale": 1
            })
        };

        try {
            api.httpPost("https://www.facebook.com/api/graphql/", form, (e, response) => {
                if (e) {
                    console.log(`❌ Error fetching notifications: ${e}`);
                    return;
                }

                try {
                    const data = JSON.parse(response);
                    const notificationsData = data?.data?.viewer?.notifications_page?.edges;

                    if (!notificationsData || notificationsData.length === 0) {
                        console.log("📱 No notifications found");
                        return;
                    }

                    const get_minutes_of_time = (d1, d2) => {
                        let ms1 = d1.getTime();
                        let ms2 = d2.getTime();
                        return Math.ceil((ms2 - ms1) / (60 * 1000));
                    };

                    // Initialize sent notifications tracker if not exists
                    if (!global.sentNotifications) {
                        global.sentNotifications = new Set();
                    }

                    for (let notification of notificationsData) {
                        if (!notification?.node || notification.node.row_type !== 'NOTIFICATION') continue;

                        const notifData = notification.node.notif;
                        if (!notifData) continue;

                        const body = notifData.body?.text || "No message content";
                        const link = notifData.url || "No link available";
                        const timestamp = notifData.creation_time?.timestamp;
                        const time = moment.tz("Asia/Karachi").format("HH:mm:ss DD/MM/YYYY");

                        // Create unique notification ID to prevent duplicates
                        const notificationId = `${timestamp}_${body.substring(0, 50)}`;

                        // Skip if we've already sent this notification
                        if (global.sentNotifications.has(notificationId)) {
                            continue;
                        }

                        // Check if notification is from last 3 minutes
                        if (timestamp && get_minutes_of_time(new Date(timestamp * 1000), new Date()) <= 3) {
                            // Use admin ID from config only (no hardcoded values)
                            const targetAdminID = global.config.ADMINBOT?.[0] || global.config.NDH?.[0];

                            if (targetAdminID) {
                                const msg = "🔔 FACEBOOK NOTIFICATION 🔔\n" +
                                    "━━━━━━━━━━━━━━━━━━━\n" +
                                    "⏰ Time: " + time + "\n" +
                                    "💬 Message: " + body + "\n" +
                                    "🔗 Link: " + link + "\n" +
                                    "━━━━━━━━━━━━━━━━━━━\n" +
                                    "📱 Bot Notification System";

                                // Try sending to admin inbox ONLY - no unsafe fallback
                                api.sendMessage(msg, targetAdminID, (err, info) => {
                                    if (err) {
                                        console.log(`❌ Cannot send to admin inbox (${targetAdminID}): ${err.errorDescription || err.error}`);
                                        console.log(`💡 Notification content: ${body}`);
                                        console.log(`⚠️ Please enable messages from this bot in your Facebook inbox settings`);
                                        console.log(`📋 To fix: Go to Facebook > Messages > Message Requests > Allow messages from bot account`);
                                        
                                        // Mark as attempted to prevent repeated notifications
                                        global.sentNotifications.add(notificationId);
                                    } else {
                                        console.log(`✅ Notification sent to admin inbox successfully!`);
                                        // Mark notification as sent
                                        global.sentNotifications.add(notificationId);
                                    }
                                });
                            } else {
                                console.log("❌ No admin ID found in config!");
                            }
                        }
                    }

                    // Clean up old notification IDs (keep only last 100)
                    if (global.sentNotifications.size > 100) {
                        const notificationArray = Array.from(global.sentNotifications);
                        global.sentNotifications = new Set(notificationArray.slice(-100));
                    }
                } catch (parseError) {
                    console.log(`❌ Error parsing notification response: ${parseError}`);
                }
            });
        } catch(error) {
            console.log(`❌ Error in notification check: ${error}`);
        }
    };

    // Set notification forwarding to enabled by default
    if (typeof global.config.notificationForwarding === 'undefined') {
        global.config.notificationForwarding = true;
    }

    // Check notifications every 90 seconds (more frequent)
    const notificationInterval = setInterval(checkNotifications, 90 * 1000);

    // Initial check after 10 seconds
    setTimeout(checkNotifications, 10 * 1000);

    // Store interval for cleanup if needed
    global.notificationInterval = notificationInterval;

    console.log("📱 Facebook notification forwarder started and enabled!");
    console.log(`📋 Admin ID: ${global.config.ADMINBOT?.[0] || global.config.NDH?.[0] || 'Not found'}`);
};
