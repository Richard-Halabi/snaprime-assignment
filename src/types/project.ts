export interface BrandProfile {
  company: string
  audience: string
  valueProposition: string
  tone: string
  colors: string[]
  images: string[]
}

export interface Ad {
  id: string
  headline: string
  primaryText: string
  description: string
  cta: string
  image: string
}

export interface Project {
  id?: string
  url: string
  createdAt: Date
  brandProfile?: BrandProfile
  ads: Ad[]
}

/**
 * Structured representation of a rendered website.
 */
export interface WebsiteContent {
  title: string
  description: string
  text: string
  images: string[]
}
