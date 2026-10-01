import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.md',
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.optional(image()),
        heroImageAlt: z.string().optional(),
        author: z.string().optional(),
      })
      .superRefine(({ heroImage, heroImageAlt }, context) => {
        if (heroImage && heroImageAlt === undefined) {
          context.addIssue({
            code: 'custom',
            message:
              'Defina heroImageAlt para descrever a imagem ou use uma string vazia se for decorativa.',
            path: ['heroImageAlt'],
          });
        }
      }),
});

export const collections = { blog };
