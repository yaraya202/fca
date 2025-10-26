module.exports.config = {
    name: "antiqtv",
    version: "3.0.0",
    credits: "**Kashif Raza**",
    hasPermssion: 1,
    description: "Prevent changes to group admin rights",
    usages: "Anti-admin change",
    commandCategory: "Admin",
    cooldowns: 0
};

module.exports.run = async({ api, event, Threads, Users}) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage({body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**Bot is not an admin yet!**\n༻﹡﹡﹡﹡﹡﹡﹡༺`}, event.threadID, event.messageID);  
    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["guard"] == "guard" || data["guard"] == false) data["guard"] = true;
    else data["guard"] = false;
    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);  
    return api.sendMessage({body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**Successfully ${(data["guard"] == true) ? "enabled" : "disabled"} the anti-admin change function**\n༻﹡﹡﹡﹡﹡﹡﹡༺`}, event.threadID, event.messageID);
}