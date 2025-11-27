# Privacy-Focused Notes App

## Overview

This project is a secure, privacy-first note-taking application built for offline-first use. Notes are encrypted on the client before they are stored locally (IndexedDB with a localStorage fallback) or sent to any optional cloud sync backend. The app aims to minimize trust in external services by ensuring sensitive content is never stored in plaintext outside the user's device.

## Key Principles

* **Client-side encryption**: All note content and sensitive metadata are encrypted in the browser using AES before being persisted.
* **Minimal trust model**: If cloud sync is enabled, servers should only ever receive encrypted blobs; the server cannot decrypt user notes.
* **Offline-first**: The app uses IndexedDB for local persistence and works without an internet connection.
* **Simple UX for security**: Encryption should be transparent for users while offering clear guidance on passphrase management.

## Features

* Create, read, update, and delete (CRUD) notes
* AES client-side encryption of note content
* Local storage via IndexedDB (with localStorage fallback)
* Search, pin, archive, and tag notes
* Optional cloud sync (encrypted blobs only)
* User authentication (optional) and passphrase-based encryption
* Import/export encrypted notes

## Tech Stack

* Frontend: React
* Encryption library: CryptoJS (or equivalent Web Crypto wrapper)
* Local storage: IndexedDB (using a small wrapper such as idb)
* Optional backend: Any REST/GraphQL service that stores and serves encrypted blobs
* Build tools: Vite / Create React App / your preferred bundler

## Security

### Passphrase & Key management

* The passphrase should be chosen by the user and never transmitted to the server.
* If the app offers authentication+sync, store only the encrypted key material (or use client-side key wrapping). The server must never receive raw keys or plaintext notes.
* Offer clear UX instructions for passphrase recovery/loss: losing the passphrase means the encrypted notes are unrecoverable.

## Data Storage

* **Primary**: IndexedDB using a lightweight wrapper (e.g., `idb`). Store encrypted ciphertext along with non-sensitive metadata (timestamps, tags) that can be encrypted too if sensitivity demands.
* **Fallback**: localStorage only for low-volume, offline-first convenience — prefer IndexedDB for larger usage.

## Cloud Sync (Optional)

If you implement cloud sync:

* Encrypt all note content client-side and upload only ciphertext + non-sensitive metadata.
* Use per-note metadata versioning / conflict resolution (last-write-wins or CRDTs for advanced use).
* Consider storing an encrypted file manifest for fast listing; avoid sending searchable plaintext to the server.

## Setup & Development

### Requirements

* Node.js (LTS recommended)
* npm or yarn

### Installation

```bash
git clone <repo-url>
cd privacy-notes-app
npm install
```

### Environment variables

Create a `.env` file for optional configuration (do not put secrets in plaintext). Example:

```
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_CLOUD_SYNC=true
```

### Run (development)

```bash
npm run dev
# or
npm start
```

### Build (production)

```bash
npm run build
```
