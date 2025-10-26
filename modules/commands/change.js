const axios = require('axios');
const fs = require('fs');

module.exports.config = {
  name: "change",
  version: "1.1.1",
  hasPermssion: 3,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Convert link between pastebin and runmocky",
  commandCategory: "Admin",
  usages: "/test",
  cooldowns: 3,
  usePrefix: false,
};

module.exports.run = async function ({ api, event, args }) {
  if (event.type === 'message_reply' && event.messageReply.body !== '') {
    const attachment = event.messageReply.body;

    if (attachment.includes('pastebin.com')) {
      const pastebinLink = attachment;

      axios.get(pastebinLink).then(response => {
        const sourceCode = response.data;

        axios.post("https://api.mocky.io/api/mock", {
          "status": 200,
          "content": sourceCode,
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "NguyenMinhHuy",
          "expiration": "never"
        })
        .then(function(response) {
          return api.sendMessage(`${response.data.link}`, event.threadID, event.messageID);
        })
        .catch(e => {
          console.log(e);
          return api.sendMessage('⚠️ Error while uploading code from Pastebin to Runmocky!', event.threadID);
        });
      });

    } else if (attachment.includes('run.mocky.io')) {
      const runmockyLink = attachment;

      axios.get(runmockyLink).then(async response => {
        const sourceCode = response.data;
        const { PasteClient } = require('pastebin-api');
        const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");

        async function pastepin(name) {
          const url = await client.createPaste({
            code: sourceCode,
            expireDate: 'N',
            format: "javascript",
            name: name,
            publicity: 1
          });
          var id = url.split('/')[3];
          return 'https://pastebin.com/raw/' + id;
        }

        var name = await generateId();
        var link = await pastepin(name);
        return api.sendMessage(`${link}`, event.threadID);

      }).catch(e => {
        console.log(e);
        return api.sendMessage('⚠️ Error while uploading code from Runmocky to Pastebin!', event.threadID);
      });
    }
  }
}

function generateId() {
  const min = 100000;
  const max = 999999;
  const randomSixDigitId = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomSixDigitId;
}