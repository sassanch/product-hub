import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function figmaEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    const supportedHost = url.hostname === "figma.com" || url.hostname.endsWith(".figma.com");
    const supportedPath = /^\/(?:file|design|proto|board)\//.test(url.pathname);
    if (!supportedHost || !supportedPath || !["http:", "https:"].includes(url.protocol)) return null;
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url.toString())}`;
  } catch {
    return null;
  }
}

function standaloneFigmaLink(children: ReactNode) {
  const nodes = Children.toArray(children);
  if (nodes.length !== 1 || !isValidElement<{ href?: string }>(nodes[0])) return null;
  const href = nodes[0].props.href;
  if (!href) return null;
  const embedUrl = figmaEmbedUrl(href);
  return embedUrl ? { href, embedUrl } : null;
}

export function MarkdownContent({ children, document = false }: { children: string; document?: boolean }) {
  return (
    <div className={`markdown-content${document ? " markdown-document" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children: paragraphChildren }) => {
            const figma = standaloneFigmaLink(paragraphChildren);
            if (!figma) return <p>{paragraphChildren}</p>;
            return (
              <figure className="figma-embed">
                <iframe
                  src={figma.embedUrl}
                  title="Embedded Figma mockup"
                  loading="lazy"
                  allowFullScreen
                />
                <figcaption><a href={figma.href} target="_blank" rel="noreferrer noopener">Open mockup in Figma</a></figcaption>
              </figure>
            );
          },
          a: ({ children: label, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener">
              {label}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
