// Created with Claude Code (Claude Opus 5.5)
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import {
  deleteDatabaseSync,
  openDatabaseSync,
  type SQLiteDatabase,
} from 'expo-sqlite';

import type { RepositoryStorage } from '@repo/datasync-engine';

const DB_NAME = 'datasync.db';
const KEY_NAME = 'datasync-db-enckey';

let db: SQLiteDatabase | null = null;

function getKey() {
  let key = SecureStore.getItem(KEY_NAME);

  // Generate new, if not found in secure store
  if (!key) {
    key = Array.from(Crypto.getRandomBytes(32), (b) =>
      b.toString(16).padStart(2, '0'),
    ).join('');

    SecureStore.setItem(KEY_NAME, key);
  }

  return key;
}

function open(key: string) {
  const database = openDatabaseSync(DB_NAME);

  try {
    // Raw 256-bit key, skips SQLCipher's slow PBKDF2 derivation
    database.execSync(`PRAGMA key = "x'${key}'"`);
    // PRAGMA key never fails by itself, the first real read does
    database.execSync('SELECT count(*) FROM sqlite_master');

    return database;
  } catch (error) {
    database.closeSync();
    throw error;
  }
}

function getDb() {
  if (db) return db;

  const key = getKey();
  try {
    db = open(key);
  } catch {
    // DB restored from backup without its key (SecureStore is excluded from backups).
    // It's only a cache, so start over.
    deleteDatabaseSync(DB_NAME);
    db = open(key);
  }
  db.execSync(
    'CREATE TABLE IF NOT EXISTS repo_cache (name TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL)',
  );
  return db;
}

export async function dumpDb() {
  const data = (await getDb().getAllAsync('SELECT * FROM repo_cache')) as {
    name: string;
    data: string;
  }[];

  for (const row of data) {
    console.log(`--- ${row.name} ---\n${row.data}`);
  }
}

export const datasyncStorage: RepositoryStorage = {
  get: (name) =>
    getDb().getFirstSync<{ data: string }>(
      'SELECT data FROM repo_cache WHERE name = ?',
      name,
    )?.data ?? null,
  set: (name, value) => {
    getDb().runSync(
      'INSERT OR REPLACE INTO repo_cache (name, data) VALUES (?, ?)',
      name,
      value,
    );
  },
  clear: (name: string) => {
    getDb().runSync('DELETE FROM repo_cache WHERE name = ?', name);
  },
};
