import { ec as EC } from 'elliptic';
import * as passworder from '@metamask/browser-passworder';

import { StateManager } from './state-manager';

const ec = new EC('secp256k1');

export class Controller {
  constructor() {
    this.entropy = null;
    this.stateManager = null;
  }

  async init() {
    const entropy = await wallet.request({
      method: 'snap_getBip44Entropy_69420',
    });
    this.entropy = entropy;
    this.stateManager = new StateManager(entropy);
  }

  async setUpAccount() {
    const key = ec.genKeyPair();
    const publicKeyHex = key.getPublic().encode('hex');
    const privateKeyHex = key.getPrivate('hex');

    await this.stateManager.saveState({
      publicKey: publicKeyHex,
      privateKey: privateKeyHex,
    });
  }

  async getPublicKey() {
    return await this.stateManager.getPublicKey();
  }

  async encrypt(plain) {
    const privateKeyHex = await this.stateManager.getPrivateKey();

    return await passworder.encrypt(privateKeyHex, plain);
  }

  async decrypt(cipher) {
    const privateKeyHex = await this.stateManager.getPrivateKey();

    return await passworder.decrypt(privateKeyHex, cipher);
  }
}
