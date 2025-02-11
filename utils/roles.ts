import Role from "@/enums/role";
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (roles: Role[]) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.roles === roles
}