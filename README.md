# My Coding Journey

A modern personal website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🚀 **Next.js 14** with App Router
- 📝 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- ✨ **Framer Motion** for animations
- 🌙 **Dark/Light mode** with next-themes
- 📱 **Responsive design** for all devices
- 📝 **MDX blog** with frontmatter support
- 🔍 **SEO optimized** with sitemap and RSS feed
- 📧 **Contact form** with API route
- 🎯 **Performance optimized**

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

```
mycodingjourney/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── blog/              # Blog pages
│   │   └── [slug]/        # Dynamic blog post pages
│   ├── contact/           # Contact page
│   ├── projects/          # Projects page
│   ├── api/               # API routes
│   │   └── contact/       # Contact form API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── robots.ts          # Robots.txt
│   ├── sitemap.ts         # Sitemap
│   └── rss.xml/           # RSS feed
├── components/            # Reusable components
│   ├── header.tsx         # Site header
│   ├── footer.tsx         # Site footer
│   ├── theme-toggle.tsx   # Dark/light mode toggle
│   ├── nav-link.tsx       # Navigation link component
│   ├── section.tsx        # Section wrapper with animations
│   ├── card.tsx           # Card component
│   ├── badge.tsx          # Badge component
│   └── mdx-components.tsx # MDX component overrides
├── content/               # Content files
│   └── blog/              # Blog posts (MDX)
├── lib/                   # Utility functions
│   ├── site.ts            # Site configuration
│   ├── posts.ts           # Blog post utilities
│   └── utils.ts           # General utilities
└── public/                # Static assets
```

## Customization

### Site Configuration
Edit `lib/site.ts` to customize:
- Site name and description
- Author information
- Social media links
- SEO settings

### Styling
The design system is built with Tailwind CSS and custom CSS variables. Key files:
- `app/globals.css` - Global styles and CSS variables
- `tailwind.config.ts` - Tailwind configuration
- `components/` - Component-specific styles

### Content
- **Blog posts**: Add MDX files to `content/blog/`
- **Projects**: Update the projects array in `app/projects/page.tsx`
- **About content**: Modify `app/about/page.tsx`

## Deployment

The site runs on Cloudflare Workers via `@opennextjs/cloudflare`. See [MIGRATION.md](MIGRATION.md) for secrets, the optional R2 cache binding, and the build commands.

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Content**: MDX
- **Deployment**: Cloudflare Workers (`@opennextjs/cloudflare`)

## License

MIT License - feel free to use this template for your own personal website!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

- Website: [mycodingjourney.com](https://mycodingjourney.com)
- Email: hello@mycodingjourney.com
- GitHub: [@mycodingjourney](https://github.com/mycodingjourney)

