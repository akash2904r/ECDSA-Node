const { createPrivateKeySync, publicKeyCreate } = require("ethereum-cryptography/secp256k1-compat");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = createPrivateKeySync();
console.log(toHex(privateKey));

// Produces a compressed form of public key for the given Uint8Array (private key)
// Use publicKeyCreate(privateKey, false) in order for the full public key
// The 2nd parameter is a boolean compressed which is by default true
const publicKey = publicKeyCreate(privateKey);
console.log(toHex(publicKey));