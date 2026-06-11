import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.number().int(),
      role: z.string(),
      client: z.string().optional(),
      type: z.enum(['film', 'tech', 'writing']),
      summary: z.string(),
      preview: image().optional(), // deprecated — use `previews`
      // Hover collage media. Each entry is either a local file relative to the
      // project folder ("./still-01.jpg") OR an external URL ("https://…gumlet…").
      // Images and short muted mp4/webm loops can be mixed; all pop up on hover.
      previews: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      // Page lead image: a committed local file OR an external (Gumlet) URL.
      hero: z.union([image(), z.string().url()]).optional(),
      videoId: z.string().optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
            note: z.string().optional(),
          })
        )
        .default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
