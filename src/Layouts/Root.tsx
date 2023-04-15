import * as Popover from "@radix-ui/react-popover"
import { ThreeDots } from "@styled-icons/bootstrap/ThreeDots"
import { LogOut } from "@styled-icons/evaicons-solid/LogOut"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useLamaAuth } from "../_features/LamaAuth/context"
import { DefaultUserProfilePicture as defPic } from "../urls"

function RootLayout() {
  const navigate = useNavigate()
  const { currentUser, logout } = useLamaAuth()

  const handleLogoutButton = () => {
    logout()
    navigate("/login")
  }

  const style =
    (styleClasses: string) =>
    ({ isActive }: { isActive: boolean; isPending: boolean }) =>
      `${isActive ? "bg-[#00000040] text-cyan-400 font-semibold" : ""} ${styleClasses}`

  return (
    <div className="custom-scroll flex h-screen max-h-screen w-screen flex-col overflow-y-auto overflow-x-hidden bg-gray-900 text-white">
      <header className="relative z-10 flex h-16 w-full justify-center border-b border-b-slate-600 backdrop-blur-[220px]">
        <main className=" flex w-full max-w-[1280px] justify-between p-3">
          <nav className="flex gap-2">
            <NavLink
              to="/"
              className={style("flex items-center px-4")}
            >
              Home
            </NavLink>
            {currentUser ? (
              <NavLink
                to="/posts"
                className={style("flex items-center px-4")}
              >
                Posts
              </NavLink>
            ) : null}
            {currentUser ? (
              <NavLink
                to="/saved-posts"
                className={style("flex items-center px-4")}
              >
                Posts Salvos
              </NavLink>
            ) : null}
          </nav>
          <nav className="self-center">
            {currentUser && (
              <div className="flex items-center">
                <div className="flex flex-col items-end gap-0.5">
                  <h2 className="text-sm font-semibold leading-[0.875rem] text-gray-200">
                    {currentUser.name}
                  </h2>
                  <span className="block text-xs leading-3 text-gray-400">{currentUser.username}</span>
                </div>
                <NavLink
                  to="/profile"
                  className="ml-3 h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-white"
                >
                  <img
                    src={currentUser.profile_pic ?? defPic}
                    className="block h-full w-full object-cover"
                  />
                </NavLink>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="ml-2 flex h-7 w-10 items-center justify-center rounded-full active:bg-gray-700">
                      <ThreeDots width={22} />
                    </button>
                  </Popover.Trigger>
                  <Popover.Content
                    asChild
                    align="end"
                  >
                    <div className="rounded-lg bg-slate-700 py-1 px-1">
                      <button
                        className="flex items-center gap-2 rounded-md py-0.5 pl-2 pr-4 hover:bg-slate-600"
                        onClick={handleLogoutButton}
                      >
                        <div className="flex items-center justify-center">
                          <LogOut width={20} />
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  </Popover.Content>
                </Popover.Root>
              </div>
            )}
            {!currentUser && (
              <NavLink
                to="/login"
                className="block rounded-full px-8 bg-emerald-600 py-2 text-sm border-b border-black/40 shadow-md"
              >
                Login
              </NavLink>
            )}
          </nav>
        </main>
      </header>
      <div className="chat mx-auto w-full max-w-[1280px]">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
