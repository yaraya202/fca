module.exports.config = {
  name: "setnameall",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  description: "Set nickname for all group members",
  commandCategory: "Admin",
  usages: "[name]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  var threadInfo = await api.getThreadInfo(event.threadID)
  var idtv = threadInfo.participantIDs;
  console.log(threadInfo);
  const name = args.join(" ");
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  for (let setname of idtv) {
    await delay(100)
    api.changeNickname(`${name}`, event.threadID, setname);
  }
}