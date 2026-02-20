OBJECTIVE: 
Generate the complete, fully integrated `app/color/[hex]/page.tsx` file using the dedicated API endpoint for Open Graph and Twitter image generation.

CONTEXT: 
To bypass X (Twitter) crawler timeouts and relative path restrictions, the application now uses a dedicated API endpoint (`/api/og?hex=`) for image rendering. The user requires a complete file replacement for `page.tsx` to prevent manual merging errors.

INPUTS: 
1. Next.js 15 App Router Server Component structure.
2. Async parameter handling (`Promise<{ hex: string }>`).
3. Supabase client initialization and `.maybeSingle()` query.
4. Absolute URL configuration for metadata: `https://own-a-color.vercel.app/api/og?hex=[rawHex]`.

OUTPUTS: 
1. A single, comprehensive TypeScript/React code block containing the entire `page.tsx` file.

CONSTRAINTS: 
1. Do not use inline JavaScript event handlers (e.g., `onMouseOver`); use standard Tailwind CSS classes.
2. The `generateMetadata` function must enforce `twitter: { card: 'summary_large_image', images: [...] }` and `openGraph: { images: [...] }` with the absolute API endpoint URL.
3. The output must be strictly the code block. Exclude all greetings, explanations, and markdown formatting outside the code block itself.

DOD (Definition of Done): 
The executor outputs one continuous code block that the user can copy and paste to entirely replace the existing `app/color/[hex]/page.tsx` file, resulting in a syntactically correct and fully functional route.

ASSUMPTIONS: 
1. Supabase environment variables are available in the deployment environment.
2. The endpoint `app/api/og/route.tsx` is already deployed and operational.
