module.exports.config = {
  name: "loli",	
  version: "4.0.0", 
  hasPermssion: 0,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Send random loli images", 
  commandCategory: "Image",
  usages: "loli",
  cooldowns: 60
};

module.exports.run = async ({ api, event, args, Threads }) => {
  const request = require('request');
  const fs = require("fs");
  const tdungs = [
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json'),
    require('./../../includes/datajson/loli.json')
  ];

  function vtuanhihi(image, vtuandz, callback) {
    request(image).pipe(fs.createWriteStream(__dirname + `/` + vtuandz)).on("close", callback);
  }

    const numImages = Math.floor(Math.random() * 15) + 1; // Random from 1 to 15
    let imagesDownloaded = 0;
    let attachments = [];

    for (let i = 0; i < numImages; i++) {
      const randomTdung = tdungs[Math.floor(Math.random() * tdungs.length)];
      let image = randomTdung[Math.floor(Math.random() * randomTdung.length)].trim();
      let imgFileName = `image_${i}.png`;
      vtuanhihi(image, imgFileName, () => {
          imagesDownloaded++;
          attachments.push(fs.createReadStream(__dirname + `/${imgFileName}`));
          if (imagesDownloaded === numImages) {
            api.sendMessage({
              body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n✨ Enjoy watching 😍\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
              attachment: attachments
            }, event.threadID, () => {

              for (let img of attachments) {
                fs.unlinkSync(img.path); 
              }
            }, event.messageID);
          }
      });
    }
  }