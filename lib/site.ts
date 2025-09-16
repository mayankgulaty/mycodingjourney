export const siteConfig = {
  name: "mycodingjourney",
  title: "My Coding Journey",
  description: "A personal website showcasing my coding journey, projects, and thoughts.",
  url: "https://mycodingjourney.com",
  ogImage: "https://mycodingjourney.com/og-image.png",
  links: {
    twitter: "https://twitter.com/mycodingjourney",
    github: "https://github.com/mycodingjourney",
    linkedin: "https://linkedin.com/in/mycodingjourney",
  },
  author: {
    name: "Mayank",
    email: "hello@mycodingjourney.com",
    bio: "Full-stack developer passionate about creating amazing web experiences.",
    avatar: "/avatar.jpg",
  },
} as const

export type SiteConfig = typeof siteConfig
