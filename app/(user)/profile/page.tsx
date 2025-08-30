import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/AuthButtons";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {session.user?.name || session.user?.email}
            </p>
          </div>
          <SignOutButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Profile</h3>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Projects</h3>
            <p className="text-muted-foreground">View and manage your projects</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Analytics</h3>
            <p className="text-muted-foreground">Track your activity and progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
