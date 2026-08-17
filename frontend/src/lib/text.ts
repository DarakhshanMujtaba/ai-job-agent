export function stripHtml(input: string): string {
  const withoutTags = input.replace(/<[^>]*>/g, " ");
  const textarea = document.createElement("textarea");
  textarea.innerHTML = withoutTags;
  return textarea.value.replace(/\s+/g, " ").trim();
}
