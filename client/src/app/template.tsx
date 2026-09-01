import { PageTransition } from "../components/layout/PageTransition";

/**
 * A `template.tsx` wraps every page and is re-created on each navigation,
 * which is exactly what we need to animate page-to-page transitions.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
