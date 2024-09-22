import { useState } from "react";
import { secp256k1 }  from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

import server from "./server";

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function getHashedMsg() {
    const msg = `${address} transferred ${sendAmount} to ${recipient}`;
    const bytes = utf8ToBytes(msg);

    return keccak256(bytes);
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const res = await secp256k1.sign(getHashedMsg(), privateKey);
      const signature = { ...res, r: res.r.toString(), s: res.s.toString() }

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: { signature, msgHash: getHashedMsg() },
        amount: parseInt(sendAmount),
        recipient,
      });
      
      setBalance(balance);
    } catch (ex) {
      console.log(`Expection Occured While Transfer: ${ex}`);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
