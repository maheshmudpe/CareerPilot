import { Link } from "react-router";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30 lg:grid lg:grid-cols-2">
      {/* Brand panel */}
  <div className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col">
        <div>
          <Link
            to="/login"
            className="inline-block text-2xl font-semibold tracking-tight"
          >
            CareerPilot
          </Link>

          <p className="mt-2 max-w-md text-sm text-primary-foreground/70">
            Your career command center for managing applications,
            interviews, and your job search.
          </p>
        </div>

      <div className="mt-auto mb-auto max-w-md space-y-6">
          <div>
            <p className="text-3xl font-semibold tracking-tight">
              Stay organized.
              <br />
              Know what's next.
            </p>

            <p className="mt-3 text-sm leading-6 text-primary-foreground/70">
              Keep your applications, interviews, companies, and
              career documents in one place.
            </p>
          </div>

          <div className="space-y-3 text-sm text-primary-foreground/80">
            <p>✓ Track every application</p>
            <p>✓ Manage interview schedules</p>
            <p>✓ Keep your career profile organized</p>
          </div>
        </div>

      </div>

      {/* Form area */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;