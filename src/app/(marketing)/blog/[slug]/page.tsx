import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Blog Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.body.split("\n\n");

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_40%_at_50%_20%,black,transparent)]" />
      <div className="relative mx-auto max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.tag}</span>
          <span className="text-xs text-muted-foreground">{post.date}</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border shadow-sm">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
        <article className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) =>
            p.startsWith("1.") ? (
              <ul key={i} className="space-y-2 pl-1">
                {p.split("\n").filter(Boolean).map((li, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{p}</p>
            )
          )}
        </article>
      </div>
    </section>
  );
}