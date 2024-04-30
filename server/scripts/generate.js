const secp  = require("ethereum-cryptography/secp256k1").secp256k1;
// const secp = secp1.secp256k1;
const utils = require("ethereum-cryptography/utils");
const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);
console.log("privateKey: " + utils.toHex(privateKey));
console.log("publicKey: " + utils.toHex(publicKey));

const msg = utils.toHex(utils.utf8ToBytes('good job'));
var signature = secp.sign(msg, privateKey);
console.log("signature: " + signature);
let verifyResult = secp.verify(signature, msg, publicKey);
console.log("verifyResult: " + verifyResult);