const express = require("express");
const secp  = require("ethereum-cryptography/secp256k1").secp256k1;
const {toHex, hexToBytes, utf8ToBytes} = require('ethereum-cryptography/utils');
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03fe126c6fe2f1c97dd9f5c8e8b7c8c5c6c63a8216b424a48886c392d89e8231dd": 999,
  "02c5f763bd293ffa83b5a8b50dbc32811a402a72c3bb569e5d07f3cdfa90790465": 50,
  "02b3a46abac6f033b536dadd938b23a463777133ef16dbb4822cc8cde93d1561d7": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address.toLowerCase()] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const msg = utf8ToBytes(sender + amount + recipient);
  let verifyResult = secp.verify(signature, msg, sender);
  if (!verifyResult) {
    res.status(401).send({message: "invalid signature."});
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
