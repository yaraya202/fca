module.exports.config = {
	name: "locmemdie",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Filter locked Facebook accounts",
	commandCategory: "Admin",
	usages: "",
	cooldowns: 0
};

module.exports.run = async function({ api, event }) {
    var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);    
    var success = 0, fail = 0;
    var arr = [];
    for (const e of userInfo) {
        if (e.gender == undefined) {
            arr.push(e.id);
        }
    };

    adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
    if (arr.length == 0) {
        return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❎ No locked accounts found in the group\n\n≿━━━━༺❀༻━━━━≾", event.threadID);
    }
    else {
        api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n🔎 Your group currently has " + arr.length + " locked accounts\n\n≿━━━━༺❀༻━━━━≾", event.threadID, function () {
            if (!adminIDs) {
                api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ But the bot is not an admin, so it cannot filter\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID);
            } else {
                api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n🔄 Starting filter...\n\n⚝──⭒─⭑─⭒──⚝", event.threadID, async function() {
                    for (const e of arr) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await api.removeUserFromGroup(parseInt(e), event.threadID);   
                            success++;
                        }
                        catch {
                            fail++;
                        }
                    }
                  
                    api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n✅ Successfully filtered " + success + " accounts\n\n≿━━━━༺❀༻━━━━≾", event.threadID, function() {
                        if (fail != 0) return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❎ Failed to filter " + fail + " accounts\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID);
                    });
                })
            }
        })
    }
}