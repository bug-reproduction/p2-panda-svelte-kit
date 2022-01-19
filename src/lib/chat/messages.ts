import {readable} from 'svelte/store';
import {KeyPair, Session, wasm} from 'p2panda-js';
import {CHAT_SCHEMA, ENDPOINT} from './configs';

const session = new Session(ENDPOINT);

async function sync(set: (a: any[]) => void) {
  const unsortedEntries = await session.queryEntries(CHAT_SCHEMA);
  const entries = unsortedEntries.sort(({message: messageA}, {message: messageB}) => {
    return messageA.fields.date > messageB.fields.date ? 1 : -1;
  });
  set(entries);
}

export const messages = readable([], (set) => {
  let syncing = async () => {
    await sync(set);
    setTimeout(syncing, 1000);
  };
  setTimeout(syncing, 1000);
});

let keyPair: KeyPair | undefined;
export async function write(message: string) {
  if (!keyPair) {
    const {KeyPair} = await wasm;
    keyPair = KeyPair.fromPrivateKey('8f528da414ec520a7debaf577655e7abd1f3df0232cdea562122baa4cb');
  }
  await session.create(
    {
      message,
      date: new Date().toISOString(),
    },
    {schema: CHAT_SCHEMA, session, keyPair}
  );
}
