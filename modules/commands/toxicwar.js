const activeThreads = new Set();

module.exports.config = {
    name: "toxicwar",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Send continuous toxic messages to tagged user until stopped",
    commandCategory: "War",
    usages: "toxicwar @mention / toxicwar stop",
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
                "━━━━━━━━━━━━━━━\n⚠️ Toxic war stopped successfully!\n━━━━━━━━━━━━━━━",
                event.threadID
            );
        } else {
            return api.sendMessage(
                "━━━━━━━━━━━━━━━\n❌ Toxic war is not active in this group.\n━━━━━━━━━━━━━━━",
                event.threadID
            );
        }
    }

    const mention = Object.keys(event.mentions)[0];
    if (!mention) {
        return api.sendMessage(
            "━━━━━━━━━━━━━━━\n⚠️ You must tag a user to start toxic war.\n━━━━━━━━━━━━━━━",
            event.threadID
        );
    }

    const name = event.mentions[mention];
    const arraytag = [{ id: mention, tag: name }];
    activeThreads.add(event.threadID);

    const messages = [
        "🔥 Get ready, war has begun!",
        "⚡ You can’t escape now!",
        "💀 Weak moves won’t save you!",
        "🔥 Face me or hide forever!",
        "⚡ I’m faster, louder, stronger!",
        "💀 You’re losing badly already!",
        "🔥 Run? Too late now!",
        "⚡ This heat is unstoppable!",
        "💀 Say goodbye to your pride!",
        "🔥 The toxic storm continues!",
        "━━━━━━━━━━━━━━━\n🔥 END OF WAR ROUND 🔥\n━━━━━━━━━━━━━━━"
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