
module.exports.config = {
    name: 'comments',
    version: '1.0.0',
    hasPermssion: 2,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'Post multiple comments on Facebook posts',
    commandCategory: 'Admin',
    usages: '.comments <post_id/link> <number_of_comments>',
    cooldowns: 5
};

const fs = require('fs-extra');
const path = require('path');

const comments = [
    "👍ŚŮPËŖ_GREAT💖",
    "#Copl 😍",
    "#Osm",
    "#beautiful_løōk 😍",
    "Gajab Pic Bro😍",
    "💖❄🎸👉#A__ONE👈🎸❄💖",
    "Looking😎 Handsome",
    "#SUPER★••😎",
    "#AWESOME★••😎",
    "#EXELLENT ★••😎",
    "#GREAT ★••😎",
    "#AMAZING★••😎",
    "Pretty 😍",
    "Cute 🥰",
    "Super 😍",
    "Lovely 😍",
    "😲Sach me GJB😁",
    "⫷ Impressive Pic ⫸",
    "😘So Cute Baby 🥰",
    "Dapper vibes! 💥",
    "Looking sharp as always, bro! 🔥",
    "That outfit is straight fire! 🔥",
    "Killing it with those looks, man! 👌",
    "Stepping up the style game, I see! 👏",
    "Classy and confident, just how it should be! 🙌",
    "Styled to perfection! 💯",
    "A true trendsetter in the making! 🌟",
    "Can't deny the swag in this pic! 😎",
    "Bringing the cool factor to the gram! ❄️",
    "Slaying with that attitude and fashion sense! 💪",
    "Outfit goals right there! 🙏",
    "Confidence level: off the charts! 💥",
    "Casual yet effortlessly stylish! 👌",
    "Fashion game strong, bro! 💪",
    "Rocking that look like a pro! 🚀",
    "Too cool for school! 😎",
    "Style icon in the making! 🌟",
    "Strutting your stuff with confidence! 💃",
    "Simply suave! 👔",
    "💖 So Nice Pic Dear 💖",
    "⫷Awesome Look⫸",
    "Lovely Picture",
    "꧁➖🖤 Nice Pic 🖤➖꧂",
    "➽—🖤 Lovely Pic🖤—➽",
    "👌👌Banda Kdk Hai🤘",
    "♡Very♡ nice ♡Pic♡",
    "Ladkiya To Ab Gayi 😉😎",
    "Aag Lagadi Bhai😎",
    "WOW SUPER Bro",
    "Cool 👑",
    "Osm 👑",
    "Jakkas 👑",
    "AWESOME BRO",
    "🖤😘Million-dollar Pic😘🖤",
    "꧁🖤♥️Mind-blowing ♥️🖤꧂",
    "Super❥━━❥",
    "Jakkar ❥━━❥",
    "Brilliant and Intelligent 👌",
    "#Kadak😍",
    "#Fantastic😎",
    "#superb😍👌👌🌹",
    "Very Nice",
    "Awesome",
    "Beautiful",
    "Super",
    "Sweet",
    "Cute",
    "Handsome",
    "Jakkas",
    "Zabardast",
    "Lovely",
    "Classic",
    "So Sweet",
    "Smart",
    "Nicely",
    "Wonderful",
    "Greatest",
    "Perfect",
    "KILLER PIC BRO",
    "Very Nice",
    "Love U Bhai 🖤",
    "Insta King 🌹",
    "#_So_Cute",
    "Wonderful BRO",
    "Gajab",
    "Look",
    "SO Nice✨",
    "SO Cute✨",
    "SO Beautiful 🌺",
    "Fantacy bro🖤",
    "#Super☝️",
    "#Hit☝️",
    "#Bhai ki Pic ☝️",
    "Baap ke comment 😉",
    "Mast Pic Dear",
    "Awesome 👍",
    "꧁Gajab꧂",
    "꧁Nice꧂",
    "꧁Lovely꧂",
    "꧁Stylish꧂",
    "꧁Funny꧂",
    "꧁Excellent꧂",
    "One Like for brother 🖤",
    "Always fresh vibe 😎",
    "Sharp and savage",
    "Legend mode on 👑",
    "Coolest ever bro",
    "Big boss energy 💯",
    "Too much drip",
    "Ice cold swag ❄️",
    "Next level bro 🚀"
];

let isCommenting = false;

// Function to extract post ID from Facebook links
function extractPostId(input) {
    // If it's already a numeric ID, return it
    if (/^\d+$/.test(input)) {
        return input;
    }
    
    // Extract from various Facebook URL formats
    const patterns = [
        /\/posts\/(\d+)/,
        /\/p\/([a-zA-Z0-9]+)/,
        /story_fbid=(\d+)/,
        /fbid=(\d+)/,
        /\/(\d+)$/,
        /share\/p\/([a-zA-Z0-9]+)/
    ];
    
    for (let pattern of patterns) {
        const match = input.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return null;
}

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    try {
        if (args.length < 2) {
            return api.sendMessage("⚝──⭒─⭑─⭒──⚝\n\n📝 𝐔𝐬𝐚𝐠𝐞: .comments <post_id/link> <number_of_comments>\n\n💡 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: \n• .comments 123456789 50\n• .comments https://www.facebook.com/share/p/1743Z8CwyB/ 30\n\n⚝──⭒─⭑─⭒──⚝", threadID, messageID);
        }

        const postInput = args[0];
        const numberOfComments = parseInt(args[1]);

        // Extract post ID from input
        const postId = extractPostId(postInput);
        
        if (!postId) {
            return api.sendMessage("⚠️ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐩𝐨𝐬𝐭 𝐈𝐃 𝐨𝐫 𝐥𝐢𝐧𝐤! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐩𝐨𝐬𝐭 𝐈𝐃 𝐨𝐫 𝐥𝐢𝐧𝐤.", threadID, messageID);
        }

        if (isNaN(numberOfComments) || numberOfComments <= 0) {
            return api.sendMessage("⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫 𝐨𝐟 𝐜𝐨𝐦𝐦𝐞𝐧𝐭𝐬!", threadID, messageID);
        }

        if (numberOfComments > 150) {
            return api.sendMessage("⚠️ 𝐌𝐚𝐱𝐢𝐦𝐮𝐦 𝟏𝟓𝟎 𝐜𝐨𝐦𝐦𝐞𝐧𝐭𝐬 𝐚𝐥𝐥𝐨𝐰𝐞𝐝 𝐚𝐭 𝐨𝐧𝐜𝐞!", threadID, messageID);
        }

        if (isCommenting) {
            return api.sendMessage("⚠️ 𝐀 𝐜𝐨𝐦𝐦𝐞𝐧𝐭 𝐩𝐫𝐨𝐜𝐞𝐬𝐬 𝐢𝐬 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 𝐫𝐮𝐧𝐧𝐢𝐧𝐠! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭.", threadID, messageID);
        }

        isCommenting = true;

        const startMessage = `⚝──⭒─⭑─⭒──⚝\n\n🚀 𝐂𝐨𝐦𝐦𝐞𝐧𝐭 𝐒𝐩𝐚𝐦 𝐒𝐭𝐚𝐫𝐭𝐞𝐝!\n\n📊 𝐏𝐨𝐬𝐭 𝐈𝐃: ${postId}\n💬 𝐂𝐨𝐦𝐦𝐞𝐧𝐭𝐬: ${numberOfComments}\n⏱️ 𝐒𝐩𝐞𝐞𝐝: 3 seconds per comment\n\n⚝──⭒─⭑─⭒──⚝`;
        
        await api.sendMessage(startMessage, threadID, messageID);

        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < numberOfComments; i++) {
            try {
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                
                // Updated comment approach with proper form data
                let fb_dtsg = "";
                try {
                    const appState = api.getAppState();
                    const dtsgCookie = appState.find(x => x.key === "fb_dtsg");
                    fb_dtsg = dtsgCookie ? dtsgCookie.value : "";
                } catch (e) {
                    console.log("Error getting fb_dtsg:", e.message);
                }

                const form = {
                    av: api.getCurrentUserID(),
                    fb_dtsg: fb_dtsg,
                    fb_api_caller_class: "RelayModern",
                    fb_api_req_friendly_name: "CometUFICreateCommentMutation",
                    variables: JSON.stringify({
                        input: {
                            feedback_id: postId,
                            message: {
                                text: randomComment,
                                ranges: []
                            },
                            attachments: [],
                            client_mutation_id: Math.random().toString(36).substr(2, 9)
                        }
                    }),
                    doc_id: "7804956306228855"
                };

                const response = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error("Request timeout")), 10000);
                    
                    api.httpPost("https://www.facebook.com/api/graphql/", form, (err, data) => {
                        clearTimeout(timeout);
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                });

                if (response && typeof response === 'string') {
                    // Check for success indicators
                    if (response.includes('"data"') && !response.includes('"errors"') && !response.includes('error')) {
                        successCount++;
                        console.log(`Comment ${i + 1}/${numberOfComments}: "${randomComment}" - Success`);
                    } else {
                        failedCount++;
                        console.log(`Comment ${i + 1}/${numberOfComments}: "${randomComment}" - Failed: ${response.substring(0, 100)}`);
                    }
                } else {
                    failedCount++;
                    console.log(`Comment ${i + 1}/${numberOfComments}: "${randomComment}" - Failed: Invalid response`);
                }

            } catch (error) {
                failedCount++;
                console.log(`Comment ${i + 1}/${numberOfComments}: Failed - ${error.message}`);
            }

            // Wait 3 seconds before next comment
            if (i < numberOfComments - 1) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        isCommenting = false;

        const completionMessage = `⚝──⭒─⭑─⭒──⚝\n\n✅ 𝐂𝐨𝐦𝐦𝐞𝐧𝐭 𝐒𝐩𝐚𝐦 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞𝐝!\n\n📊 𝐒𝐭𝐚𝐭𝐢𝐬𝐭𝐢𝐜𝐬:\n✅ 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥: ${successCount}\n❌ 𝐅𝐚𝐢𝐥𝐞𝐝: ${failedCount}\n📊 𝐓𝐨𝐭𝐚𝐥: ${numberOfComments}\n\n⚝──⭒─⭑─⭒──⚝`;
        
        await api.sendMessage(completionMessage, threadID, messageID);

    } catch (error) {
        isCommenting = false;
        console.error('Error in comments command:', error);
        return api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐨𝐬𝐭𝐢𝐧𝐠 𝐜𝐨𝐦𝐦𝐞𝐧𝐭𝐬! 𝐏𝐥𝐞𝐚𝐬𝐞 𝐜𝐡𝐞𝐜𝐤 𝐲𝐨𝐮𝐫 𝐥𝐢𝐧𝐤/𝐈𝐃.", threadID, messageID);
    }
};
