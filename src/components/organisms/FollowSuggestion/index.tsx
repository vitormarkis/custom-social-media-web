import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../../../services/axios"
import { IRelationshipsId } from "../../../types/relationships"
import { useLamaAuth } from "../../../_features/LamaAuth/context"

import { Cursor } from "@styled-icons/bootstrap/Cursor"
import { CursorFill } from "@styled-icons/bootstrap/CursorFill"
import { IRelationShipToggle } from "../../../schemas/relationships"
import { followUserSuggestionSchema } from "../../../schemas/users"
import queryClient from "../../../services/queryClient"
import { DefaultUserProfilePicture as defPic } from "../../../urls"

const FollowSuggestion: React.FC = () => {
  const { currentUser } = useLamaAuth()

  const { data: relationships } = useQuery<IRelationshipsId[]>({
    queryKey: ["relationships", currentUser?.id],
    queryFn: () => api.get("/users/relationships").then((res) => res.data),
    staleTime: 1000 * 60, // 1 minuto
  })

  const { data: allUsers } = useQuery<unknown[]>({
    queryKey: ["all_users"],
    queryFn: async () => api.get("/users/all").then((res) => res.data),
    staleTime: 1000 * 60, // 1 minuto
  })

  const followUsers = allUsers?.map((user) => followUserSuggestionSchema.parse(user))

  const { mutate } = useMutation({
    mutationFn: (followed_user_id: IRelationShipToggle) => {
      return api.put("/users/relationships", followed_user_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", currentUser?.id]),
        queryClient.invalidateQueries(["relationships", currentUser?.id])
    },
  })

  const handleToggleFollowerUser = (followed_user_id: number) => {
    mutate({ followed_user_id })
  }

  const followingUsers = relationships?.reduce((acc: number[], item) => {
    acc.push(item.followed_user_id)
    return acc
  }, [])

  return (
    <div className="hidden grow-[2] border-l border-l-gray-800 md:block">
      <div>
        <div className="border-b border-b-gray-800">
          <div className="mt-4 px-4">
            <h1 className="mb-2 text-2xl font-black">Sugestões:</h1>
          </div>
          <div className="flex flex-col">
            {followUsers
              ? followUsers.map((user) => {
                  if (user.user_id === currentUser?.id) return

                  return (
                    <div
                      key={user.user_id}
                      onClick={() => handleToggleFollowerUser(user.user_id)}
                      className="flex cursor-pointer items-center gap-1 py-2 px-4 hover:bg-gray-800"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gray-900 bg-gray-700">
                        <img
                          src={user.profile_pic ?? defPic}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-1 flex flex-col">
                        <h1>{user.name}</h1>
                        <p className="text-sm text-gray-500">{user.username}</p>
                      </div>
                      <div className="ml-auto flex w-[80px] flex-col items-center gap-1 px-2">
                        <button>
                          {followingUsers?.includes(user.user_id) ? (
                            <CursorFill width={24} />
                          ) : (
                            <Cursor width={24} />
                          )}
                        </button>
                        <span className="text-[10px] text-gray-400 hover:underline">
                          {followingUsers?.includes(user.user_id) ? "Seguindo" : "Seguir"}
                        </span>
                      </div>
                    </div>
                  )
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowSuggestion
