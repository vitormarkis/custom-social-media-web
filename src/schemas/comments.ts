import { z } from "zod"
import { postSchema } from "./posts"
import { userSchema } from "./users"

export const commentsSchema = z.object({
  comment_id: z.number(),
  text: z.string(),
  created_at: z.date(),
  author_id: z.number().positive(),
})

export const postCommentBodySchema = z.object({
  text: commentsSchema.shape.text,
})

export const commentReplySchema = z.object({
  reply_id: z.number(),
  text: z.string().max(249),
  created_at: z.date(),
  author_id: z.number().positive(),
  comment_id: z.number().positive(),
})

export const replyBodySchema = z.object({
  text: commentReplySchema.shape.text,
  comment_id: commentReplySchema.shape.comment_id,
})

export const postCommentsSchema = z.object({
  comment_id: commentsSchema.shape.comment_id,
  text: commentsSchema.shape.text,
  created_at: commentsSchema.shape.created_at,
  author_id: commentsSchema.shape.author_id,
  name: userSchema.shape.name,
  username: userSchema.shape.username,
  profile_pic: userSchema.shape.profile_pic,
  post_id: postSchema.shape.id,
})

export type IPostComment = z.infer<typeof postCommentsSchema>
export type IPostCommentBody = z.infer<typeof postCommentBodySchema>
