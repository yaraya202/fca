const p = "😠";
const a = "👍";
const { resolve: b } = require("path");
const { existsSync: q, writeFileSync: j } = require("fs-extra");
const e = b(__dirname, "cache/data/camtu.json");

module.exports.config = {
  name: "wordban",
  version: "1.0.0",
  credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
  hasPermssion: 1,
  description: "Warn or remove members who use banned words",
  usages: "wordban on/off add/del list",
  commandCategory: "Admin",
  cooldowns: 0,
};

module.exports.run = async ({ api: f, event: a, args: b }) => {
  if (!q(e)) {
    try {
      j(e, JSON.stringify({}, null, "\t"));
    } catch (b) {
      console.log(b);
    }
  }
  const c = require("cache/data/camtu.json");
  const d = await f.getThreadInfo(a.threadID);
  if (!c.hasOwnProperty(a.threadID)) {
    c[a.threadID] = { data: {} };
    j(e, JSON.stringify(c, null, "\t"));
  }
  const g = c[a.threadID].data || {};
  if (!g.camtu) {
    g.camtu = { words: [], enables: false };
    j(e, JSON.stringify(c, null, "\t"));
  }
  if (b[0] == "on") {
    g.camtu.enables = true;
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage("━━━━━━━━━━━━━━━━━━\n✅ Auto word ban has been enabled.\n━━━━━━━━━━━━━━━━━━", a.threadID, a.messageID);
  } else if (b[0] == "off") {
    g.camtu.enables = false;
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage("━━━━━━━━━━━━━━━━━━\n❌ Auto word ban has been disabled.\n━━━━━━━━━━━━━━━━━━", a.threadID, a.messageID);
  } else if (b[0] == "add") {
    if (!b[1]) return f.sendMessage("━━━━━━━━━━━━━━━━━━\n⚠️ Please enter the word(s) to add to the ban list.\n━━━━━━━━━━━━━━━━━━", a.threadID, a.messageID);
    const i = b.slice(1).join(" ");
    let d = i.split(",").map((b) => b.trim());
    d = d.filter((b) => !g.camtu.words.includes(b));
    g.camtu.words.push(...d);
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage(`━━━━━━━━━━━━━━━━━━\n✅ Added ${d.length} word(s) to the ban list.\n━━━━━━━━━━━━━━━━━━`, a.threadID, a.messageID);
  } else if (b[0] == "del") {
    const i = b.slice(1).join(" ");
    let d = i.split(",").map((b) => b.trim());
    d = d.filter((b) => g.camtu.words.includes(b));
    for (const b of d) {
      g.camtu.words.splice(g.camtu.words.indexOf(b), 1);
    }
    j(e, JSON.stringify(c, null, "\t"));
    return f.sendMessage(`━━━━━━━━━━━━━━━━━━\n✅ Removed ${d.length} word(s) from the ban list.\n━━━━━━━━━━━━━━━━━━`, a.threadID, a.messageID);
  } else if (b[0] == "list") {
    let b = "━━━━━━━━━━━━━━━━━━\n📜 Banned Words List:\n";
    g.camtu.words.forEach((c) => (b += `- ${c}\n`));
    b += "━━━━━━━━━━━━━━━━━━";
    return f.sendMessage(b, a.threadID, a.messageID);
  } else {
    return f.sendMessage(
      `━━━━━━━━━━━━━━━━━━\n📌 Word Ban Help:\n\n→ ${global.config.PREFIX}wordban add <word,word,...> : Add words to ban list\n→ ${global.config.PREFIX}wordban del <word,word,...> : Remove words from ban list\n→ ${global.config.PREFIX}wordban list : View banned words\n→ ${global.config.PREFIX}wordban on : Enable word ban\n→ ${global.config.PREFIX}wordban off : Disable word ban\n━━━━━━━━━━━━━━━━━━`,
      a.threadID,
      a.messageID
    );
  }
};

module.exports.handleEvent = async ({ api: b, event: c, Threads: d }) => {
  const { senderID: f, threadID: g } = c;
  const h = global.data.threadInfo.get(g) || (await d.getInfo(g));
  const i = (h.adminIDs || []).find((b) => b.id == f);
  const k = [b.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
  const l = i || k.some((b) => b == f);

  if (!q(e)) {
    try {
      j(e, JSON.stringify({}, null, "\t"));
    } catch (b) {
      console.log(b);
    }
  }
  const m = require("cache/data/camtu.json");
  if (!m.hasOwnProperty(c.threadID)) {
    m[c.threadID] = { data: {} };
    j(e, JSON.stringify(m, null, "\t"));
  }
  if (c.body && !l) {
    try {
      const f = m[c.threadID].data || {};
      if (!f.camtu) return;
      if (f.camtu.enables) {
        const d = c.body
          .toLowerCase()
          .match(new RegExp("(\\s|^)(" + f.camtu.words.map((b) => (b += "+")).join("|") + ")(\\s|$)", "gi"));
        if (d) {
          return b.sendMessage(
            `━━━━━━━━━━━━━━━━━━\n⚠️ Banned word detected: '${d[0]}'\n→ React with ${p} to remove this member.\n→ React with ${a} to cancel.\n━━━━━━━━━━━━━━━━━━`,
            c.threadID,
            async (d, a) => {
              global.client.handleReaction.push({
                name: this.config.name,
                messageID: a.messageID,
                targetID: c.senderID,
              });
            },
            c.messageID
          );
        }
      }
    } catch (b) {
      console.log(b);
    }
  }
};

module.exports.handleReaction = async ({ api: q, event: c, Threads: b, handleReaction: d, Users: e }) => {
  const { targetID: f, messageID: g } = d;
  const { userID: h, threadID: i } = c;
  const j = global.data.threadInfo.get(i) || (await b.getInfo(i));
  const k = j.adminIDs.some((b) => b.id == h);
  const l = [q.getCurrentUserID(), ...global.config.ADMINBOT, ...global.config.NDH];
  const m = k || l.some((b) => b == h);

  if (!m) return;

  if (c.reaction == p) {
    const b = await q.getThreadInfo(c.threadID);
    return q.removeUserFromGroup(f, c.threadID, async (b) => {
      if (b) {
        q.sendMessage("━━━━━━━━━━━━━━━━━━\n❌ Cannot remove this member. Please give the bot admin rights and try again.\n━━━━━━━━━━━━━━━━━━", c.threadID, c.messageID);
      } else {
        q.unsendMessage(g);
        const d = await e.getNameUser(h);
        const a = await e.getNameUser(f);
        q.sendMessage(`━━━━━━━━━━━━━━━━━━\n✅ ${d} has removed member ${a} for using banned words.\n━━━━━━━━━━━━━━━━━━`, c.threadID);
      }
    });
  } else if (c.reaction == a) {
    return q.unsendMessage(g);
  }
};