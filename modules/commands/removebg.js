module.exports.config = {
    name: 'removebg',
    version: '1.1.1',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Remove background from images',
    commandCategory: 'Utility',
    usages: 'Reply to an image or provide image URL',
    cooldowns: 2,
    timezone: "Asia/Karachi",
    dependencies: {
         'form-data': '',
         'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const { image } = require('image-downloader');

module.exports.run = async function({ api, event, args }) {
    try {
        let successMsg = `≿━━━━༺❀༻━━━━≾\n\n🖼️ Background removed successfully!\n\n≿━━━━༺❀༻━━━━≾`;

        if (event.type !== "message_reply") 
            return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n⚠️ You must reply to an image\n\n⚝──⭒─⭑─⭒──⚝", event.threadID, event.messageID);

        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) 
            return api.sendMessage("༻﹡﹡﹡﹡﹡﹡﹡༺\n\n⚠️ Please reply with an image\n\n༻﹡﹡﹡﹡﹡﹡﹡༺", event.threadID, event.messageID);

        if (event.messageReply.attachments[0].type != "photo") 
            return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n⚠️ This is not an image\n\n≿━━━━༺❀༻━━━━≾", event.threadID, event.messageID);

        const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
        const KeyApi = [
            "t4Jf1ju4zEpiWbKWXxoSANn4","CTWSe4CZ5AjNQgR8nvXKMZBd",
            "PtwV35qUq557yQ7ZNX1vUXED","wGXThT64dV6qz3C6AhHuKAHV",
            "82odzR95h1nRp97Qy7bSRV5M","4F1jQ7ZkPbkQ6wEQryokqTmo",
            "4F1jQ7ZkPbkQ6wEQryokqTmo","sBssYDZ8qZZ4NraJhq7ySySR",
            "NuZtiQ53S2F5CnaiYy4faMek","f8fujcR1G43C1RmaT4ZSXpwW"
        ];
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);

        await image({ url: content, dest: inputPath });

        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
            },
            encoding: null
        })
        .then((response) => {
            if (response.status != 200) 
                return console.error('Error:', response.status, response.statusText);

            fs.writeFileSync(inputPath, response.data);
            return api.sendMessage(
                { body: successMsg, attachment: fs.createReadStream(inputPath) }, 
                event.threadID, 
                () => fs.unlinkSync(inputPath)
            );
        })
        .catch((error) => {
            return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n❌ Request failed, please try again later.\n\n⚝──⭒─⭑─⭒──⚝", event.threadID, event.messageID);
        });
    } catch (e) {
        console.log(e);
        return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❌ An unexpected error occurred.\n\n≿━━━━༺❀༻━━━━≾", event.threadID, event.messageID);
    }
};