import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { BrandLogo } from "@/components/brand-logo";
import { safeCallbackPath } from "@/lib/auth-policy";

const errorMessages: Record<string, string> = {
  AccessDenied: "Use your verified plei.com Google Workspace account to continue.",
  OAuthCallbackError: "Google sign-in could not be completed. Please try again.",
  OAuthSignin: "Google sign-in could not be started. Please try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const [{ callbackUrl, error }, session] = await Promise.all([searchParams, auth()]);
  const destination = safeCallbackPath(callbackUrl);
  if (session?.user) redirect(destination);

  async function loginWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: destination });
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><BrandLogo className="login-logo"/></div>
        <div className="login-copy"><span>Product Hub</span><h1 id="login-title">Sign in to view the roadmap</h1><p>Continue with your Plei Google Workspace account.</p></div>
        {error ? <p className="login-error" role="alert">{errorMessages[error] || "Sign-in failed. Please try again."}</p> : null}
        <form action={loginWithGoogle}>
          <button className="google-login" type="submit">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.4 2.9-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9.1L6.5 14Z"/><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.5l3.4 2.7A5.9 5.9 0 0 1 12 6.1Z"/></svg>
            Continue with Google
          </button>
        </form>
        <p className="login-domain">Access is limited to verified @plei.com accounts.</p>
      </section>
    </main>
  );
}
