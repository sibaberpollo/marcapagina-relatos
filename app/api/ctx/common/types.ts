export interface Post {
  title: string;
  slug: string;
  description: string;
  content: string;
  publishedAt: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  readingTime: string;
  bgColor?: string;
}
