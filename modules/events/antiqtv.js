module.exports.config = {
    name: "antiqtv",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "D-Jukie",
    description: "Prevent changes to admin status",
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const { logMessageType, logMessageData, senderID } = event;
    let data = (await Threads.getData(event.threadID)).data;
    if (data.guard == false) return;
    if (data.guard == true) {
        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    if (event.author == api.getCurrentUserID()) return;
                    if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;
                    else {
                        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false);
                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("» Haha, silly! 😝", event.threadID, event.messageID);
                            return api.sendMessage(`🔄 Bot detected someone added a user as a Group Admin, activating anti-takeover mode...`, event.threadID, event.messageID);
                        }
                    }
                }
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    if (event.author == api.getCurrentUserID()) return;
                    if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;
                    else {
                        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true);
                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("» Haha, silly! 😝", event.threadID, event.messageID);
                            return api.sendMessage(`🔄 Bot detected someone removed a Group Admin, activating anti-takeover mode...`, event.threadID, event.messageID);
                        }
                    }
                }
            }
        }
    }
}