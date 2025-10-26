const activeThreads = new Set();

module.exports.config = {
    name: "endlesswar",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Send endless toxic spam to tagged user until stopped",
    commandCategory: "War",
    usages: "endlesswar @mention / endlesswar stop",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, args, event }) {
    if (args.length > 0 && args[0] === "stop") {
        if (activeThreads.has(event.threadID)) {
            activeThreads.delete(event.threadID);
            return api.sendMessage(
                "━━━━━━━━━━━━━━━\n⚠️ Endless war stopped successfully!\n━━━━━━━━━━━━━━━",
                event.threadID
            );
        } else {
            return api.sendMessage(
                "━━━━━━━━━━━━━━━\n❌ Endless war is not active in this group.\n━━━━━━━━━━━━━━━",
                event.threadID
            );
        }
    }

    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
        return api.sendMessage(
            "━━━━━━━━━━━━━━━\n⚠️ You must tag a user to start endless war.\n━━━━━━━━━━━━━━━",
            event.threadID
        );
    }

    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    activeThreads.add(event.threadID);

    const messages = [
        "🔥 Get ready, endless war begins!",
        "⚡ You’re trapped now!",
        "💀 Weakness won’t save you!",
        "🔥 Can you handle this?",
        "⚡ Strike after strike!",
        "💀 Your pride is breaking!",
        "🔥 Nowhere to hide!",
        "⚡ This storm won’t stop!",
        "💀 Another defeat incoming!",
        "━━━━━━━━━━━━━━━\n🔥 ENDLESS WAR ROUND COMPLETE 🔥\n━━━━━━━━━━━━━━━"
    ];

    const sendMessages = () => {
        for (let i = 0; i < messages.length; i++) {
            setTimeout(() => {
                if (activeThreads.has(event.threadID)) {
                    api.sendMessage({ body: messages[i] + " " + name, mentions: arraytag }, event.threadID);
                }
            }, i * 5000);
        }
    };

    sendMessages();
};