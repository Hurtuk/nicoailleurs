export function formatContent(content: string) {
  return content
    .split(/\n+/)
    .filter(Boolean)
    .map((paragraph, i) => (
      <p key={i}>
        {paragraph}
      </p>
    ));
}