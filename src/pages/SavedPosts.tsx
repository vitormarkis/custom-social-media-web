import * as Dialog from "@radix-ui/react-dialog"
import { Bookmark } from "@styled-icons/bootstrap/Bookmark"
import { BookmarkFill } from "@styled-icons/bootstrap/BookmarkFill"
import { ChatSquareDots } from "@styled-icons/bootstrap/ChatSquareDots"
import { XOctagon } from "@styled-icons/bootstrap/XOctagon"
import { useMutation, useQuery } from "@tanstack/react-query"
import moment from "moment"
import ReactDOM from "react-dom"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { ILikedPost, likedPostSchema } from "../schemas/posts"
import { IUserWhoLikeThePost } from "../schemas/post_likes"
import { api } from "../services/axios"
import queryClient from "../services/queryClient"
import { IRelationshipsId, relationshipSchema } from "../types/relationships"
import { useLamaAuth } from "../_features/LamaAuth/context"
import { DefaultUserProfilePicture as defPic } from "../urls"

// const relationships = [
//   {
//     relationship_id: 2,
//     followed_user_id: 1,
//   },
//   {
//     relationship_id: 71,
//     followed_user_id: 4,
//   },
//   {
//     relationship_id: 72,
//     followed_user_id: 6,
//   },
//   {
//     relationship_id: 86,
//     followed_user_id: 5,
//   },
// ]

const likedPosts = [
  {
    post_id: 10,
    text: "O barça vai vir forte esse ano, com a contratação do Roberto Carlos e do Didi, o Cristiano vai sofrer.",
    likes_amount: 7,
    comments_amount: 12,
    profile_pic: null,
    author_id: 5,
    username: "ikedias",
    name: "Michel Dias",
  },
  {
    post_id: 11,
    text: "Cara eu acho que nesse último grenal, não foi justo, eu acho que teve dedo das casas de apostas nesse jogo, porque...",
    likes_amount: 0,
    comments_amount: 1,
    profile_pic: "https://img.quizur.com/f/img60d0d76e470cb8.51574981.jpg?lastEdited=1624299378",
    author_id: 3,
    username: "leoschell",
    name: "Leonardo Schell",
  },
  {
    post_id: 15,
    text: "Autenticação com refresh token são mais seguras porque impossibilitam que o atacante possa ter acesso ao conteúdo da conta por muito tempo. Eu descobri que é muito melhor deixar as divs como display flex e ir usando grow e shrink do que ficar tentando ajustar o tamanho de tudo com width e max-width, principamente quando envolve view port!",
    likes_amount: 1,
    comments_amount: 0,
    profile_pic: "https://img.quizur.com/f/img60d0d76e470cb8.51574981.jpg?lastEdited=1624299378",
    author_id: 3,
    username: "leoschell",
    name: "Leonardo Schell",
  },
]

// const peopleWhoLikeThePost = [
//   {
//     user_id: 1,
//     profile_pic:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCe8ayX7udeRDac-2P_tDJkC7eGQ6QGe7C0A&usqp=CAU",
//     name: "Michel Dias",
//     created_at: "2023-03-09 14:02:30",
//   },
//   {
//     user_id: 1,
//     profile_pic:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCe8ayX7udeRDac-2P_tDJkC7eGQ6QGe7C0A&usqp=CAU",
//     name: "Michel Dias",
//     created_at: "2023-03-09 14:02:30",
//   },
//   {
//     user_id: 1,
//     profile_pic:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCe8ayX7udeRDac-2P_tDJkC7eGQ6QGe7C0A&usqp=CAU",
//     name: "Michel Dias",
//     created_at: "2023-03-09 14:02:30",
//   },
//   {
//     user_id: 1,
//     profile_pic:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCe8ayX7udeRDac-2P_tDJkC7eGQ6QGe7C0A&usqp=CAU",
//     name: "Michel Dias",
//     created_at: "2023-03-09 14:02:30",
//   },
//   {
//     user_id: 1,
//     profile_pic:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCe8ayX7udeRDac-2P_tDJkC7eGQ6QGe7C0A&usqp=CAU",
//     name: "Michel Dias",
//     created_at: "2023-03-09 14:02:30",
//   },
// ]

const SavedPosts: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser: me } = useLamaAuth()

  const { data: likedPosts } = useQuery<ILikedPost[]>({
    queryKey: ["liked-posts", me?.id],
    queryFn: () => api.get("/users/liked-posts").then((res) => z.array(likedPostSchema).parse(res.data)),
  })

  const likedPostsArray = likedPosts?.reduce((acc: number[], item) => (acc.push(item.post_id), acc), [])

  const { data: relationships } = useQuery<IRelationshipsId[]>({
    queryKey: ["relationships", me?.id],
    queryFn: () => api.get("/users/relationships").then((res) => z.array(relationshipSchema).parse(res.data)),
  })

  const followedUserIdArray = relationships?.reduce(
    (acc: number[], item) => (acc.push(item.followed_user_id), acc),
    []
  )

  // const [likedPostsArray, setLikedPostsArray] = useState(
  //   likedPosts.reduce((acc: number[], item) => (acc.push(item.post_id), acc), [])
  // )
  // const [followedUserIdArray, setFollowedUserIdArray] = useState(
  // )

  function handleToggleLikePost(postId: number) {}

  const { mutate } = useMutation({
    mutationFn: (followed_user_id: { followed_user_id: number }) =>
      api.put("/users/relationships", followed_user_id),
    onSuccess: (_, { followed_user_id }) => {
      const oldRelationships = queryClient.getQueryData<IRelationshipsId[]>(["relationships", me?.id])
      if (!oldRelationships) return
      const relationshipsArray = oldRelationships.reduce(
        (acc: number[], item) => (acc.push(item.followed_user_id), acc),
        []
      )
      const alreadyFollows: boolean = relationshipsArray?.includes(followed_user_id)
      const newRelationships = alreadyFollows
        ? oldRelationships?.filter((r) => r.followed_user_id !== followed_user_id)
        : [
            ...oldRelationships,
            { followed_user_id, relationship_id: Math.random().toString(25).substring(2, 9) },
          ]
      queryClient.setQueryData(["relationships", me?.id], newRelationships)
    },
  })

  async function handleToggleFollowUser(followed_user_id: number) {
    mutate({ followed_user_id })
  }

  return (
    <div className="relative">
      <div className="fixed right-[0] top-[0] h-[120px] w-[620px] translate-x-[60px] bg-indigo-400 blur-[270px]" />
      <div className="absolute left-[0] bottom-[60px] h-[120px] w-[620px] -translate-x-[100px] bg-indigo-600 blur-[270px]" />
      <div className="relative z-10">
        <div className="flex justify-center">
          <div className="bg-true w-full max-w-[560px]">
            {likedPosts &&
              likedPosts.map((post) => (
                <div
                  key={post.post_id}
                  className="flex flex-col gap-2 p-4 not-last-of-type:border-b not-last-of-type:border-b-slate-500"
                >
                  <div className="flex gap-2">
                    <div className="h-12 w-12 shrink-0 overflow-hidden border border-slate-500">
                      <img
                        src={post.profile_pic ?? defPic}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1 self-center leading-4">
                      <p className="font-semibold text-cyan-400">{post.name}</p>
                      <p className="text-sm text-slate-500">@{post.username}</p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div onClick={() => handleToggleFollowUser(post.author_id)}>
                        {followedUserIdArray && followedUserIdArray.includes(post.author_id) ? (
                          <button className=" border border-slate-500 px-6 py-1.5 text-sm leading-4">
                            Seguindo
                          </button>
                        ) : (
                          <button className=" border border-cyan-600 bg-cyan-600 px-6 py-1.5 text-sm leading-4">
                            Seguir
                          </button>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={() => navigate("/post/" + post.post_id)}
                          className=" border border-slate-500 bg-gray-700 px-6 py-1.5 text-sm leading-4"
                        >
                          Ver post
                        </button>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div
                        onClick={() => handleToggleLikePost(post.post_id)}
                        className="group cursor-pointer rounded-md p-2 transition-all duration-100 hover:bg-gray-700"
                      >
                        <div className="h-5 w-5 -translate-y-[3px]">
                          {likedPostsArray && likedPostsArray.includes(post.post_id) ? (
                            <BookmarkFill className="text-gray-500 transition-all duration-100 group-hover:text-white" />
                          ) : (
                            <Bookmark />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <p className="text-neutral-200">{post.text}</p>
                    </div>
                    <div className="mt-2 flex gap-5">
                      {post.likes_amount > 0 && <LikesAmountModal post={post} />}
                      {post.comments_amount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <div className="h-4 w-4 leading-4">
                            <ChatSquareDots className="" />
                          </div>
                          <p>
                            {post.comments_amount}{" "}
                            {post.comments_amount === 1 ? "commentário" : "comentários"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedPosts

function LikesAmountModal({ post }: { post: (typeof likedPosts)[number] }) {
  const { data: peopleWhoLikeThePost } = useQuery<IUserWhoLikeThePost[]>({
    queryKey: ["users-who-like-the-post", post.post_id],
    queryFn: () => api.get(`/users/${post.post_id}/users-who-like-the-post`).then((res) => res.data),
  })

  // function handleSeeWhoLikesThePost(postId: number) {}
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="flex cursor-pointer items-center gap-1 text-sm text-gray-400 hover:underline">
          <div className="h-4 w-4 -translate-y-[3px]">
            <Bookmark className="" />
          </div>
          <p>
            {post.likes_amount} {post.likes_amount === 1 ? "like" : "likes"}
          </p>
        </div>
      </Dialog.Trigger>
      {ReactDOM.createPortal(
        <Dialog.Content>
          <Dialog.Overlay className="absolute inset-0 h-screen w-screen bg-black/40" />
          <div className="absolute top-1/2 left-1/2 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-neutral-400 bg-neutral-800 shadow-xl shadow-black/40 ">
            <div className="relative p-6 ">
              <div>
                <div>
                  <h2 className="mb-6 text-xl font-semibold text-neutral-300">
                    Quem também salvou esse post:
                  </h2>
                </div>
                {peopleWhoLikeThePost &&
                  peopleWhoLikeThePost.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center gap-2 text-neutral-200 not-last-of-type:mb-2"
                    >
                      <div className="h-8 w-8 shrink-0 overflow-hidden border border-neutral-200">
                        <img
                          src={user.profile_pic ?? defPic}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p>{user.name}</p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-xs text-neutral-500">{moment(user.created_at).fromNow()}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <Dialog.Close asChild>
                <button className="cursor pointer group absolute right-0 top-0 rounded-bl-xl bg-red-600 p-2 px-4 leading-4">
                  <div className="h-5 w-5 overflow-hidden leading-4">
                    <XOctagon className="group-hover text-white" />
                  </div>
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>,
        document.querySelector("#portal")!
      )}
    </Dialog.Root>
  )
}
