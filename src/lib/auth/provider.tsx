import type { ReactNode } from "react";

/** Auth context provider — wraps the app tree in `__root.tsx`. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
