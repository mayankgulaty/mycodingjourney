export const siteConfig = {
  name: "mycodingjourney",
  title: "Mayank Gulaty | Data Engineer & Full-Stack Developer",
  description: "Senior Data Engineer with 8+ years of experience building scalable data pipelines and full-stack applications. Expertise in Apache Spark, Python, AWS, and modern web technologies.",
  url: "https://mycodingjourney.com",
  ogImage: "https://mycodingjourney.com/og-image.png",
  links: {
    twitter: "https://twitter.com/mayaborjar",
    github: "https://github.com/mayankgulaty",
    linkedin: "https://linkedin.com/in/mayankgulaty",
  },
  author: {
    name: "Mayank Gulaty",
    email: "mayankgulaty@gmail.com",
    bio: "Senior Data Engineer with 8+ years of experience at Citi and Nagarro, specializing in building petabyte-scale data pipelines and cloud-native architectures. I combine deep data engineering expertise with full-stack development skills to create end-to-end solutions.",
    avatar: "/avatar.jpg",
    location: "Open to Remote & Relocation",
    availability: "Open to opportunities",
    resume: "/resume.pdf",
  },
} as const

export type SiteConfig = typeof siteConfig
