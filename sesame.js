const axios = require('axios');
const aesCmac = require('node-aes-cmac').aesCmac;

const sesame_id = process.env.SESAME_UUID;
const sesame_api_key = process.env.SESAME_API_KEY;
const key_secret_hex = process.env.KEY_SECRET_HEX;

exports.retreive_status = async () => {
  let result = await axios({
    method: 'get',
    url: `https://app.candyhouse.co/api/sesame2/${sesame_id}`,
    headers: { 'x-api-key': sesame_api_key }
  })
  return result;
};

exports.lock_cmd = async () => {
  let cmd = 82;
  let history = "Locked via LINE bot";
  let base64_history = Buffer.from(history).toString('base64');

  let sign = generateRandomTag(key_secret_hex)
  let result = await axios({
    method: 'post',
    url: `https://app.candyhouse.co/api/sesame2/${sesame_id}/cmd`,
    headers: { 'x-api-key': sesame_api_key },
    data: {
      cmd: cmd,
      history: base64_history,
      sign: sign
    }
  })
  return result;
};

exports.unlock_cmd = async () => {
  let cmd = 83;
  let history = "Unlocked via LINE bot";
  let base64_history = Buffer.from(history).toString('base64');

  let sign = generateRandomTag(key_secret_hex);
  let result = await axios({
    method: 'post',
    url: `https://app.candyhouse.co/api/sesame2/${sesame_id}/cmd`,
    headers: { 'x-api-key': sesame_api_key },
    data: {
      cmd: cmd,
      history: base64_history,
      sign: sign
    }
  })
  return result;
};

function generateRandomTag(secret) {
  let key = Buffer.from(secret, 'hex')
  const date = Math.floor(Date.now() / 1000);
  const dateDate = Buffer.allocUnsafe(4);
  dateDate.writeUInt32LE(date);
  const message = Buffer.from(dateDate.slice(1, 4));
  return aesCmac(key, message);
}