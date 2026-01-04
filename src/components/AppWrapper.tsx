import PasswordGate from '@/components/PasswordGate';

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  // Get password from environment variable
  // NEXT_PUBLIC_ prefix makes it available to client-side code
  const password = process.env.NEXT_PUBLIC_APP_PASSWORD || '';

  // If no password is set, skip the gate entirely (for local dev convenience)
  if (!password) {
    return <>{children}</>;
  }

  return (
    <PasswordGate password={password}>
      {children}
    </PasswordGate>
  );
}
