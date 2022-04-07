// require("dotenv").config();

const crypto = require("crypto");
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
const client = new line.Client(config);
const userId = process.env.LINE_USER_ID;

// Webhookの署名検証
exports.validateSignature = (body, signature) => {
  return line.validateSignature(Buffer.from(JSON.stringify(body)), config.channelSecret, signature);
}

// プッシュ通知を送る
exports.notify = async () => { 
  const message = {
    type: "flex",
    altText: "カギが開いています",
    contents: flexContents
  };
  await client.pushMessage(userId, message)
    .catch((err) => {
      console.log(err);
    });
}

// フレックスメッセージ
const flexContents = {
  type: "bubble",
  body: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: "カギあけっぱなし！",
        weight: "bold",
        size: "md"
      }
    ]
  },
  footer: {
    type: "box",
    layout: "vertical",
    spacing: "sm",
    contents: [
      {
        type: "button",
        style: "primary",
        height: "sm",
        action: {
          type: "postback",
          label: "LOCK",
          data: "lock"
        }
      },
      {
        type: "box",
        layout: "vertical",
        contents: [],
        margin: "sm"
      }
    ],
    flex: 0
  }
}