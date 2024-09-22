const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const port = 3042;

app.use(cors());
app.use(express.json());

/*
  Private keys for the following public keys ( Same order as in public keys )

  ea4de66b1f1ba0f35c304a842bb1e3757447ebe60a0735183e4e425bc8d0391c
  bfc1129c0e1568782f031863075dff9f7515ee9c6de5cf11b315571564e848c4
  ce7ae4bd9480dcc14e68f0b19f9d1f54c5606044178b08971fba12250617f9d6
*/

const balances = {
  "026cafe73dcaec16d792c954d45aff38faba57d7a3b1624984c8c67487cf86dc44": 100,
  "03c71f483863e637adbdc8fbed72faa1ca21dd5b272ca6d2835f658915da218d44": 50,
  "0321744e7749d99432180560ba67cdec51f1115a60f39797bff4390f4bf806fafa": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;
  const msgHash = new Uint8Array(Object.values(sender.msgHash));
  const signature = { ...sender.signature, r: BigInt(sender.signature.r), s: BigInt(sender.signature.s) }

  const address = Object.keys(balances).find(publicKey =>
    secp256k1.verify(signature, msgHash, publicKey) === true
  );

  setInitialBalance(address);
  setInitialBalance(recipient);

  if (balances[address] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[address] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[address] });
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
