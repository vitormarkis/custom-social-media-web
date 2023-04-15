import { z } from "zod"
import { userSchema } from "./users"
export const postBodySchema = z.object({
  text: z.string().max(449),
  image: z.string().url().optional(),
})

export const postSchema = z.object({
  id: z.number().positive(),
  text: z.string().max(449),
  image: z.string().url().nullish(),
  author_id: z.number().positive(),
  created_at: z.string().transform((createdAt) => new Date(createdAt)),
})

export const postPageSchema = userSchema
  .pick({
    id: true,
    name: true,
    username: true,
    profile_pic: true,
  })
  .merge(postSchema)

export const likedPostSchema = z.object({
  post_id: postSchema.shape.id,
  text: postSchema.shape.text,
  likes_amount: z.number(),
  comments_amount: z.number(),
  profile_pic: userSchema.shape.profile_pic,
  author_id: postSchema.shape.author_id,
  username: userSchema.shape.username,
  name: userSchema.shape.name,
})

export type IPostPage = z.infer<typeof postPageSchema>
export type ILikedPost = z.infer<typeof likedPostSchema>

export type IPostInput = z.input<typeof postSchema>
export type IPost = z.output<typeof postSchema>
export type IPostBody = z.infer<typeof postBodySchema>
