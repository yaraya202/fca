module.exports.config = {
	name: "user",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀",
	description: "Ban or unban users",
	commandCategory: "Admin",
	usages: "< unban/ban/search + ID + text >",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"reason": "𝗥𝗲𝗮𝘀𝗼𝗻",
		"at": "𝗔𝘁",
		"allCommand": "𝗔𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀",
		"commandList": "𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀",
		"banSuccess": "≿━━━━༺❀༻━━━━≾\n\n[ 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗕𝗮𝗻𝗻𝗲𝗱 𝘂𝘀𝗲𝗿: %1\n\n≿━━━━༺❀༻━━━━≾",
		"unbanSuccess": "≿━━━━༺❀༻━━━━≾\n\n[ 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱 𝘂𝘀𝗲𝗿 %1\n\n≿━━━━༺❀༻━━━━≾",
		"banCommandSuccess": "≿━━━━༺❀༻━━━━≾\n\n[ 𝗕𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 ] 𝗕𝗮𝗻𝗻𝗲𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝘄𝗶𝘁𝗵 𝘂𝘀𝗲𝗿: %1\n\n≿━━━━༺❀༻━━━━≾",
		"unbanCommandSuccess": "≿━━━━༺❀༻━━━━≾\n\n[ 𝗨𝗻𝗯𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 ] 𝗨𝗻𝗯𝗮𝗻𝗻𝗲𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 %1 𝘄𝗶𝘁𝗵 𝘂𝘀𝗲𝗿: %2\n\n≿━━━━༺❀༻━━━━≾",
		"errorReponse": "%1 𝗖𝗮𝗻'𝘁 𝗱𝗼 𝘄𝗵𝗮𝘁 𝘆𝗼𝘂 𝗿𝗲𝗾𝘂𝗲𝘀𝘁",
		"IDNotFound": "%1 𝗜𝗗 𝘆𝗼𝘂 𝗲𝗻𝘁𝗲𝗿𝗲𝗱 𝗱𝗼𝗲𝘀𝗻'𝘁 𝗲𝘅𝗶𝘀𝘁 𝗶𝗻 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲",
		"existBan": "[ 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗨𝘀𝗲𝗿 %1 𝗵𝗮𝘀 𝗮𝗹𝗿𝗲𝗮𝗱𝘆 𝗯𝗲𝗲𝗻 𝗯𝗮𝗻𝗻𝗲𝗱 %2 %3",
		"notExistBan": "[ 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗨𝘀𝗲𝗿 𝗵𝗮𝘀𝗻'𝘁 𝗯𝗲𝗲𝗻 𝗯𝗮𝗻𝗻𝗲𝗱 𝗯𝗲𝗳𝗼𝗿𝗲",
		"missingCommandInput": "%1 𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝘁𝗼 𝗲𝗻𝘁𝗲𝗿 𝘁𝗵𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝘆𝗼𝘂 𝘄𝗮𝗻𝘁 𝘁𝗼 𝗯𝗮𝗻!",
		"notExistBanCommand": "[ 𝗨𝗻𝗯𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 ] 𝗨𝘀𝗲𝗿 𝗜𝗗 𝗵𝗮𝘀𝗻'𝘁 𝗯𝗲𝗲𝗻 𝗯𝗮𝗻𝗻𝗲𝗱 𝗯𝗲𝗳𝗼𝗿𝗲",

		"returnBan": "[ 𝗕𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝗶𝗻𝗴 𝘁𝗼 𝗯𝗮𝗻 𝘂𝘀𝗲𝗿:\n- 𝗨𝘀𝗲𝗿 𝗜𝗗 𝗮𝗻𝗱 𝗻𝗮𝗺𝗲: %1%2\n\n❮ 𝗥𝗲𝗮𝗰𝘁 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 ❯",
		"returnUnban": "[ 𝗨𝗻𝗯𝗮𝗻 𝗨𝘀𝗲𝗿 ] 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝗶𝗻𝗴 𝘁𝗼 𝘂𝗻𝗯𝗮𝗻 𝘂𝘀𝗲𝗿:\n- 𝗨𝘀𝗲𝗿 𝗜𝗗 𝗮𝗻𝗱 𝗻𝗮𝗺𝗲: %1\n\n❮ 𝗥𝗲𝗮𝗰𝘁 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 ❯",
		"returnBanCommand": "[ 𝗕𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 ] 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝗶𝗻𝗴 𝘁𝗼 𝗯𝗮𝗻 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀:\n - 𝗨𝘀𝗲𝗿 𝗜𝗗 𝗮𝗻𝗱 𝗻𝗮𝗺𝗲: %1\n- 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: %2\n\n❮ 𝗥𝗲𝗮𝗰𝘁 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 ❯",
		"returnUnbanCommand": "[ 𝗨𝗻𝗯𝗮𝗻𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗨𝘀𝗲𝗿 ] 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗿𝗲𝗾𝘂𝗲𝘀𝘁𝗶𝗻𝗴 𝘁𝗼 𝘂𝗻𝗯𝗮𝗻 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀:\n - 𝗨𝘀𝗲𝗿 𝗜𝗗 𝗮𝗻𝗱 𝗻𝗮𝗺𝗲: %1\n- 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: %2\n\n❮ 𝗥𝗲𝗮𝗰𝘁 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺 ❯",
	
		"returnResult": "≿━━━━༺❀༻━━━━≾\n\n𝗧𝗵𝗶𝘀 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗿𝗲𝘀𝘂𝗹𝘁:\n%1\n\n≿━━━━༺❀༻━━━━≾",
		"returnNull": "𝗡𝗼 𝗿𝗲𝘀𝘂𝗹𝘁 𝗳𝗼𝘂𝗻𝗱!",
		"returnList": "[ 𝗨𝘀𝗲𝗿 𝗟𝗶𝘀𝘁 ]\n𝗧𝗵𝗲𝗿𝗲 𝗮𝗿𝗲 %1 𝗯𝗮𝗻𝗻𝗲𝗱 𝘂𝘀𝗲𝗿𝘀, 𝗵𝗲𝗿𝗲 𝗮𝗿𝗲 %2:\n\n%3",
		"returnInfo": "[ 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 ] 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘀𝗼𝗺𝗲 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻:\n- 𝗨𝘀𝗲𝗿 𝗜𝗗 𝗮𝗻𝗱 𝗻𝗮𝗺𝗲: %1\n- 𝗕𝗮𝗻𝗻𝗲𝗱: %2 %3 %4\n- 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗯𝗮𝗻𝗻𝗲𝗱: %5"
	}
}

module.exports.handleReaction = async ({ event, api, Users, handleReaction, getText }) => {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	const moment = require("moment-timezone");
	const { threadID } = event;
	const { messageID, type, targetID, reason, commandNeedBan, nameTarget } = handleReaction;
	
	const time = moment.tz("Asia/Karachi").format("DD/MM/YYYY HH:mm:ss");
	global.client.handleReaction.splice(global.client.handleReaction.findIndex(item => item.messageID == messageID), 1);
	
	// (rest of code stays same – only messages are now Unicode bold + styled)
};
	
	switch (type) {
		case "ban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = true;
				data.reason = reason || null;
				data.dateAdded = time;
				await Users.setData(targetID, { data });
				global.data.userBanned.set(targetID, { reason: data.reason, dateAdded: data.dateAdded });
				return api.sendMessage(getText("banSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch { return api.sendMessage(getText("errorReponse", "[ MODE ] → "), threadID) };
		}

		case "unban": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.banned = false;
				data.reason = null;
				data.dateAdded = null;
				await Users.setData(targetID, { data });
				global.data.userBanned.delete(targetID);
				return api.sendMessage(getText("unbanSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch { return api.sendMessage(getText("errorReponse", "[ MODE ] → "), threadID) };
		}

		case "banCommand": {
			try {	
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned || [], ...commandNeedBan];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				return api.sendMessage(getText("banCommandSuccess", `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ MODE ] → "), threadID) };
		}

		case "unbanCommand": {
			try {
				let data = (await Users.getData(targetID)).data || {};
				data.commandBanned = [...data.commandBanned.filter(item => !commandNeedBan.includes(item))];
				await Users.setData(targetID, { data });
				global.data.commandBanned.set(targetID, data.commandBanned);
				if(data.commandBanned.length == 0) global.data.commandBanned.delete(targetID)
				return api.sendMessage(getText("unbanCommandSuccess", ((data.commandBanned.length == 0) ? getText("allCommand") : `${getText("commandList")}: ${commandNeedBan.join(", ")}`), `${targetID} - ${nameTarget}`), threadID, () => {
					return api.unsendMessage(messageID);
				});
			} catch (e) { return api.sendMessage(getText("errorReponse", "[ MODE ] → "), threadID) };
		}
	}
}

module.exports.run = async ({ event, api, args, Users, getText }) => {
	const { threadID, messageID } = event;
	const type = args[0];
	var targetID = String(args[1]);
	var reason = (args.slice(2, args.length)).join(" ") || null;

	if (isNaN(targetID)) {
		const mention = Object.keys(event.mentions);
		args = args.join(" ");
		targetID = String(mention[0]);
		reason = (args.slice(args.indexOf(event.mentions[mention[0]]) + (event.mentions[mention[0]] || "").length + 1, args.length)) || null;
	}

	switch (type) {
		case "ban":
		case "-b": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ MODE ] → "), threadID, messageID);
			if (global.data.userBanned.has(targetID)) {
				const { reason, dateAdded } = global.data.userBanned.get(targetID) || {};
				return api.sendMessage(getText("existBan", targetID, ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")} ${dateAdded}` : "")), threadID, messageID);
			}
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBan", `${targetID} - ${nameTarget}`, ((reason) ? `\n- ${getText("reason")}: ${reason}` : "")), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "ban",
					targetID,
					reason,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "unban":
		case "-ub": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ MODE ] → "), threadID, messageID);
			if (!global.data.userBanned.has(targetID)) return api.sendMessage(getText("notExistBan"), threadID, messageID);
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnban", `${targetID} - ${nameTarget}`), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unban",
					targetID,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

	case "search":
		case "-s": {
		    var{userName}=global.data,txt='',count=0;
		    userName.forEach((v,k) => {
		       if(v.toLowerCase().includes(reason.replace(event.args[1],'').trim().toLowerCase())) txt+=`${++count}. ${v}\nURL: https://www.facebook.com/profile.php?id=${k}\n`;
		        });
			api.sendMessage(getText("returnResult", txt), threadID);
		}
        break;
		
		case "banCommand":
		case "-bc": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ MODE ] → "), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ MODE ] → "), threadID, messageID);
			if (reason == "all") {
				var allCommandName = [];
				const commandValues = global.client.commands.keys();
				for (const cmd of commandValues) allCommandName.push(cmd);
				reason = allCommandName.join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnBanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.client.commands.size) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "banCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}

		case "unbanCommand":
		case "-ubc": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ MODE ] → "), threadID, messageID);
			if (!global.data.commandBanned.has(targetID)) return api.sendMessage(getText("notExistBanCommand"), threadID, messageID);
			if (reason == null || reason.length == 0) return api.sendMessage(getText("missingCommandInput", "[ MODE ] → "), threadID, messageID);
			if (reason == "all") {
				reason = (global.data.commandBanned.get(targetID)).join(" ");
			}
			const commandNeedBan = reason.split(" ");
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnUnbanCommand", `${targetID} - ${nameTarget}`, ((commandNeedBan.length == global.data.commandBanned.get(targetID).length) ? getText("allCommand") : commandNeedBan.join(", "))), threadID, (error, info) => {
				global.client.handleReaction.push({
					type: "unbanCommand",
					targetID,
					commandNeedBan,
					nameTarget,
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					
				});
			}, messageID);
		}	
      case "info":
		case "-i": {
			if (!global.data.allUserID.includes(targetID)) return api.sendMessage(getText("IDNotFound", "[ MODE ] → "), threadID, messageID);
			if (global.data.commandBanned.has(targetID)) { var commandBanned = global.data.commandBanned.get(targetID) || [] };
			if (global.data.userBanned.has(targetID)) { var { reason, dateAdded } = global.data.userBanned.get(targetID) || {} };
			const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
			return api.sendMessage(getText("returnInfo", `${targetID} - ${nameTarget}`, ((!dateAdded) ? "" : ""), ((reason) ? `${getText("reason")}: "${reason}"` : ""), ((dateAdded) ? `${getText("at")}: ${dateAdded}` : ""), ((commandBanned) ? `${(commandBanned.length == global.client.commands.size) ? getText("allCommand") : commandBanned.join(", ")}` : "")), threadID, messageID);
	}
}
      }