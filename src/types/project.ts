/**
 * Represents the AI-generated understanding of a company's brand.
 *
 * This profile is generated from the extracted website content and acts as
 * the source of truth for all advertisement generation. Every advertisement
 * created by the application should be based on this profile rather than the
 * raw website content.
 */
export interface BrandProfile {
  /**
   * Official company or brand name.
   *
   * Used throughout the UI and as context for future AI prompts.
   */
  company: string

  /**
   * Short summary describing what the company does.
   *
   * Serves as the primary business description displayed to the user.
   */
  description: string

  /**
   * Intended target audience for the company's products or services.
   *
   * Used by the AI to tailor generated advertisements.
   */
  audience: string

  /**
   * The company's primary value proposition.
   *
   * Explains why customers should choose this company over competitors.
   */
  valueProposition: string

  /**
   * The inferred communication style of the brand.
   *
   * Examples include:
   * - Professional
   * - Friendly
   * - Luxury
   * - Minimal
   * - Playful
   */
  tone: string

  /**
   * Suggested brand colors inferred from the website.
   *
   * Used to help generate visually consistent advertisements.
   */
  colors: string[]

  /**
   * Candidate marketing images extracted from the website.
   *
   * These images may later be selected by the user or reused within
   * generated advertisements.
   */
  images: string[]
}

/**
 * Represents a single AI-generated advertisement.
 *
 * Each project may contain multiple advertisements that can be edited,
 * regenerated independently, and persisted to Firestore.
 */
export interface Ad {
  /**
   * ad idea
   */
  idea: string
  /**
   * Unique identifier for the advertisement.
   *
   * Used when updating or regenerating a specific advertisement.
   */
  id: string

  /**
   * Primary advertisement headline.
   *
   * Intended to immediately capture the user's attention.
   */
  headline: string

  /**
   * Main advertising copy.
   *
   * This is the largest block of text shown in the advertisement.
   */
  primaryText: string

  /**
   * Supporting advertisement description.
   *
   * Provides additional marketing context beneath the primary text.
   */
  description: string

  /**
   * Call-to-action presented to the customer.
   *
   * Examples:
   * - Learn More
   * - Shop Now
   * - Get Started
   */
  callToAction: string

  /**
   * URL of the image associated with the advertisement.
   *
   * Initially selected from the extracted website images but may later
   * be replaced by the user.
   */
  image: string
}

/**
 * Represents a complete advertisement generation project.
 *
 * A project tracks the full lifecycle from the submitted website URL,
 * through website extraction and AI generation, to the final editable
 * advertisements stored in Firestore.
 */
export interface Project {
  /**
   * Firestore document identifier.
   *
   * Undefined before the project has been persisted.
   */
  id?: string

  /**
   * Website URL submitted by the user.
   *
   * Acts as the starting point for the entire processing pipeline.
   */
  url: string

  /**
   * Timestamp indicating when the project was created.
   *
   * Used for sorting, auditing and displaying project history.
   */
  createdAt: Date

  /**
   * Current processing stage of the project.
   *
   * Allows both the backend and UI to track long-running operations
   * such as website extraction and AI generation.
   */
  status:
    | 'processing'
    | 'extracting'
    | 'generating-brand'
    | 'generating-ads'
    | 'completed'
    | 'failed'

  /**
   * AI-generated understanding of the website.
   *
   * Populated after successful website extraction and brand analysis.
   */
  brandProfile?: BrandProfile

  /**
   * Collection of generated advertisements.
   *
   * Initially empty and populated after advertisement generation.
   */
  ads: Ad[]
}

/**
 * Structured representation of a rendered website.
 *
 * This model is produced after Browserless renders the page and the HTML
 * is parsed. It intentionally contains only the information required by
 * the AI model instead of the entire HTML document.
 */
export interface WebsiteContent {
  /**
   * Document title extracted from the rendered page.
   */
  title: string

  /**
   * Meta description describing the website.
   */
  description: string

  /**
   * Visible textual content extracted from the page.
   *
   * This serves as the primary input for brand analysis.
   */
  text: string

  /**
   * Candidate image URLs extracted from the website.
   *
   * These images can later be used within generated advertisements.
   */
  images: string[]
}

export type ProjectResult = {
  projectId: string
  brandProfile: BrandProfile
  ads: Ad[]
}
