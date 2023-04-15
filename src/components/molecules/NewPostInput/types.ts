import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { HTMLAttributes } from "react";
import { z, ZodRawShape } from "zod";

export interface NewPostInputProps extends HTMLAttributes<HTMLFormElement> {
  mutate: any
  fieldsParser: z.ZodObject<any>
  placeholder: string
}