import { useForm } from "react-hook-form"
import { SubmitHandler } from "react-hook-form/dist/types"
import { useNavigate } from "react-router-dom"
import { loginCredentialsSchema, TLoginCredentials } from "../schemas/users"
import { useLamaAuth } from "../_features/LamaAuth/context"

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<TLoginCredentials>()
  const navigate = useNavigate()
  // const auth = useContext(AuthContext)

  const { login } = useLamaAuth()

  const submitHandler: SubmitHandler<TLoginCredentials> = async (userdata) => {
    try {
      const parsedUserdata = loginCredentialsSchema.parse(userdata)
      await login(parsedUserdata)
      navigate("/profile")
    } catch (error) {
      console.log(error)
      return alert("Usuário ou senha incorretos")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="mx-auto my-14 flex w-[420px] flex-col gap-4 rounded-2xl bg-gray-800 p-6"
    >
      <div>
        <h1 className="text-xl font-semibold">👇 Entrar</h1>
        <h3 className="text-sm text-gray-500">Faça login para continuar.</h3>
      </div>
      <input
        autoComplete="off"
        type="text"
        {...register("username")}
        placeholder="Digite seu username..."
        className="rounded-lg border-2 border-black bg-gray-700 p-3"
      />
      <input
        autoComplete="off"
        type="password"
        {...register("password")}
        placeholder="Digite sua senha..."
        className="rounded-lg border-2 border-black bg-gray-700 p-3"
      />

      <button
        type="submit"
        className="rounded-lg border-2 border-black bg-green-600 p-3"
      >
        Enviar
      </button>
    </form>
  )
}

export default Login
