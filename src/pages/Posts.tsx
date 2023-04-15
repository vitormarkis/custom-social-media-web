import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { IPostBody, postBodySchema } from "../schemas/posts"
import { api } from "../services/axios"
import queryClient from "../services/queryClient"

import { z } from "zod"
import NewPostInput from "../components/molecules/NewPostInput"
import Post from "../components/molecules/Post"
import { APIPost } from "../components/molecules/Post/types"
import FollowSuggestion from "../components/organisms/FollowSuggestion"
import { likedPostSchemaArray, postLikesSchema } from "../schemas/post_likes"
import { useLamaAuth } from "../_features/LamaAuth/context"

const Posts: React.FC = () => {
  const { reset } = useForm<IPostBody>()
  const { currentUser: me } = useLamaAuth()

  const { mutate: addNewPostMutate } = useMutation({
    mutationFn: (newPostData: IPostBody) => api.post("/posts", newPostData),
    onSuccess: () => {
      queryClient.invalidateQueries()
      reset()
    },
    onError: console.log,
  })

  const { data: rawPosts } = useQuery<APIPost[]>({
    queryKey: ["posts", me?.id],
    queryFn: () => api.get("/posts").then((response) => response.data),
    staleTime: 1000 * 10,
    onError: console.log,
  })

  const { data: likedPosts } = useQuery({
    queryKey: ["post-likes", me?.id],
    queryFn: () => api.get("/posts/liked-posts").then((res) => z.array(postLikesSchema).parse(res.data)),
    staleTime: 1000 * 60, // 1 minuto
    select: (likedPosts) => likedPostSchemaArray.parse(likedPosts),
  })

  if (!likedPosts || !rawPosts) return <></>

  const posts = rawPosts?.sort((a, b) => (a.post_created_at > b.post_created_at ? 1 : -1))

  return (
    <div className="flex">
      <div className="custom-scroll flex w-full max-w-[900px] border-x border-x-gray-800">
        <main className="relative flex grow flex-col justify-between">
          <section className="chat custom-scroll flex flex-col-reverse overflow-y-scroll">
            <div></div>
            <div className="flex flex-col ">
              {posts &&
                likedPosts &&
                posts.map((post) => (
                  <Post
                    key={post.post_id}
                    post={post}
                    likedPosts={likedPosts}
                  />
                ))}
            </div>
          </section>
          <div className="w-full gap-2 border-t border-t-black bg-gray-800 px-4 py-4">
            <NewPostInput
              placeholder="Fale um pouco sobre o que você está pensando..."
              className=""
              mutate={addNewPostMutate}
              fieldsParser={postBodySchema}
            />
          </div>
        </main>
      </div>

      <FollowSuggestion />
    </div>
  )
}

export default Posts
