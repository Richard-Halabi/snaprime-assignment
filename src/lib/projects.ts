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
 * This is the entry point of the processing pipeline. A project document is
 * created immediately after the user submits a website URL so every subsequent
 * step (website extraction, AI generation, ad generation, editing, etc.)
 * updates the same Firestore document.
 *
 * Initial project state:
 * - status = "processing"
 * - brandProfile = null
 * - ads = []
 *
 * @param url Website submitted by the user.
 * @returns Firestore document ID.
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
 * Returns the complete project document or null if the document
 * does not exist.
 *
 * @param id Firestore project ID.
 * @returns The project or null.
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
 * Updates one or more project fields.
 *
 * Uses Firestore's partial update functionality so only the supplied
 * fields are modified.
 *
 * Typical uses:
 * - Updating project status
 * - Saving the generated brand profile
 * - Saving processing metadata
 *
 * @param id Firestore project ID.
 * @param data Fields to update.
 */
export async function updateProject(
  id: string,
  data: Partial<Project>,
): Promise<void> {
  await updateDoc(doc(db, 'projects', id), data)
}

/**
 * Replaces the project's advertisements.
 *
 * Used after the initial AI generation or whenever ads are
 * regenerated or edited.
 *
 * @param projectId Firestore project ID.
 * @param ads Complete list of advertisements.
 */
export async function updateAds(projectId: string, ads: Ad[]): Promise<void> {
  await updateDoc(doc(db, 'projects', projectId), {
    ads,
  })
}

/**
 * Updates the current processing status.
 *
 * This status drives the frontend progress indicator while the
 * backend pipeline is executing.
 *
 * @param id Firestore project ID.
 * @param status Current processing status.
 */
export async function updateStatus(
  id: string,
  status: Project['status'],
): Promise<void> {
  await updateDoc(doc(db, 'projects', id), {
    status,
  })
}
