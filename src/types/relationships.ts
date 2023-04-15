import { z } from "zod"

export const relationshipSchema = z.object({
  relationship_id: z.number(),
  followed_user_id: z.number()
})

export type IRelationshipsId = z.infer<typeof relationshipSchema>