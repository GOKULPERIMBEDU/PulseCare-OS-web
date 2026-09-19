'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminRedirectLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace(pathname.replace(/^\/admin/, '/hospital-admin') || '/hospital-admin');
  }, [pathname, router]);

  return <>{children}</>;
}
