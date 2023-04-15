import { useMutation, useQuery } from "@tanstack/react-query"
import moment from "moment"
import { useState } from "react"
import NewPostInput from "../components/molecules/NewPostInput"
import { IPostComment, IPostCommentBody, postCommentBodySchema, replyBodySchema } from "../schemas/comments"
import { postPageSchema } from "../schemas/posts"
import { api } from "../services/axios"
import { DefaultUserProfilePicture as defPic } from "../urls"
import { useParams } from "react-router-dom"
import queryClient from "../services/queryClient"
import Replies from "../components/organisms/Replies"

const PostPage: React.FC = () => {
  const [commentingId, setCommentingId] = useState<number | null>(null)
  const { postId } = useParams()

  const handleReplyComment = (commentaryId: number) => {
    setCommentingId((old) => (old === commentaryId ? null : commentaryId))
  }

  const { data: rawPost } = useQuery<unknown>({
    queryKey: ["post", postId],
    queryFn: () => api.get("/posts/" + postId).then((res) => res.data),
    staleTime: 1000 * 60, // 1 minuto
  })

  const { data: rawCommentaries } = useQuery<IPostComment[]>({
    queryKey: ["postComments", postId],
    queryFn: () => api.get(`/posts/${postId}/comments`).then((res) => res.data),
    staleTime: 1000 * 60,
  })

  const { mutate: mutateAddNewComment } = useMutation<IPostCommentBody>({
    mutationFn: async (commentBody) => {
      return api.post(`/posts/${postId}/comments`, commentBody)
    },
    onSuccess: () => queryClient.invalidateQueries(["postComments", postId]),
  })

  const parsedPost = rawPost ? postPageSchema.safeParse(rawPost) : null
  const post = parsedPost?.success ? parsedPost.data : null
  const commentaries = rawCommentaries?.sort((a, b) => (a.created_at > b.created_at ? 1 : -1))

  return (
    <div className="mt-6 px-6">
      <div className="flex gap-4">
        <div className="flex basis-36 flex-col items-center">
          <div className="relative z-20 mb-3 h-24 w-24 shrink-0">
            <div className="img-cover z-10 bg-emerald-500" />
            <img
              src={post?.profile_pic ?? defPic}
              className="relative z-20 h-full w-full object-cover"
            />
          </div>
          <div className="leading-4">
            <h2 className="text-lg font-semibold text-emerald-400">{post?.name}</h2>
            <p className="text-gray-400">@{post?.username}</p>
          </div>
        </div>
        <div className="flex grow flex-col">
          <div className="">
            <p className="mb-6 text-lg">{post?.text}</p>
            {post?.image && (
              <div className="h-[320px] w-full shrink-0 overflow-hidden">
                <img
                  src={post?.image ?? ""}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="">
            <div className="flex w-full max-w-[720px] flex-col gap-2">
              {commentaries &&
                commentaries.map((comment) => {
                  if (String(comment.post_id) != postId) return null
                  return (
                    <div>
                      <div
                        key={comment.comment_id}
                        className="flex gap-2 px-4 py-2"
                      >
                        <div className="flex flex-col items-center">
                          <div className="h-14 w-14 shrink-0">
                            <img
                              src={comment.profile_pic ?? defPic}
                              className="relative z-20 h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h2 className="text-xs text-emerald-300">{comment.name}</h2>
                            <span className=" text-xs italic text-gray-500">
                              {moment(comment.created_at).fromNow()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{comment.text}</p>
                          <div className="mt-auto flex gap-2">
                            <span className="cursor-pointer text-xs text-gray-400 underline">Curtir</span>
                            <span
                              className="cursor-pointer text-xs text-gray-400 underline"
                              onClick={() => handleReplyComment(comment.comment_id)}
                            >
                              Responder
                            </span>
                          </div>
                        </div>
                      </div>

                        <Replies commentId={comment.comment_id} postId={Number(postId)} commentingId={commentingId}/>
                    </div>
                  )
                })}
              <div className="mt-6">
                <NewPostInput
                  placeholder="Deixe um comentário sobre este post."
                  mutate={mutateAddNewComment}
                  fieldsParser={postCommentBodySchema}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostPage
