import type {ZodFormattedError} from 'zod';
import {z} from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const serverSchema = z.object({
  VITE_RENDERER_URL: z.preprocess(
    str => str ?? '',
    import.meta.env.DEV ? z.string().url() : z.string().optional(),
  ),
  VITE_RENDERER_DIR: z.string(),
  VITE_SERVER_PORT: z.string(),
  VITE_COOKIE_SECRET: z.string(),
  VITE_LOG_LEVEL: z.string().optional(),
});

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`;
    })
    .filter(Boolean);

const _serverEnv = serverSchema.safeParse(import.meta.env);

if (!_serverEnv.success) {
  console.error('❌ Invalid environment variables:\n', ...formatErrors(_serverEnv.error.format()));
  throw new Error('Invalid environment variables');
}
