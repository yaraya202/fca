module.exports.config = {
    name: "leavenoti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Enable or disable notifications when a member leaves the group",
    commandCategory: "Admin",
    usages: "[on/off]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, Threads, args }) {
    const { threadID, messageID } = event;
    let threadData = await Threads.getData(threadID);
    let data = threadData.data || {};

    if (args.length === 0) {
        return api.sendMessage(
            "⚝──⭒─⭑─⭒──⚝\n\n⚠️ 𝗨𝘀𝗮𝗴𝗲: 𝗹𝗲𝗮𝘃𝗲𝗻𝗼𝘁𝗶 [𝗼𝗻/𝗼𝗳𝗳] 𝘁𝗼 𝗲𝗻𝗮𝗯𝗹𝗲 𝗼𝗿 𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗹𝗲𝗮𝘃𝗲 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀.\n\n⚝──⭒─⭑─⭒──⚝", 
            threadID, messageID
        );
    }

    if (args[0].toLowerCase() === "on") {
        data.leaveNoti = true;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        return api.sendMessage(
            "≿━━━━༺❀༻━━━━≾\n\n✅ 𝗟𝗲𝗮𝘃𝗲 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗲𝗻𝗮𝗯𝗹𝗲𝗱 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽.\n\n≿━━━━༺❀༻━━━━≾", 
            threadID, messageID
        );
    }

    if (args[0].toLowerCase() === "off") {
        data.leaveNoti = false;
        await Threads.setData(threadID, { data });
        global.data.threadData.set(threadID, data);
        return api.sendMessage(
            "༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝗟𝗲𝗮𝘃𝗲 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝗵𝗮𝘃𝗲 𝗯𝗲𝗲𝗻 𝗱𝗶𝘀𝗮𝗯𝗹𝗲𝗱 𝗳𝗼𝗿 𝘁𝗵𝗶𝘀 𝗴𝗿𝗼𝘂𝗽.\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", 
            threadID, messageID
        );
    }

    return api.sendMessage(
        "⚝──⭒─⭑─⭒──⚝\n\n⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗼𝗽𝘁𝗶𝗼𝗻! 𝗣𝗹𝗲𝗮𝘀𝗲 𝘂𝘀𝗲: 𝗹𝗲𝗮𝘃𝗲𝗻𝗼𝘁𝗶 [𝗼𝗻/𝗼𝗳𝗳].\n\n⚝──⭒─⭑─⭒──⚝", 
        threadID, messageID
    );
};