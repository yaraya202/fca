module.exports = {
    config: {
      name: 'catbox',
      commandCategory: 'Utility',
      hasPermssion: 0,
      credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
      usages: 'Convert image, video, gif to catbox link',
      description: 'Upload image, video, GIF to Catbox',
      cooldowns: 0
    },
    run: async (o) => {
      const send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
      
      if (o.event.type !== "message_reply") {
        return send("⚠️ Invalid image, please reply to a video, image or gif");
      }
      
      let msg = [];
      
      for (const attachment of o.event.messageReply.attachments) {
        try {
          const response = await require('axios').get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(attachment.url)}`);
          msg.push(`${response.data.url}`);
        } catch (error) {
          console.error(`Failed to upload ${attachment.url}:`, error);
          msg.push(`⚠️ Unable to upload ${attachment.url}`);
        }
      }
      
      if (msg.length === 0) {
        return send("⚠️ No link was created.");
      }
      
      return send(msg.join(',\n'));
    }
};