module.exports.config = {
  name: "prefix",	
  version: "2.0.0", 
  hasPermssion: 0,
  credits: "jordanofficial",
  description: "sos", 
  commandCategory: "noprefix",
  usages: "prefix",
  cooldowns: 0
};
module.exports.languages = {
  "vi": {},
  "en": {}
};

function random(arr) {
var rd = arr[Math.floor(Math.random() * arr.length)];
    return rd;
        };
module.exports.handleEvent = async function ({ api, event, Threads }) {
  const axios = require("axios")
  const picture = (await axios.get(`https://imgur.com/m4ruygS.jpg`, { responseType: "stream"})).data
      const moment = require("moment-timezone");
var gio = moment.tz("Asia/karachi").format("HH:mm:ss || D/MM/YYYY");
  var thu =
moment.tz('Asia/karachi').format('dddd');
  if (thu == 'Sunday') thu = 'sunday'
  if (thu == 'Monday') thu = 'monday'
  if (thu == 'Tuesday') thu = 'tuesday'
  if (thu == 'Wednesday') thu = 'wednesday'
  if (thu == "Thursday") thu = 'thursday'
  if (thu == 'Friday') thu = 'friday'
  if (thu == 'Saturday') thu = 'saturday'
  var { threadID, messageID, body } = event,{ PREFIX } = global.config;
  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;
  const icon = [""];
  if (body.toLowerCase() == "prefix" || (body.toLowerCase() == "prefix bot là gì") ||  (body.toLowerCase() == "quên prefix r") || (body.toLowerCase() == "qlam")) {
       api.sendMessage({body: `====『 𝗣𝗥𝗘𝗙𝗜𝗫 』====\n━━━━━━━━━━━━━━━━\n[➽]→ The box's prefix í: ${prefix}\n[➽]→ The system preset í: ${global.config.PREFIX}\n[➽]→ Currently the bot is available ${client.commands.size} Usable command\n[➽] Total bot users: ${global.data.allUserID.length}\n[➽] Total Group: ${global.data.allThreadID.length}\n[➽] Now: ${gio} (${thu})\n[➽]→ Release emotions "❤" Go to this message to view trade orders `, attachment: (await axios.get((await axios.get(`https://qlam-api.trieutaitan3.repl.co/images/phongcanhanime`)).data.data, {
                    responseType: 'stream'
                })).data}, event.threadID, (err, info) => {
    global.client.handleReaction.push({
      name: this.config.name, 
      messageID: info.messageID,
      author: event.senderID,
    })
      },event.messageID);
  }
 }
//ko api thì attachment: (picture)}, event.threadID, event.messageID);
module.exports.run = async ({ api, event, args, Threads }) => {
                          }
module.exports.handleReaction = async ({ event, api, handleReaction, Currencies, Users}) => {
  const time = process.uptime(),
    h = Math.floor(time / (60 * 60)),
    p = Math.floor((time % (60 * 60)) / 60),
    s = Math.floor(time % 60);
  const axios = global.nodemodule["axios"];
const fs = global.nodemodule["fs-extra"];
const { threadID, messageID, userID } = event;
if (event.userID != handleReaction.author) return;
if (event.reaction != "❤") return;
 api.unsendMessage(handleReaction.messageID);
        //var msg = `===== [ Information BoT ] =====\n\n💜 Present ${global.config.BOTNAME} Was online ${h} Hour ${p} Minute ${s} second\n⚙️ The current version of the bot: ${global.config.version}\n🔗 Commands: ${client.commands.size}\n🖨️ Current: ${client.events.size} Show Event\n👥 Total Users: ${global.data.allUserID.length}\n🏘️ Total Group: ${global.data.allThreadID.length}\n💓 𝗣𝗿𝗲𝗳𝗶𝘅 𝗯𝗼𝘁: ${global.config.PREFIX}`
    var msg =`🪐 === [ 𝗠𝗨𝗟𝗧𝗜𝗣𝗟𝗘 𝗨𝗦𝗘𝗗 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ] === 🪐
      ━━━━━━━━━━━━━━━━━━
🪐 Spear commands are used 🪐
🪐 === [ Group 0or Box  ] === 🪐
━━━━━━━━━━━━━━━━━━
🫂 !Help: If you want to see all commands the bot há
💞 !CheckTT:  To see the number of messages you have received
👤 !InFo: View information 
🌷 ! Check: If you want to see the commands about check
💕 !Box: To view information about bót
☠️ ! Locate: Filter out the members who don't work
💝 !SetName + Name: Set knows your name in the group
━━━━━━━━━━━━━━━━━━
💜 === [ Games In Entertainment ] === 💜
━━━━━━━━━━━━━━━━━━
💍 !Pair: Canvas Version 
🕊️ !Pair: Also the compound is the thider version
😻 !Pair: pair The Reply Version 
━━━━━━━━━━━━━━━━━━
🎵 === [ ViDeo 0or Music ] === 🎵
━━━━━━━━━━━━━━━━━━
💓 ! YouTube: Download Clips on YT
🎥 ! TikTok: Tiktok video use command for details
🎼 !Sing: play Songs
📺 !AuToDown: Auto download video when url is detected
━━━━━━━━━━━━━━━━━━
💜 === [ BENEFITS ] === 💜
━━━━━━━━━━━━━━━━━━
🔗 !Imgur + Reply Pic & GiF 
💗 !Ntn & Reply 
🌹 !Avt: Admin 
💞 !QR + Reply Text
📆 !Age + used Command See Details 
━━━━━━━━━━━━━━━━━━
💜 ===『 BOT 』=== 💜`
        return api.sendMessage({body: msg, attachment: (await axios.get((await axios.get(`https://qlam-api.trieutaitan3.repl.co/images/phongcanhanime`)).data.data,  {
                    responseType: 'stream'
                })).data},event.threadID); 
    }