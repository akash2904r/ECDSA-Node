import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

import server from "./server";

function Wallet({ 
  address, 
  setAddress, 
  balance, 
  setBalance, 
  privateKey, 
  setPrivateKey 
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const address = privateKey ? toHex(secp256k1.getPublicKey(privateKey)) : "";
    setAddress(address);

    if (privateKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Enter your private key" value={privateKey} onChange={onChange}></input>
      </label>

      {address && (
        <div className="address">
          Address: {address.slice(0, 8)}...{address.slice(-4)}
        </div>
      )}

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
