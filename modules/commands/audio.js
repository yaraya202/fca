const axios = require("axios");

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports.config = {
  name: 'audio',
  version: "1.0.0",
  hasPermssion: 0,
  credits: "**Kashif Raza**",
  description: "Download audio, video, or images",
  commandCategory: "Utilities",
  usages: "audio + link",
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  if (args.length === 0) {
    return api.sendMessage({
      body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**⚠️ You haven't entered a link. Please use the format: /audio [link] \n Note: Only links with .mp3, .mp4, .gif, .jpg, .jpeg, .png extensions are supported, and multiple links can be separated by spaces.**\n༻﹡﹡﹡﹡﹡﹡﹡༺`
    }, event.threadID);
  }

  const i = (url) => axios.get(url, { responseType: "stream" }).then((r) => r.data);
  let links = args.join(' ').split(/\s+/).map(link => link.trim());

  const validLinks = [];
  const invalidLinks = [];
  const audioLinks = [];
  const videoLinks = [];
  const mediaLinks = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (!isValidUrl(link)) {
      invalidLinks.push(i + 1);
    } else {
      validLinks.push(link);

      if (link.endsWith('.mp3')) {
        audioLinks.push(link);
      } else if (link.endsWith('.mp4')) {
        videoLinks.push(link);
      } else if (link.endsWith('.gif') || link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png')) {
        mediaLinks.push(link);
      } else {
        invalidLinks.push(i + 1);
      }
    }
  }

  if (invalidLinks.length > 0) {
    const errorMessage = `༻﹡﹡﹡﹡﹡﹡﹡༺\n**🔄 Link(s) ${invalidLinks.join(', ')} are not in the correct format. Removing...**\n༻﹡﹡﹡﹡﹡﹡﹡༺`;
    api.sendMessage({ body: errorMessage, attachment: [] }, event.threadID);
  }

  const audioAttachments = await Promise.all(audioLinks.map(async link => ({ type: 'audio', data: await i(link) })));
  const videoAttachments = await Promise.all(videoLinks.map(async link => ({ type: 'video', data: await i(link) })));
  const mediaAttachments = await Promise.all(mediaLinks.map(async link => ({ type: 'media', data: await i(link) })));

  const allAttachments = [...audioAttachments, ...videoAttachments, ...mediaAttachments];

  if (allAttachments.length > 0) {
    let message = `༻﹡﹡﹡﹡﹡﹡﹡༺\n**🔄 Loading ${allAttachments.length} link(s)...**\n༻﹡﹡﹡﹡﹡﹡﹡༺`;
    api.sendMessage({
      body: message,
      attachment: []
    }, event.threadID);

    let audioCount = 0;
    let videoCount = 0;
    let mediaCount = 0;

    for (const attachment of allAttachments) {
      const { type, data } = attachment;
      let body = '';
      if (type === 'audio') {
        audioCount++;
        body = `༻﹡﹡﹡﹡﹡﹡﹡༺\n**✅ Successfully loaded ${audioCount} audio file(s) by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`;
      } else if (type === 'video') {
        videoCount++;
        body = `༻﹡﹡﹡﹡﹡﹡﹡༺\n**✅ Successfully loaded ${videoCount} video(s) by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`;
      } else if (type === 'media') {
        mediaCount++;
        body = `༻﹡﹡﹡﹡﹡﹡﹡༺\n**✅ Successfully loaded ${mediaCount} image(s) by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`;
      }

      await api.sendMessage({
        body,
        attachment: [data]
      }, event.threadID);
    }
    api.sendMessage({
      body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**🔄 Successfully loaded ${audioCount} audio file(s), ${videoCount} video(s), and ${mediaCount} image(s) by **Kashif Raza****\n༻﹡﹡﹡﹡﹡﹡﹡༺`
    }, event.threadID);
  } else {
    api.sendMessage({
      body: `༻﹡﹡﹡﹡﹡﹡﹡༺\n**⚠️ No files available to download.**\n༻﹡﹡﹡﹡﹡﹡﹡༺`
    }, event.threadID);
  }
}