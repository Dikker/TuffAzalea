import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, doc, getDoc, setDoc, deleteDoc, 
  collection, getDocs, onSnapshot, getDocFromServer,
  query, orderBy
} from 'firebase/firestore';
import { UserProfile, UserContribution, SystemLog } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: The app will break without this line
export const auth = getAuth();

// Error Handling Infrastructure complying with the 'firebase-integration' skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Check Firestore link
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test-connection-doc', 'test'));
    console.log("Firestore connection check completed successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Mobile or web client is offline.");
    } else {
      console.warn("Firestore link initialized (offline mode or expected permission denied for test document).");
    }
  }
}

// Call connection check immediately
testFirestoreConnection();

// Helpers for syncing data cleanly
const USERS_COLLECTION = 'users';
const CONTRIBUTIONS_COLLECTION = 'contributions';
const COMMUNITY_COLLECTION = 'community_posts';
const LOGS_COLLECTION = 'system_logs';

// User Profile Operations
export async function getFirebaseUsers(): Promise<UserProfile[]> {
  try {
    const qSnap = await getDocs(collection(db, USERS_COLLECTION));
    return qSnap.docs.map(docSnap => docSnap.data() as UserProfile);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, USERS_COLLECTION);
  }
}

export async function saveFirebaseUser(user: UserProfile): Promise<void> {
  const path = `${USERS_COLLECTION}/${user.uid}`;
  try {
    await setDoc(doc(db, USERS_COLLECTION, user.uid), user);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// User Contributions Operations
export async function getFirebaseContributions(): Promise<UserContribution[]> {
  try {
    const qSnap = await getDocs(query(collection(db, CONTRIBUTIONS_COLLECTION), orderBy('createdAt', 'desc')));
    return qSnap.docs.map(docSnap => docSnap.data() as UserContribution);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, CONTRIBUTIONS_COLLECTION);
  }
}

export async function saveFirebaseContribution(contribution: UserContribution): Promise<void> {
  const path = `${CONTRIBUTIONS_COLLECTION}/${contribution.id}`;
  try {
    await setDoc(doc(db, CONTRIBUTIONS_COLLECTION, contribution.id), contribution);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteFirebaseContribution(id: string): Promise<void> {
  const path = `${CONTRIBUTIONS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, CONTRIBUTIONS_COLLECTION, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Community Posts Operations
export async function getFirebaseCommunityPosts(): Promise<any[]> {
  try {
    const qSnap = await getDocs(query(collection(db, COMMUNITY_COLLECTION), orderBy('timestamp', 'desc')));
    return qSnap.docs.map(docSnap => docSnap.data());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COMMUNITY_COLLECTION);
  }
}

export async function saveFirebaseCommunityPost(post: any): Promise<void> {
  const path = `${COMMUNITY_COLLECTION}/${post.id}`;
  try {
    await setDoc(doc(db, COMMUNITY_COLLECTION, post.id), post);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// System Logs Operations
export async function getFirebaseSystemLogs(): Promise<SystemLog[]> {
  try {
    const qSnap = await getDocs(query(collection(db, LOGS_COLLECTION), orderBy('timestamp', 'desc')));
    return qSnap.docs.map(docSnap => docSnap.data() as SystemLog);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, LOGS_COLLECTION);
  }
}

export async function saveFirebaseSystemLog(log: SystemLog): Promise<void> {
  const path = `${LOGS_COLLECTION}/${log.id}`;
  try {
    await setDoc(doc(db, LOGS_COLLECTION, log.id), log);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
