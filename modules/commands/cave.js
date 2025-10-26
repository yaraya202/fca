const fs = require("fs");
const request = require("request");
const cooldownTime = 86400; // Cooldown time 24 hours

module.exports.config = {
    name: "cave",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Work and earn money",
    commandCategory: "Earning",
    cooldowns: 5,
    envConfig: {
        cooldownTime: cooldownTime
    },
    dependencies: {
        "fs": "",
        "request": ""
    }
};

module.exports.onLoad = () => {
    const fs = require("fs-extra");
    const dirMaterial = __dirname + `/cache/`;
    if (!fs.existsSync(dirMaterial + "cache")) fs.mkdirSync(dirMaterial, { recursive: true });
};

module.exports.handleReply = async ({ event: e, api, handleReply, Currencies }) => {
    const { threadID, messageID, senderID } = e;
    let data = (await Currencies.getData(senderID)).data || {};
    if (handleReply.author != e.senderID) 
        return api.sendMessage("⚠️ This job is not assigned to you.", e.threadID, e.messageID);

    var randomAmount = Math.random();
    var a, msg;

    switch (e.body) {
        case "1":
            if (randomAmount < 0.4) {
                a = Math.floor(Math.random() * (400000 - 200000 + 1)) + 200000;
                msg = `🇻🇳 You worked in Vietnam and earned ${a} VND`;
            } else if (randomAmount < 0.7) {
                a = Math.floor(Math.random() * (600000 - 400000 + 1)) + 400000;
                msg = `🇻🇳 You completed a task in Vietnam and earned ${a} VND`;
            } else if (randomAmount < 0.9) {
                a = Math.floor(Math.random() * (800000 - 600000 + 1)) + 600000;
                msg = `🇻🇳 You worked overtime in Vietnam and earned ${a} VND`;
            } else {
                a = Math.floor(Math.random() * (1000000 - 800000 + 1)) + 800000;
                msg = `🇻🇳 You successfully closed a deal in Vietnam and earned ${a} VND`;
            }
            break;
        case "2":
            if (randomAmount < 0.4) {
                a = Math.floor(Math.random() * (400000 - 200000 + 1)) + 200000;
                msg = `🇨🇳 You worked in China and earned ${a} VND`;
            } else if (randomAmount < 0.7) {
                a = Math.floor(Math.random() * (600000 - 400000 + 1)) + 400000;
                msg = `🇨🇳 You completed a task in China and earned ${a} VND`;
            } else if (randomAmount < 0.9) {
                a = Math.floor(Math.random() * (800000 - 600000 + 1)) + 600000;
                msg = `🇨🇳 You worked overtime in China and earned ${a} VND`;
            } else {
                a = Math.floor(Math.random() * (1000000 - 800000 + 1)) + 800000;
                msg = `🇨🇳 You successfully closed a deal in China and earned ${a} VND`;
            }
            break;
        case "3":
            if (randomAmount < 0.4) {
                a = Math.floor(Math.random() * (400000 - 200000 + 1)) + 200000;
                msg = `🇯🇵 You worked in Japan and earned ${a} VND`;
            } else if (randomAmount < 0.7) {
                a = Math.floor(Math.random() * (600000 - 400000 + 1)) + 400000;
                msg = `🇯🇵 You completed a task in Japan and earned ${a} VND`;
            } else if (randomAmount < 0.9) {
                a = Math.floor(Math.random() * (800000 - 600000 + 1)) + 600000;
                msg = `🇯🇵 You worked overtime in Japan and earned ${a} VND`;
            } else {
                a = Math.floor(Math.random() * (1000000 - 800000 + 1)) + 800000;
                msg = `🇯🇵 You successfully closed a deal in Japan and earned ${a} VND`;
            }
            break;
        case "4":
            if (randomAmount < 0.4) {
                a = Math.floor(Math.random() * (400000 - 200000 + 1)) + 200000;
                msg = `🇹🇭 You worked in Thailand and earned ${a} VND`;
            } else if (randomAmount < 0.7) {
                a = Math.floor(Math.random() * (600000 - 400000 + 1)) + 400000;
                msg = `🇹🇭 You completed a task in Thailand and earned ${a} VND`;
            } else if (randomAmount < 0.9) {
                a = Math.floor(Math.random() * (800000 - 600000 + 1)) + 600000;
                msg = `🇹🇭 You worked overtime in Thailand and earned ${a} VND`;
            } else {
                a = Math.floor(Math.random() * (1000000 - 800000 + 1)) + 800000;
                msg = `🇹🇭 You successfully closed a deal in Thailand and earned ${a} VND`;
            }
            break;
        case "5":
            if (randomAmount < 0.4) {
                a = Math.floor(Math.random() * (400000 - 200000 + 1)) + 200000;
                msg = `🇺🇸 You worked in the USA and earned ${a} VND`;
            } else if (randomAmount < 0.7) {
                a = Math.floor(Math.random() * (600000 - 400000 + 1)) + 400000;
                msg = `🇺🇸 You completed a task in the USA and earned ${a} VND`;
            } else if (randomAmount < 0.9) {
                a = Math.floor(Math.random() * (800000 - 600000 + 1)) + 600000;
                msg = `🇺🇸 You worked overtime in the USA and earned ${a} VND`;
            } else {
                a = Math.floor(Math.random() * (1000000 - 800000 + 1)) + 800000;
                msg = `🇺🇸 You successfully closed a deal in the USA and earned ${a} VND`;
            }
            break;
        case "6":
            if (randomAmount < 0.4) {
                a = Math.floor(Math.random() * (400000 - 200000 + 1)) + 200000;
                msg = `🇰🇭 You worked in Cambodia and earned ${a} VND`;
            } else if (randomAmount < 0.7) {
                a = Math.floor(Math.random() * (600000 - 400000 + 1)) + 400000;
                msg = `🇰🇭 You completed a task in Cambodia and earned ${a} VND`;
            } else if (randomAmount < 0.9) {
                a = Math.floor(Math.random() * (800000 - 600000 + 1)) + 600000;
                msg = `🇰🇭 You worked overtime in Cambodia and earned ${a} VND`;
            } else {
                a = Math.floor(Math.random() * (1000000 - 800000 + 1)) + 800000;
                msg = `🇰🇭 You successfully closed a deal in Cambodia and earned ${a} VND`;
            }
            break;
        default:
            return api.sendMessage("⚠️ Please reply with 1 → 6 to select a country.", e.threadID, e.messageID);
    }

    await Currencies.increaseMoney(e.senderID, parseInt(a));
    api.unsendMessage(handleReply.messageID);

    return api.sendMessage(`${msg}`, threadID, async () => {
        data.work2Time = Date.now();
        await Currencies.setData(senderID, { data });
    });
};

module.exports.run = async ({ event: e, api, handleReply, Currencies }) => {
    const { threadID, messageID, senderID } = e;
    let data = (await Currencies.getData(senderID)).data || {};

    if (typeof data !== "undefined" && cooldownTime - ((Date.now() - data.work2Time) / 1000) > 0) {
        var time = cooldownTime - ((Date.now() - data.work2Time) / 1000),
            seconds = Math.floor((time % 60)),
            minutes = Math.floor((time / 60) % 60),
            hours = Math.floor((time / (60 * 60)) % 24);

        return api.sendMessage(
            `⚠️ You need to wait ${hours} hours ${minutes} minutes ${seconds} seconds before working again.`,
            e.threadID,
            e.messageID
        );
    } else {
        var msg = {
            body: "====== WORK LOCATIONS ======" + `\n` +
                "\n1. Vietnam 🇻🇳" +
                "\n2. China 🇨🇳" +
                "\n3. Japan 🇯🇵" +
                "\n4. Thailand 🇹🇭" +
                "\n5. USA 🇺🇸" +
                "\n6. Cambodia 🇰🇭" +
                `\n\n💬 Reply to this message to choose your work location`
        };
        return api.sendMessage(msg, e.threadID, (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: e.senderID,
                messageID: info.messageID
            });
        });
    }
};