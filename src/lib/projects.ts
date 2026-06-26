// Firebase
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
// Types
import type { Ad, Project } from '#/types/project'

/**
 * Creates a new project in Firestore.
 *
 * This is the entry point of the entire pipeline.
 * When the user submits a website URL, a new project document
 * is created immediately so every subsequent processing step
 * (extraction, AI generation, editing, regeneration) updates
 * the same document instead of creating new records.
 *
 * Initial document state:
 * - status = "processing"
 * - brandProfile = null
 * - ads = []
 *
 * @param url Website URL submitted by the user.
 * @returns The Firestore document ID of the newly created project.
 */
export async function saveProject(url: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'projects'), {
    url,
    status: 'processing',
    createdAt: serverTimestamp(),
    brandProfile: null,
    ads: [],
  })

  return docRef.id
}

/**
 * Retrieves a project from Firestore.
 *
 * Used whenever the UI needs the latest state of a project.
 * Returns null if the project cannot be found.
 *
 * @param id Firestore project document ID.
 * @returns The project or null if it does not exist.
 */
export async function getProject(id: string): Promise<Project | null> {
  const snapshot = await getDoc(doc(db, 'projects', id))

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Project
}

/**
 * Updates any top-level project fields.
 *
 * Intended for long-running pipeline steps such as:
 * - storing the extracted brand profile
 * - updating project status
 * - storing generation cost
 * - storing processing metadata
 *
 * Uses a partial update so existing data is preserved.
 *
 * @param id Firestore project document ID.
 * @param data Partial project fields to update.
 */
export async function updateProject(
  id: string,
  data: Partial<Project>,
): Promise<void> {
  await updateDoc(doc(db, 'projects', id), {
    ...data,
  })
}

/**
 * Replaces the project's ads collection.
 *
 * This is used when:
 * - ads are generated for the first time
 * - a single ad is regenerated
 * - the user edits ad content
 *
 * Only the ads field is updated, ensuring that the
 * brand profile and other project metadata remain untouched.
 *
 * @param projectId Firestore project document ID.
 * @param ads Updated list of ads.
 */
export async function updateAd(projectId: string, ads: Ad[]): Promise<void> {
  await updateDoc(doc(db, 'projects', projectId), {
    ads,
  })
}

/**
 * Updates the project's processing status.
 *
 * Used by the backend pipeline so the frontend can display
 * progress to the user.
 *
 * Typical values:
 * - processing
 * - extracting
 * - generating-brand
 * - generating-ads
 * - completed
 * - failed
 *
 * @param id Firestore project document ID.
 * @param status Current pipeline status.
 */
export async function updateStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(db, 'projects', id), {
    status,
  })
}
