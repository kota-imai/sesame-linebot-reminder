const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const sesame = require('./sesame.js');
const line = require('./line.js')

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.json({
    message: "Application running..."
  });
});

// 家のSESAMEの開閉状態を取得する
app.get('/status', async (req, res) => {
  const { data } = await sesame.get_status();
  res.json(data);
});

// カギが開いてればLINE通知する
app.get('/remindme', async (req, res) => {
  const { data } = await sesame.get_status();
  if (data.CHSesame2Status == 'unlocked') {
    const result = await line.notify();
    return res.json({
      message: "Notification sended!"
    })
  };
  res.json({
    message: "The key is locked"
  })
});

// Webhook
app.post('/webhook', async (req, res) => {
  // Signature検証
  if (!line.validateSignature(req.body, req.headers['x-line-signature'])) { 
    return res.status(401).json({
      message: "Invalid signature received"
    })
  }
  // postbackイベントを処理する
  if (req.body.events.length > 0 && req.body.events[0].type == "postback") {
    const result = await sesame.lock_cmd();
  }
  res.sendStatus(200);
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}!`);
});