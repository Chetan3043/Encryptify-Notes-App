import CryptoJS from 'crypto-js';
import type { Note } from './types';

export const PASS_HASH_KEY = 'secure-notes-pass-hash';

export const hashPassphrase = (passphrase: string) =>
  CryptoJS.SHA256(passphrase).toString();

export const encryptNote = (note: Note, passphrase: string) => {
  const serialized = JSON.stringify(note);
  return CryptoJS.AES.encrypt(serialized, passphrase).toString();
};

export const decryptNote = (ciphertext: string, passphrase: string): Note => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);

  if (!plaintext) {
    throw new Error('Invalid passphrase or corrupted data.');
  }

  return JSON.parse(plaintext) as Note;
};


