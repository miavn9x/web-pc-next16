// MongoDB Schema cho Post Collection
export interface PostDocument {
  _id: string // MongoDB ObjectId
  title: string
  slug: string // URL-friendly version của title
  excerpt: string
  content: string // HTML content từ SunEditor
  status: "draft" | "published"

  // Author information
  author: {
    id: string
    name: string
    email?: string
  }

  // SEO và metadata
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }

  // Images
  featuredImage?: {
    url: string
    alt?: string
    caption?: string
    width?: number
    height?: number
  }

  images: Array<{
    url: string
    alt?: string
    caption?: string
    width?: number
    height?: number
    uploadedAt: Date
  }>

  // Categories và Tags
  categories: string[] // Array of category IDs
  tags: string[]

  // Engagement metrics
  stats: {
    views: number
    likes: number
    comments: number
    shares: number
  }

  // Publishing info
  publishedAt?: Date
  scheduledAt?: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Soft delete
  isDeleted: boolean
  deletedAt?: Date
}

// Mongoose Schema Example
export const PostSchema = {
  title: { type: String, required: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, maxlength: 500 },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
    index: true,
  },

  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: String,
  },

  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },

  featuredImage: {
    url: String,
    alt: String,
    caption: String,
    width: Number,
    height: Number,
  },

  images: [
    {
      url: { type: String, required: true },
      alt: String,
      caption: String,
      width: Number,
      height: Number,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  categories: [{ type: String, index: true }],
  tags: [{ type: String, index: true }],

  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },

  publishedAt: Date,
  scheduledAt: Date,

  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },

  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
};

// Indexes for performance
export const PostIndexes = [
  { status: 1, publishedAt: -1 }, // Published posts by date
  { "author.id": 1, createdAt: -1 }, // Posts by author
  { tags: 1, status: 1 }, // Posts by tags
  { slug: 1 }, // Unique slug lookup
  { createdAt: -1 }, // Recent posts
  { "stats.views": -1 }, // Popular posts
];
