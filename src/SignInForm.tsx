        "use client";
        import { useAuthActions, useConvexAuth } from "convex/react";

        export function SignInForm() {
          const { isLoading, isAuthenticated } = useConvexAuth();
          const { signIn } = useAuthActions();

          return (
            <div className="w-full flex flex-col items-center gap-4">
              <h1 className="text-2xl font-bold">Entrar</h1>
              <p>Use sua conta do Google para continuar.</p>
              {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>}
              {!isLoading && !isAuthenticated && (
                <button
                  className="w-full flex items-center justify-center gap-2 p-2 border rounded-md hover:bg-gray-100"
                  onClick={() => signIn("google", {
                    redirectUrl: location.href
                  })}
                >
                  Entrar com Google
                </button>
              )}
            </div>
          );
        }
