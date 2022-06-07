import { Mutex } from 'async-mutex';

// eslint-disable-next-line node/no-unpublished-import
import { Controller } from './controller';

const REQUEST_METHODS = Object.freeze({
  SET_UP_ACCOUNT: 'set_up_account',
  FETCH_PUBLIC_KEY: 'fetch_public_key',
  ENCRYPT: 'encrypt',
  DECRYPT: 'decrypt',
});

const saveMutex = new Mutex();

wallet.registerRpcMessageHandler(async (_originString, requestObject) => {
  const handler = new Controller();
  await handler.init();

  switch (requestObject.method) {
    case REQUEST_METHODS.SET_UP_ACCOUNT:
      await saveMutex.runExclusive(async () => {
        await handler.setUpAccount();
      });

      return 'OK';

    case REQUEST_METHODS.FETCH_PUBLIC_KEY:
      return await handler.getPublicKey();

    case REQUEST_METHODS.ENCRYPT: {
      const { plain } = requestObject;

      return await handler.encrypt(plain);
    }

    case REQUEST_METHODS.DECRYPT: {
      const { cipher } = requestObject;

      return await handler.decrypt(cipher);
    }

    default:
      throw new Error('Method not found.');
  }
});
