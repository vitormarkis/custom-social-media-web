import { useMutation, useQuery } from "@tanstack/react-query"
import {
  commentReplyFieldsSchema,
  commentReplyPayloadBodySchema,
  ICommentReplyBody,
  ICommentReplyFields,
  IPostCommentReply,
  postCommentReplySchema,
} from "../../../schemas/replies"
import { api } from "../../../services/axios"

import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import queryClient from "../../../services/queryClient"
import moment from "moment"
import { DefaultUserProfilePicture as defPic } from "../../../urls"

interface Props {
  commentId: number
  postId: number
  commentingId: number | null
}

const Replies: React.FC<Props> = ({ commentId: comment_id, postId, commentingId }) => {
  if (comment_id !== commentingId) return null
  const { register, reset, handleSubmit } = useForm<ICommentReplyFields>()

  const { data: rawReplies, isLoading } = useQuery<IPostCommentReply[] | []>({
    queryKey: ["postCommentReplies", comment_id],
    queryFn: async () => {
      const res = await api.post(`/posts/${postId}/comments/replies`, { comment_id })
      return res.data
    },
    staleTime: 1000 * 60,
    select: unkReplies => {
      const parse = z.array(postCommentReplySchema).safeParse(unkReplies)
      return parse.success ? parse.data : []
    },
  })

  const { mutate: mutataAddNewReply } = useMutation({
    mutationFn: (commentReplyBody: ICommentReplyBody) => {
      return api.post(`/posts/${postId}/comments/replies/create`, commentReplyBody)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["postCommentReplies", comment_id])
      reset()
    },
  })

  const replySubmitHandler: SubmitHandler<ICommentReplyFields> = formData => {
    const { text } = commentReplyFieldsSchema.parse(formData)
    const replyBody = commentReplyPayloadBodySchema.parse({
      comment_id: comment_id,
      text,
    })
    mutataAddNewReply(replyBody)
  }

  const replies = rawReplies

  return (
    <div className="my-6 border border-gray-600 p-4 ">
      <div className="mb-4">
        {replies?.map(reply => (
          <div
            key={reply.reply_id}
            className="flex gap-2 p-2"
          >
            <div className="flex flex-col items-center">
              <div className="relative h-8 w-8 shrink-0">
                <div className="offset-banana z-10 bg-teal-500" />

                <img
                  src={reply?.profile_pic ?? defPic}
                  className="relative z-20 h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xs text-teal-300">{reply.name}</h2>
                <span className=" text-xs italic text-gray-500">{moment(reply.created_at).fromNow()}</span>
              </div>
              <p className="text-sm text-gray-300">{reply.text}</p>
              <div className="mt-auto flex gap-2">
                <span className="cursor-pointer text-[0.625rem] text-gray-400 ">Curtir</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <form
          onSubmit={handleSubmit(replySubmitHandler)}
          className={"flex h-full w-full flex-row overflow-hidden rounded-xl"}
        >
          <textarea
            {...register("text")}
            placeholder="Deixe uma reposta à esse comentário."
            className="custom-scroll block w-full  resize-none bg-gray-700 p-3"
          />
          <button
            type="submit"
            className="block  bg-indigo-600 px-8 py-2"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}

export default Replies
