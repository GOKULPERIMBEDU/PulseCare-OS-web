import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Variant = 'default' | 'onDark';

const styles: Record<Variant, { back: string; brand: string }> = {
  default: {
    back: 'text-muted hover:text-foreground',
    brand: 'text-teal',
  },
  onDark: {
    back: 'text-white/75 hover:text-white',
    brand: 'text-teal-soft',
  },
};

export function AuthHomeLink({ variant = 'default' }: { variant?: Variant }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${styles[variant].back}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Home
    </Link>
  );
}

export function AuthLogo({
  variant = 'default',
  prominent = false,
}: {
  variant?: Variant;
  prominent?: boolean;
}) {
  return (
    <Link href="/" className="inline-block">
      <p
        className={
          prominent
            ? 'bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-3xl font-extrabold uppercase tracking-wider text-transparent'
            : `text-xs font-semibold uppercase tracking-[0.24em] ${styles[variant].brand}`
        }
      >
        PulseCare OS
      </p>
    </Link>
  );
}
