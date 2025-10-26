module.exports.config = {
    name: 'resend',
    version: '2.0.0',
    hasPermssion: 1,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: 'View deleted messages',
    commandCategory: 'Member',
    usages: '',
    cooldowns: 0,
    hide: true,
    dependencies: {
      request: '',
      'fs-extra': '',
      axios: '',
    },
};

module.exports.handleEvent = async function ({
    event: e,
    api: a,
    client: t,
    Users: s,
}) {
    const n = global.nodemodule.request,
        o = global.nodemodule.axios,
        { writeFileSync: d, createReadStream: r } = global.nodemodule['fs-extra'];

    let { messageID: g, senderID: l, threadID: i, body: u } = e;
    global.logMessage || (global.logMessage = new Map());
    global.data.botID || (global.data.botID = global.data.botID);

    const c = global.data.threadData.get(i) || {};
    if (
        (void 0 === c.resend || 1 != c.resend) &&
        l != global.data.botID &&
        ('message_unsend' != e.type &&
            global.logMessage.set(g, {
                msgBody: u,
                attachment: e.attachments,
            }),
        void 0 !== c.resend && (1 == c.resend) | ('message_unsend' == e.type))
    ) {
        var m = global.logMessage.get(g);
        if (!m) return;

        let e = await s.getNameUser(l);
        if (null == m.attachment[0]) {
            return a.sendMessage(
`⚝──⭒─⭑─⭒──⚝

📝 𝐔𝐬𝐞𝐫: ${e}  
❌ 𝐃𝐞𝐥𝐞𝐭𝐞𝐝 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞  

💬 𝐂𝐨𝐧𝐭𝐞𝐧𝐭: ${m.msgBody}

⚝──⭒─⭑─⭒──⚝`,
            i
            );
        } else {
            let t = 0,
                s = {
                    body: `≿━━━━༺❀༻━━━━≾

📝 𝐔𝐬𝐞𝐫: ${e}  
❌ 𝐃𝐞𝐥𝐞𝐭𝐞𝐝 ${m.attachment.length} 𝐚𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭(𝐬)  

${'' != m.msgBody ? `💬 𝐂𝐨𝐧𝐭𝐞𝐧𝐭: ${m.msgBody}` : ''}

≿━━━━༺❀༻━━━━≾`,
                    attachment: [],
                    mentions: {
                        tag: e,
                        id: l,
                    },
                };
            for (var h of m.attachment) {
                t += 1;
                var f = (await n.get(h.url)).uri.pathname,
                    b = f.substring(f.lastIndexOf('.') + 1),
                    p = __dirname + `/cache/${t}.${b}`,
                    x = (await o.get(h.url, { responseType: 'arraybuffer' })).data;
                d(p, Buffer.from(x, 'utf-8'));
                s.attachment.push(r(p));
            }
            a.sendMessage(s, i);
        }
    }
};

module.exports.languages = {
    en: {
        on: '𝐄𝐧𝐚𝐛𝐥𝐞𝐝',
        off: '𝐃𝐢𝐬𝐚𝐛𝐥𝐞𝐝',
        successText: '𝐑𝐞𝐬𝐞𝐧𝐝 𝐬𝐞𝐭𝐭𝐢𝐧𝐠 𝐮𝐩𝐝𝐚𝐭𝐞𝐝 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!',
    },
};

module.exports.run = async function ({
    api: e,
    event: a,
    Threads: t,
    getText: s,
}) {
    const { threadID: n, messageID: o } = a;
    let d = (await t.getData(n)).data;

    void 0 === d.resend || 0 == d.resend
        ? (d.resend = true)
        : (d.resend = false);

    await t.setData(n, { data: d });
    global.data.threadData.set(n, d);

    e.sendMessage(
`༻﹡﹡﹡﹡﹡﹡﹡༺

${1 == d.resend ? s('on') : s('off')} → ${s('successText')}

༻﹡﹡﹡﹡﹡﹡﹡༺`,
        n,
        o
    );
};