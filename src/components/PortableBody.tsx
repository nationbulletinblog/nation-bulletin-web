'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.client';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="relative my-12 aspect-[16/10] w-full overflow-hidden border border-border bg-muted">
          <Image
            src={urlFor(value).url()}
            alt=""
            fill
            className="object-cover hover:scale-105 transition-transform duration-1000"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight mt-16 mb-8 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight mt-12 mb-6 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-black uppercase tracking-widest mt-10 mb-4 text-primary bg-muted inline-block px-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-lg leading-relaxed text-zinc-600 mb-8 font-medium">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-8 mb-8 space-y-4 list-none text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-8 mb-8 space-y-4 list-decimal list-inside text-lg font-bold text-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-4 text-zinc-600">
        <span className="mt-1.5 w-2 h-2 bg-primary flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-black text-foreground">{children}</strong>,
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-primary font-bold underline decoration-2 underline-offset-4 hover:bg-primary hover:text-white transition-all px-1"
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableBody({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value)) return null;
  return <PortableText value={value as never} components={components} />;
}
