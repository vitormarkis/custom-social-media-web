import * as Popover from "@radix-ui/react-popover"
import { Bookmark } from "@styled-icons/bootstrap/Bookmark"
import { BookmarkFill } from "@styled-icons/bootstrap/BookmarkFill"
import { Chat } from "@styled-icons/bootstrap/Chat"
import { ThreeDots } from "@styled-icons/bootstrap/ThreeDots"
import { useMutation } from "@tanstack/react-query"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import { IPostLikesBody } from "../../../schemas/post_likes"
import { api } from "../../../services/axios"
import queryClient from "../../../services/queryClient"
import { useLamaAuth } from "../../../_features/LamaAuth/context"
import { Props } from "./types"
import { DefaultUserProfilePicture as defPic } from "../../../urls"

const Post: React.FC<Props> = ({ post, likedPosts }) => {
  const { currentUser: me } = useLamaAuth()
  const postCreatedAt = moment(post.post_created_at).fromNow()
  const navigate = useNavigate()

  const { mutate: togglePostLikeMutate } = useMutation({
    mutationFn: (toggleLikePayload: IPostLikesBody) => api.post("/posts/liked-posts", toggleLikePayload),
    onSuccess: () => queryClient.invalidateQueries(["post-likes", me?.id]),
  })

  function handleTogglePostLike() {
    togglePostLikeMutate({ user_id: me!.id, post_id: post.post_id })
  }

  return (
    <article
      key={post.post_id}
      className="relative flex cursor-pointer items-start border-b border-b-black bg-gray-800"
    >
      <div className="flex h-full w-12 shrink-0 flex-col overflow-hidden border-r border-r-black">
        <img
          className="block w-full grow object-cover"
          src={post.profile_pic ?? defPic}
        />
      </div>
      <div
        onClick={() => navigate("/post/" + post.post_id)}
        className="flex h-full w-full flex-col items-start p-2"
      >
        <div className="flex w-full items-center gap-2">
          <div>
            {post.username === me?.username ? (
              <p className=" font-semibold text-emerald-400">{post.username}</p>
            ) : (
              <p className=" text-gray-200">{post.username}</p>
            )}
          </div>
          <div className="flex grow">
            <p className="text-xs italic text-gray-500">{post.post_created_at && postCreatedAt}</p>
            <p className="ml-auto text-xs italic text-gray-500">
              {post.comments_amount} {post.comments_amount === 1 ? "comentário" : "comentários"}
            </p>
          </div>
        </div>
        <div className="">
          {post.username === me?.username ? (
            <p className="">{post.text}</p>
          ) : (
            <p className=" text-gray-400">{post.text}</p>
          )}
        </div>
      </div>

      <div className="ml-auto flex h-full flex-col justify-around border-l border-l-gray-900">
        <div className="flex grow items-center justify-center border-b border-b-gray-900 py-1 px-2">
          <div
            onClick={handleTogglePostLike}
            className="flex h-8 w-full items-center justify-center rounded-md p-2 hover:bg-gray-600 active:bg-gray-700"
          >
            {likedPosts ? (
              likedPosts?.includes(post.post_id) ? (
                <BookmarkFill height={16} />
              ) : (
                <Bookmark height={16} />
              )
            ) : (
              <Bookmark height={16} />
            )}
          </div>
        </div>
        <div className="flex grow items-center justify-center border-b border-b-gray-900 py-1 px-2">
          <div
            onClick={handleTogglePostLike}
            className="flex h-8 w-full items-center justify-center rounded-md p-2 hover:bg-gray-600 active:bg-gray-700"
          >
            <Chat height={16} />
          </div>
        </div>
        <Popover.Root>
          <Popover.Trigger asChild>
            <div className="flex grow items-center justify-center py-1 px-2">
              <div
                onClick={handleTogglePostLike}
                className="flex h-8 w-full items-center justify-center rounded-md p-2 hover:bg-gray-600 active:bg-gray-700"
              >
                <ThreeDots height={16} />
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content
            asChild
            align="end"
          >
            <div className="z-30 rounded-lg bg-slate-700 py-1 px-1">
              <button
                className="flex w-full items-center gap-2 rounded-md py-0.5 px-2 text-gray-400 hover:bg-slate-600 hover:text-white"
                // onClick={handleLogoutButton}
              >
                <p>Editar</p>
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-md py-0.5 px-2 text-gray-400 hover:bg-slate-600 hover:text-white"
                // onClick={handleLogoutButton}
              >
                <p>Excluir</p>
              </button>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </article>
  )
}

export default Post
