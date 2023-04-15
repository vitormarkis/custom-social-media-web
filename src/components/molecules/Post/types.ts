import { ILikedPostArray } from "../../../schemas/post_likes"

export interface APIPost {
  post_id: number
  profile_pic: string | null
  username: string
  text: string
  post_created_at: Date
  post_author_id: number
  comments_amount: number
}

export interface Props {
  post: APIPost
  likedPosts: ILikedPostArray
}
