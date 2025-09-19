import { MDXComponents } from 'mdx/types'
import { components } from '@/components/content/MDXComponents'

export const defaultLayout = 'PostLayout'

export const mdxComponents: MDXComponents = {
  ...components,
}

export const mdxOptions = {
  remarkPlugins: [],
  rehypePlugins: [],
}
