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
      <h2 className="text-2xl md:text-3xl font-black normal-case tracking-tight leading-tight mt-12 mb-6 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-black normal-case tracking-tight mt-10 mb-5 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-black normal-case tracking-widest mt-8 mb-4 text-primary bg-muted inline-block px-2">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-base md:text-[17px] leading-relaxed text-zinc-700 mb-6 font-medium">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-6 mb-6 space-y-3 list-none text-base md:text-[17px]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-6 mb-6 space-y-3 list-decimal list-inside text-base md:text-[17px] font-bold text-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-4 text-zinc-700">
        <span className="mt-2 w-1.5 h-1.5 bg-primary flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => (
      <li className="text-zinc-700 font-medium pl-2">
        {children}
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
