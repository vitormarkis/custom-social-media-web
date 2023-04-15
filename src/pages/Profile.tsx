import { useQuery } from "@tanstack/react-query"
import Spinner from "../components/Spinner"
import { IUser } from "../schemas/users"
import { api } from "../services/axios"
import { useLamaAuth } from "../_features/LamaAuth/context"
import { DefaultUserProfilePicture as defUser } from "../urls"

const Profile: React.FC = () => {
  const { currentUser } = useLamaAuth()

  const { data: user } = useQuery<IUser>({
    queryKey: ["user", currentUser?.id],
    queryFn: () => api.get("/users").then((response) => response.data),
    staleTime: 1000 * 60, // 1 tminuto
    enabled: !!currentUser,
  })

  const name = user ? (
    user.name
  ) : (
    <Spinner
      height={16}
      width={120}
    />
  )
  const email = user ? (
    user.email
  ) : (
    <Spinner
      height={14}
      width={170}
    />
  )
  const username = user ? (
    user.username
  ) : (
    <Spinner
      height={12}
      width={100}
    />
  )

  return (
    <div className="mx-auto h-full w-full max-w-[1280px] p-8">
      <div className="flex items-center gap-2">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-black">
          {user ? (
            <img
              src={user.profile_pic ?? defUser}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-gray-700"></div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="grow text-xl font-semibold">{name}</h1>
          <span className="block w-full text-sm text-gray-400">{email}</span>
          <span className="block text-xs text-gray-600">{username}</span>
        </div>
      </div>
    </div>
  )
}

export default Profile
