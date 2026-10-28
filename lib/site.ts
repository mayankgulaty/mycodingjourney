export const siteConfig = {
  name: "mycodingjourney",
  title: "Mayank Gulaty | Data Engineer & Full-Stack Developer",
  description: "Data engineer and full-stack developer. Data pipelines, Apache Spark, Python, AWS and modern web. Blog, projects and a hackable desktop-OS playground.",
  url: "https://www.mycodingjourney.com",
  ogImage: "https://www.mycodingjourney.com/og-image.png",
  links: {
    twitter: "https://x.com/mgulaty",
    github: "https://github.com/mayankgulaty",
    linkedin: "https://linkedin.com/in/mayankgulaty",
  },
  author: {
    name: "Mayank Gulaty",
    email: "mayankgulaty@gmail.com",
    bio: "Senior Data Engineer with experience at Citi and Nagarro, building data pipelines and cloud-native architectures. I combine data engineering with full-stack development to build end-to-end solutions.",
    avatar: "/avatar.jpg",
    location: "Open to Remote & Relocation",
    availability: "Open to opportunities",
    resume: "/resume.pdf",
  },
} as const

export type SiteConfig = typeof siteConfig
