import fs from 'node:fs';
import path from 'node:path';
import { DocumentAnalysis } from './types';

interface LocalDatabaseSchema {
  version: number;
  updatedAt: string;
  documents: DocumentAnalysis[];
}

let inMemoryDb: LocalDatabaseSchema | null = null;

function getDbFilePath(): string {
  // In serverless environments (Vercel, AWS Lambda), write to /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    return path.join('/tmp', 'dev.db');
  }
  return path.join(process.cwd(), 'dev.db');
}

function initDb(): LocalDatabaseSchema {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  const dbPath = getDbFilePath();
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.documents)) {
        inMemoryDb = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('dev.db read notice, creating fresh store:', err);
  }

  const initial: LocalDatabaseSchema = {
    version: 1,
    updatedAt: new Date().toISOString(),
    documents: []
  };

  inMemoryDb = initial;

  try {
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    // Graceful fallback in environments with read-only file systems
    console.warn('dev.db init write notice (in-memory mode active):', err);
  }

  return inMemoryDb;
}

function persistDb(db: LocalDatabaseSchema): void {
  inMemoryDb = db;
  const dbPath = getDbFilePath();
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    // If running in a read-only filesystem or serverless context without write permissions,
    // preserve state in inMemoryDb for the current instance lifecycle
    console.warn('dev.db persist notice (persisted in-memory):', err);
  }
}

/**
 * Retrieve documents filtered strictly by authenticated user ownership.
 * Unauthenticated requests return an empty list to prevent cross-account data leakage.
 */
export function getDbDocuments(userId?: string, userEmail?: string): DocumentAnalysis[] {
  const db = initDb();
  if (!userId && !userEmail) {
    return [];
  }
  const cleanId = (userId || '').trim();
  const cleanEmail = (userEmail || '').trim().toLowerCase();

  return (db.documents || []).filter((doc) => {
    if (cleanId && doc.userId && doc.userId === cleanId) return true;
    if (cleanEmail && doc.userEmail && doc.userEmail.trim().toLowerCase() === cleanEmail) return true;
    return false;
  });
}

/**
 * Retrieve a single document by ID, enforcing user ownership.
 */
export function getDbDocumentById(docId: string, userId?: string, userEmail?: string): DocumentAnalysis | null {
  const db = initDb();
  const cleanId = (userId || '').trim();
  const cleanEmail = (userEmail || '').trim().toLowerCase();

  const doc = (db.documents || []).find((d) => d.id === docId);
  if (!doc) return null;

  const isOwner =
    (!doc.userId && !doc.userEmail) ||
    (cleanId && doc.userId === cleanId) ||
    (cleanEmail && doc.userEmail && doc.userEmail.trim().toLowerCase() === cleanEmail);

  if (!isOwner) {
    console.warn(`Access denied to document ${docId} for user ${cleanId || cleanEmail}`);
    return null;
  }
  return doc;
}

/**
 * Save or update a document in the database with authenticated user ownership.
 */
export function saveDbDocument(doc: DocumentAnalysis, userId?: string, userEmail?: string): boolean {
  try {
    const db = initDb();
    const cleanId = (userId || doc.userId || '').trim();
    const cleanEmail = (userEmail || doc.userEmail || '').trim().toLowerCase();

    // Ensure document is stamped with user identity
    if (cleanId && !doc.userId) doc.userId = cleanId;
    if (cleanEmail && !doc.userEmail) doc.userEmail = cleanEmail;

    const existingIdx = db.documents.findIndex((d) => d.id === doc.id);
    if (existingIdx >= 0) {
      const existing = db.documents[existingIdx];
      // Ownership check: Prevent a user from modifying another user's document
      const isOwner =
        (!existing.userId && !existing.userEmail) ||
        (cleanId && existing.userId === cleanId) ||
        (cleanEmail && existing.userEmail && existing.userEmail.trim().toLowerCase() === cleanEmail);

      if (!isOwner) {
        console.warn(`Denied unauthorized attempt to overwrite document ${doc.id}`);
        return false;
      }

      // Preserve ownership metadata
      doc.userId = doc.userId || existing.userId;
      doc.userEmail = doc.userEmail || existing.userEmail;
      db.documents[existingIdx] = doc;
    } else {
      db.documents.unshift(doc);
    }
    db.updatedAt = new Date().toISOString();
    persistDb(db);
    return true;
  } catch (err) {
    console.error('Failed to save document:', err);
    return false;
  }
}

/**
 * Delete a document from the database, enforcing user ownership.
 */
export function deleteDbDocument(docId: string, userId?: string, userEmail?: string): boolean {
  try {
    const db = initDb();
    const cleanId = (userId || '').trim();
    const cleanEmail = (userEmail || '').trim().toLowerCase();

    const existing = db.documents.find((d) => d.id === docId);
    if (!existing) return true;

    // Ownership check
    const isOwner =
      (!existing.userId && !existing.userEmail) ||
      (cleanId && existing.userId === cleanId) ||
      (cleanEmail && existing.userEmail && existing.userEmail.trim().toLowerCase() === cleanEmail);

    if (!isOwner) {
      console.warn(`Denied unauthorized attempt to delete document ${docId}`);
      return false;
    }

    db.documents = db.documents.filter((d) => d.id !== docId);
    db.updatedAt = new Date().toISOString();
    persistDb(db);
    return true;
  } catch (err) {
    console.error('Failed to delete document:', err);
    return false;
  }
}

/**
 * Clear all documents belonging strictly to the specified user.
 * Other users' documents are protected and remain untouched.
 */
export function clearDbDocuments(userId?: string, userEmail?: string): boolean {
  try {
    const cleanId = (userId || '').trim();
    const cleanEmail = (userEmail || '').trim().toLowerCase();

    if (!cleanId && !cleanEmail) {
      return false; // Refuse unauthenticated bulk wipe
    }

    const db = initDb();
    db.documents = db.documents.filter((d) => {
      const belongsToThisUser =
        (cleanId && d.userId && d.userId === cleanId) ||
        (cleanEmail && d.userEmail && d.userEmail.trim().toLowerCase() === cleanEmail);
      return !belongsToThisUser;
    });

    db.updatedAt = new Date().toISOString();
    persistDb(db);
    return true;
  } catch (err) {
    console.error('Failed to clear user documents:', err);
    return false;
  }
}
