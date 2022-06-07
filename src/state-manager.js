import * as passworder from '@metamask/browser-passworder';

class StateManager {
  constructor(entropy) {
    this._entropy = entropy;
  }

  async saveState(state) {
    const encryptedState = {
      state: await passworder.encrypt(this._entropy.key, state),
    };
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', encryptedState],
    });
  }

  async loadState() {
    const state = await wallet.request({
      method: 'snap_manageState',
      params: ['get'],
    });

    return await passworder.decrypt(this._entropy.key, state.state);
  }

  async getPublicKey() {
    return (await this.loadState()).publicKey;
  }

  async getPrivateKey() {
    return (await this.loadState()).privateKey;
  }
}

export { StateManager };
