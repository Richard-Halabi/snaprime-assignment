// Firebase
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './firebase'

// Types
import type { Ad, Project, ProjectResult } from '#/types/project'

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
 * Updates a single advertisement within a project.
 *
 * The advertisement is matched by its unique ID and replaced while every
 * other advertisement remains unchanged.
 *
 * This is used when:
 * - A user edits an advertisement.
 * - A single advertisement is regenerated.
 *
 * @param projectId Firestore project ID.
 * @param updatedAd Advertisement to persist.
 */
export async function updateAd(
  project: ProjectResult,
  updatedAd: Ad,
): Promise<void> {
  console.log('updateAd 1')

  const ads = project.ads.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad))

  console.log('updateAd 3')

  await updateDoc(doc(db, 'projects', project.projectId), {
    ads,
  })

  console.log('updateAd 4')
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

/**
 * Retrieves the first project associated with a website URL.
 *
 * Used to determine whether a website has already been processed before
 * executing the extraction and AI generation pipeline.
 *
 * If a matching project exists, the previously generated brand profile and
 * advertisements can be returned immediately, avoiding unnecessary calls to
 * Browserless, Gemini, and Firestore writes.
 *
 * @param url Website URL to search for.
 *
 * @returns The matching project if one exists; otherwise `null`.
 */
export async function getProjectByUrl(url: string): Promise<Project | null> {
  const q = query(collection(db, 'projects'), where('url', '==', url))

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return null
  }

  const document = snapshot.docs[0]

  return {
    id: document.id,
    ...document.data(),
  } as Project
}
