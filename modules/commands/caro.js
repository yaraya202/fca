module.exports.config = {
    name: 'caro',
    version: '1.0.0',
    hasPermssion: 0,
    credits: '𝐊𝐀𝐒𝐇𝐈𝐅 𝐑𝐀𝐙𝐀',
    description: '5x5 Caro board game',
    commandCategory: 'Game',
    usages: 'caro @tag, follow the guide beside',
    cooldowns: 5,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": "",
      "jimp": "",
      "node-superfetch": ""
    }
};

module.exports.handleReply = async ({ handleReply, event, api }) => {
  function delay(ms) {
       return new Promise(resolve => setTimeout(resolve, ms));
  };
  var {x, y, d, d1, sizeboard, sectionSize, boardbuffer} = handleReply;
    var { threadID, senderID, messageID, body } = event;
    var args   = body.split(' ');
    if(!args[1]) return api.sendMessage("⚠️ You have not entered Y coordinate", threadID, messageID);
    var toadoX = parseInt(args[0]),
        toadoY = parseInt(args[1]);
    if(toadoX == NaN || toadoY == NaN) return api.sendMessage("❌ Invalid X or Y coordinate", threadID, messageID);
    if(toadoX > sizeboard) return api.sendMessage("⚠️ X coordinate cannot exceed board size", threadID, messageID);
    if(toadoY > sizeboard) return api.sendMessage("⚠️ Y coordinate cannot exceed board size", threadID, messageID);
    
    var gameint  = global.game[threadID];
    var luot     = gameint.ditruoc;
    var luotuser = gameint.luot[senderID];
    if (global.game[threadID].toadogame.includes(toadoX.toString() + toadoY)) return api.sendMessage('❎ This position has already been played', threadID, messageID);
    
    var arrluot = Object.keys(gameint.luot);
    var iddoithu = parseInt(arrluot.filter(iddt => iddt != senderID));
    var namedoithu = ((await api.getUserInfo(iddoithu))[iddoithu]).name;
    if (luotuser != luot) {
      return api.sendMessage({body: '⚠️ Not your turn! It is '+namedoithu+' turn.', mentions: [{tag: namedoithu,id: iddoithu}]}, threadID, messageID);
    };
    
    if (luot == 0) {
        global.game[threadID].ditruoc = 1;
        var quanco = 'X';
        var linkCo = 'https://i.ibb.co/ByyrhMs/Xpng.png';
    };
    if (luot == 1) {
        global.game[threadID].ditruoc = 0;
        var quanco = 'O';
        var linkCo = 'https://i.ibb.co/FgtkNM9/Opng.png';
    };
    
    if(toadoY > toadoX) var soptu = toadoY-toadoX;
    else var soptu = toadoX-toadoY;
    var soo = sizeboard - 1;
    x[toadoY][toadoX]               = quanco;
    y[toadoX][toadoY]               = quanco;
    d[toadoX +toadoY][toadoX]       = quanco;
    d1[soo-soptu][toadoX]           = quanco;
    
    const Canvas = global.nodemodule["canvas"];
    const fs = global.nodemodule["fs-extra"];
    var path2 = __dirname+'/cache/caro2'+threadID+'.png';
    const boardgame = await Canvas.loadImage(boardbuffer);
    var xboard = boardgame.width, yboard = boardgame.height;
    const canvas = Canvas.createCanvas(xboard, yboard);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(boardgame, 0, 0, xboard, yboard);
    var quanCo = await Canvas.loadImage(linkCo);
    ctx.drawImage(quanCo, toadoX * sectionSize, toadoY * sectionSize, sectionSize, sectionSize);
    var boardbuffer = canvas.toBuffer();
    const background = await Canvas.loadImage(path2);
    var xbground = background.width, ybground = background.height;
    const canvasbg = Canvas.createCanvas(xbground, ybground);
    const ctxx = canvasbg.getContext('2d');
    ctxx.drawImage(background, 0, 0, xbground, ybground);
    const board = await Canvas.loadImage(boardbuffer);
    ctxx.drawImage(board, (xbground-880)/2, 320, 880, 880);
    
    global.game[threadID].toadogame.push(toadoX.toString() + toadoY);

    function checkWin(x, y, d, d1, toadoX, toadoY, quanco, sizeboard, sectionSize) {
        var dem = 0;
        for (let X of x[toadoY]) {
            if(X == quanco) dem++;
            else dem = 0;
            if (dem == 5) return {WIN: true};
        };
        dem = 0;
        for (let Y of y[toadoX]) {
            if (Y == quanco) dem++;
            else dem = 0;
            if (dem == 5) return {WIN: true};
        }
        dem = 0;
        for (let D of d[toadoX+toadoY]) {
            if (D == quanco) dem++;
            else dem = 0;
            if (dem == 5) return {WIN: true};
        };
        dem = 0;
        var soo = sizeboard-1;
        var soptu = (toadoY > toadoX) ? toadoY-toadoX : toadoX-toadoY;
        for (let D1 of d1[soo-soptu]) {
            if (D1 == quanco) dem++;
            else dem = 0;
            if(dem == 5) return {WIN: true};
        };
        return {WIN: false};
    };
  
    var myname = ((await api.getUserInfo(senderID))[senderID]).name;
    var CHECKWIN = checkWin(x, y, d, d1, toadoX, toadoY, quanco, sizeboard, sectionSize);
    if(CHECKWIN.WIN == true) {
        fs.writeFileSync(path2, canvasbg.toBuffer());
        api.unsendMessage(handleReply.messageID, () => {
            api.sendMessage({
              body: "🎉 Congratulations "+myname+", you win!",
              attachment: fs.createReadStream(path2),
              mentions: [{tag: myname,id: senderID}]
            }, threadID, messageID);
        });
        return global.game[threadID] = {};
    };
    fs.writeFileSync(path2, canvasbg.toBuffer());
    api.unsendMessage(handleReply.messageID, () => {
        api.sendMessage({body: 'Reply this message with coordinates X Y to play, example:\n1 5\nNext turn: '+namedoithu, attachment: fs.createReadStream(path2), mentions: [{
          tag: namedoithu,
          id: iddoithu
        }]},threadID, (e, info) => {
            client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                x: x,
                y: y,
                d: d,
                d1: d1,
                sizeboard: sizeboard,
                sectionSize: sectionSize,
                boardbuffer: boardbuffer
            });
        },messageID);
    })
};


module.exports.run = async ({ event, api, args }) => {
    var { threadID, senderID, messageID } = event;
    if (!global.game) global.game = {};
    if (!global.game[threadID]) global.game[threadID] = {};
    
    if(args[0] == "clear"){
      var author = global.game[threadID].author;
      if(!author) return api.sendMessage('⚠️ No board created in this group', threadID, messageID);
      if (senderID != author) return api.sendMessage('❌ Only board author '+author+' can end this game', threadID, messageID);
      global.game[threadID] = {};
      return api.sendMessage('🗑️ Caro board cleared!', threadID, messageID);
    }
    
    if (global.game[threadID].author) {
        return api.sendMessage('⚠️ This group already has an active game. End it first with "/caro clear".', threadID, messageID);
    };
    
    var player2 = Object.keys(event.mentions)[0];
    if(!player2) return api.sendMessage("⚠️ Please tag a user to play with!", event.threadID, event.messageID);
    
    global.game[threadID] = {
        luot: {[senderID]: 1,[player2]: 0},
        toadogame: [],
        ditruoc: 1,
        author: senderID
    };
    
    var kytu = "@";
    var x = [], y = [], d = [], d1 = [];
    var size = 16;
    for (let i = 0; i < size; i++) {
        x[i] = []; y[i] = [];
        for(let j = 0; j < size; j++) {
          x[i][j] = kytu; y[i][j] = kytu;
        }
    }
    var auto = '+';
    var so_d = 0;
    var chieudaio = size*2-1;
    for (var i = 0; i < chieudaio; i++) {
        if(auto == '+') so_d++;
        if(auto == "-") so_d--;
        d[i] = []; d1[i] = [];
        for(let j = 0; j < so_d; j++) {
          d[i][j] = "@"; d1[i][j] = "@";
          if(so_d == size) auto = "-";
        };
    };
    
    const Canvas = global.nodemodule["canvas"];
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const spf = global.nodemodule["node-superfetch"];
    var path2 = __dirname+'/cache/caro2'+threadID+'.png';
    
    const imgboard = await Canvas.loadImage('https://vn112.com/wp-content/uploads/2018/01/pxsolidwhiteborderedsvg-15161310048lcp4.png');
    var xboard = imgboard.width, yboard = imgboard.height;
    const canvas = Canvas.createCanvas(xboard, yboard);
    let ctx = canvas.getContext('2d');
    ctx.drawImage(imgboard, 0, 0, canvas.width, canvas.height);
    var sizeboard = parseInt(16);
    var sectionSize = xboard/sizeboard;
    for (i = 0; i <= sizeboard; i++) {
        for (j = 0; j <= sizeboard; j++) {
            ctx.moveTo(0, sectionSize * j); ctx.lineTo(sectionSize * sizeboard, sectionSize * j); ctx.stroke();
            ctx.moveTo(sectionSize * i, 0); ctx.lineTo(sectionSize * i, sectionSize * sizeboard); ctx.stroke();
        }
    };
    const boardbuffer = canvas.toBuffer();
    var background = await Canvas.loadImage("https://i.ibb.co/WVgwgtc/0afd2951b10413352a363ea51b4606ac.jpg");
    var xbground = background.width, ybground = background.height;
    const canvasbg = Canvas.createCanvas(xbground, ybground);
    let ctxx = canvasbg.getContext('2d');
    ctxx.drawImage(background, 0, 0, xbground, ybground);
    ctxx.fillStyle = "#000000"; ctxx.textAlign = "center";
    if(!fs.existsSync(__dirname+'/cache/bold-font.ttf')) {
      let getfont = (await axios.get("https://drive.google.com/u/0/uc?id=1Kx2hi9VX5X4KjwO1uFR6048fm4dKAMnp&export=download", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname+'/cache/bold-font.ttf', Buffer.from(getfont, "utf-8"));
    };
    Canvas.registerFont(__dirname+'/cache/bold-font.ttf',{family:"caro",weight:"regular",style:"normal"});
    ctxx.font = "bold 36px caro";
    var boardCv = await Canvas.loadImage(boardbuffer);
    ctxx.drawImage(boardCv, (xbground-880)/2, 320, 880, 880);
    for(let i = 0; i < 16; i++) {
      ctxx.fillText(i, (xbground-880)/2+i*(880/16)+27.5, 310);
      ctxx.fillText(i, (xbground-880)/2-30, 330+i*(880/16)+27.5)
    }
    try{
      var avt1 = (await spf.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
      var avt2 = (await spf.get(`https://graph.facebook.com/${player2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).body;
      ctxx.drawImage(await Canvas.loadImage(avt1), xbground/2-300, 60, 200, 200);
      ctxx.drawImage(await Canvas.loadImage(avt2), xbground/2+100, 60, 200, 200);
    }catch(e){};
    var VS = (await spf.get("https://i.ibb.co/RQjPz7f/1624961650011.png")).body;
    var logoVS = await Canvas.loadImage(VS);
    ctxx.drawImage(logoVS, xbground/2-100, 60, 200, 200);
    fs.writeFileSync(path2, canvasbg.toBuffer());
    api.sendMessage({body: "✅ Caro game created successfully. You go first!\nReply this message with coordinates X Y, e.g.:\n1 5", attachment: fs.createReadStream(path2)}, threadID, (e, info) => {
            client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                x: x,y: y,d: d,d1: d1,sizeboard: sizeboard,sectionSize: sectionSize,boardbuffer: boardbuffer
            });
        }
    );
};