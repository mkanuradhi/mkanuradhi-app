import Role from "../enums/role";

export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Role[]
    }
  }
}