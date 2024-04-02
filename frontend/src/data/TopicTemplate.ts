export interface TopicTemplate {
  title: string,
  content: string,
  definitions: [
    {
      term: string,
      description: string,
      illustration: string
    },
  ],
  sectionIllustration: string
}
