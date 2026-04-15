'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.client';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={urlFor(value).url()}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>
      );
    },
  },
};

export function PortableBody({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value)) return null;
  return <PortableText value={value as never} components={components} />;
}
