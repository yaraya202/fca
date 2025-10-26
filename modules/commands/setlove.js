const fs = require('fs-extra');
const axios = global.nodemodule["axios"];
const path = require("path");
const dataPath = path.resolve(__dirname, 'data', 'setlove.json');
const imagesPath = path.resolve(__dirname, 'data', 'setlove');

module.exports.config = {
    name: "setlove",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
    description: "Set love system",
    commandCategory: "Love",
    usages: "setlove + |set @tag|check|del|edit|display",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.onLoad = async () => {
    if (!await fs.pathExists(dataPath)) {
        await fs.ensureFile(dataPath);
        await fs.writeFile(dataPath, JSON.stringify([]));
    }
    if (!await fs.pathExists(imagesPath)) {
        await fs.mkdir(imagesPath);
    }
};

module.exports.run = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const now = Date.now();
    const userImagesPath = path.resolve(imagesPath, senderID.toString());
    const doesExist = await fs.pathExists(userImagesPath);
    if (!doesExist) {
        await fs.mkdir(userImagesPath);
    }
    let loveData = [];
    try {
        loveData = JSON.parse(await fs.readFile(dataPath));
    } catch (error) {
        console.error("Error reading or parsing setlove.json:", error);
        loveData = [];
    }
    const command = args[0];
    if (command === "set") {
        if (Object.keys(mentions).length === 0) {
            return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❎ Please tag a person to set love.\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
        }
        const taggedUserID = Object.keys(mentions)[0];
        const taggedUserName = mentions[taggedUserID];
        const existingRelationship = loveData.find(relationship =>
            relationship.person1 === senderID || relationship.person2 === senderID ||
            relationship.person1 === taggedUserID || relationship.person2 === taggedUserID
        );
        if (existingRelationship) {
            const existingPartnerID = existingRelationship.person1 === senderID ? existingRelationship.person2 : existingRelationship.person1;
            const existingPartnerInfo = await api.getUserInfo(existingPartnerID);
            const existingPartnerName = existingPartnerInfo[existingPartnerID].name;

            if (existingRelationship.person1 === senderID || existingRelationship.person2 === senderID) {
                return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n❎ You cannot cheat on your partner.\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
            } else {
                return api.sendMessage(`⚝──⭒─⭑─⭒──⚝\n\n❎ You cannot steal ${existingPartnerName}'s lover.\n\n⚝──⭒─⭑─⭒──⚝`, threadID, messageID);
            }
        }
        api.sendMessage({
            body: `${taggedUserName}, do you accept a love request from ${senderID}?\nBoth of you must react to this message to accept!`,
            mentions: [{ tag: taggedUserName, id: taggedUserID }]
        }, threadID, (error, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                taggedUserID: taggedUserID,
                taggedUserName: taggedUserName,
                hasSenderReacted: false,
                hasTaggedUserReacted: false,
                type: "awaitReaction"
            });
        }, messageID);
    } else if (command === "check") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (relationship) {
            const partnerID = relationship.person1 === senderID ? relationship.person2 : relationship.person1;
            const partnerInfo = await api.getUserInfo(partnerID);
            const partnerName = partnerInfo[partnerID].name;
            const setloveDate = new Date(relationship.date);
            const duration = Math.floor((now - setloveDate.getTime()) / (1000 * 60));
            const months = Math.floor(duration / (60 * 24 * 30));
            const days = Math.floor((duration % (60 * 24 * 30)) / (60 * 24));
            const hours = Math.floor((duration % (60 * 24)) / 60);
            const minutes = duration % 60;
            const selectedImages = relationship.selectedImages || [];
            const images = await fs.readdir(userImagesPath);
            const attachments = selectedImages
                .filter(img => images.includes(img)) 
                .map(img => fs.createReadStream(path.resolve(userImagesPath, img)));
            return api.sendMessage({
                body: `💖 The love between you and ${partnerName} has lasted ${months} months, ${days} days, ${hours} hours, ${minutes} minutes.`,
                attachment: attachments
            }, threadID, messageID);
        } else {
            return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❎ You don’t have a lover yet.\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
        }        
    } else if (command === "del") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (!relationship) {
            return api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n❎ You don’t have a lover to cancel.\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
        }
        const partnerID = relationship.person1 === senderID ? relationship.person2 : relationship.person1;
        const partnerName = (await api.getUserInfo(partnerID))[partnerID].name;
        api.sendMessage({
            body: `${partnerName}, do you agree to cancel set love?\nReact to this message to confirm.`,
            mentions: [{
                tag: partnerName,
                id: partnerID
            }]
        }, threadID, (error, info) => {
            global.client.handleReaction.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                partnerID: partnerID,
                partnerName: partnerName,
                type: "cancel"
            });
        }, messageID);
        setTimeout(async () => {
            let loveData = [];
            try {
                loveData = JSON.parse(await fs.readFile(dataPath));
            } catch (error) {
                console.error("Error reading or parsing setlove.json:", error);
            }
            loveData = loveData.filter(rel =>
                !(rel.person1 === senderID && rel.person2 === partnerID) &&
                !(rel.person1 === partnerID && rel.person2 === senderID)
            );
            const user1ImagesPath = path.resolve(imagesPath, senderID.toString());
            const user2ImagesPath = path.resolve(imagesPath, partnerID.toString());
            try {
                if (await fs.pathExists(user1ImagesPath)) {
                    await fs.remove(user1ImagesPath); 
                }
                if (await fs.pathExists(user2ImagesPath)) {
                    await fs.remove(user2ImagesPath); 
                }
            } catch (error) {
                console.error("Error deleting user album directories:", error);
            }
            await fs.writeFile(dataPath, JSON.stringify(loveData));
            api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n🔄 Proceeding to delete entire album...\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
        }, 60 * 1000); 
    } else if (command === "album") {
        if (!await fs.pathExists(userImagesPath)) {
            return api.sendMessage("❎ You don’t have any images in your album.", threadID, messageID);
        }
        const images = await fs.readdir(userImagesPath);
        const attachments = images.map(file => fs.createReadStream(path.resolve(userImagesPath, file)));
        api.sendMessage({
            body: "Here’s your album:",
            attachment: attachments
        }, threadID, messageID);
    } else if (command === "edit") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (!relationship) {
            return api.sendMessage("❎ You don’t have a lover to edit the album.", threadID, messageID);
        }
        api.sendMessage("Please choose an option:\n1. Add image\n2. Delete image\n3. Replace image", threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "editAlbum"
            });
        }, messageID);   
    } else if (command === "display") {
        const relationship = loveData.find(rel =>
            rel.person1 === senderID || rel.person2 === senderID
        );
        if (!relationship) {
            return api.sendMessage("❎ You don’t have a lover yet.", threadID, messageID);
        }
        const images = await fs.readdir(userImagesPath);
        if (images.length === 0) {
            return api.sendMessage("❎ Your album is empty.", threadID, messageID);
        }
        const selectedImages = relationship.selectedImages || [];
        const imageList = images.map((img, index) => {
            const isSelected = selectedImages.includes(img);
            return `${index + 1}. ${img} - ${isSelected ? 'Selected ✅' : 'Not Selected ❌'}`;
        }).join("\n");
        const bodyMessage = `Choose the number corresponding to the image you want to display:\n${imageList}`;
        const attachments = images.map(img => fs.createReadStream(path.resolve(userImagesPath, img)));
        api.sendMessage({
            body: bodyMessage,
            attachment: attachments
        }, threadID, messageID);
    } else {
        api.sendMessage("≿━━━━༺❀༻━━━━≾\n\n[ SET LOVE ]\n\n- setlove set @tag → Set love\n- setlove check → Check how long together\n- setlove del → Cancel set love\n- setlove album → View album\n- setlove edit → Add, delete or replace images\n- setlove display → Choose images to display\n\n≿━━━━༺❀༻━━━━≾", threadID, messageID);
    }
};