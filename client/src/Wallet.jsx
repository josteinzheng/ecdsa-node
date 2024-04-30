import server from "./server";
import {secp256k1 as secp} from 'ethereum-cryptography/secp256k1';
import {toHex, hexToBytes} from 'ethereum-cryptography/utils';

function Wallet({ privateKey, setPrivateKey, balance, setBalance, address, setAddress }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey) {
      const address = toHex(secp.getPublicKey(hexToBytes(privateKey)));
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      setAddress(address);
    } else {
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet privateKey
        <input placeholder="Type your privateKey, for example: 0x12" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Address: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
