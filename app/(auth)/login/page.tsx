import { SignInButton } from "@/components/AuthButtons";

export default async function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <SignInButton />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
