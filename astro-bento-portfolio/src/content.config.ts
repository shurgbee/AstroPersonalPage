import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/blog" }),

    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      project: z.string().optional(),
      technologies: z.array(z.string()).optional(),
    }),
});

const project = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/project" }),

    schema: z.object({
      name: z.string(),
      github: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      link: z.string().optional(),
      draft: z.boolean()
    }),
});

const timeline = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/timeline" }),

    schema: z.object({
      event: z.string(),
      imageUrl: z.string().optional(),
      date: z.coerce.date(),
      links: z.array(z.string()).optional()
    }),
});
export const collections = { blog, project, timeline };
