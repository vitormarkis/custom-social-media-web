import { SubmitHandler, useForm } from "react-hook-form"
import { NewPostInputProps } from "./types"

function NewPostInput({ mutate, fieldsParser, className, placeholder, ...rest }: NewPostInputProps) {
  const { register, handleSubmit, reset } = useForm<any>()

  const submitHandler: SubmitHandler<any> = (formData) => {
    const parsedFormData = fieldsParser.parse(formData) as any
    mutate(parsedFormData, { onSuccess: () => reset() })
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className={"flex h-full w-full flex-row overflow-hidden rounded-xl " + className ?? ""}
      {...rest}
    >
      <textarea
        {...register("text")}
        placeholder={placeholder}
        className="custom-scroll block w-full  resize-none bg-gray-700 p-3"
      />
      <button
        type="submit"
        className="block  bg-indigo-600 px-8 py-2"
      >
        Enviar
      </button>
    </form>
  )
}

export default NewPostInput
