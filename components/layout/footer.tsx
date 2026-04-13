import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const techStack = [
  { label: "Next.js 16", href: "https://nextjs.org" },
  { label: "React 19", href: "https://react.dev" },
  { label: "TypeScript", href: "https://www.typescriptlang.org" },
  { label: "TailwindCSS v4", href: "https://tailwindcss.com" },
  { label: "ShadcnUI", href: "https://ui.shadcn.com" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          {/* 기술 스택 배지 */}
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <a
                key={tech.label}
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/70 transition-colors"
                >
                  {tech.label}
                </Badge>
              </a>
            ))}
          </div>
          <Separator className="max-w-xs" />
        </div>
      </div>
    </footer>
  );
}
