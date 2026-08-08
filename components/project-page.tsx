import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { ProjectDetails } from "@/components/project-details";
import type { Project } from "@/lib/types";

export function ProjectPage({ project }: { project: Project }) {
  return <main className="project-detail-page">
    <aside className="project-detail-sidebar">
      <header className="project-detail-header">
        <Link href="/" className="project-back"><ArrowLeft size={16}/>Back to projects</Link>
        <span className="drawer-kicker">Project</span>
        <h1>{project.name}</h1>
        {project.summary ? <p>{project.summary}</p> : null}
      </header>
      <ProjectDetails project={project}/>
    </aside>
    <article className="project-document" aria-label={`${project.name} description`}>
      <div className="project-document-inner">
        <header><span className="drawer-kicker">Project description</span></header>
        {project.descriptionMarkdown ? <MarkdownContent document>{project.descriptionMarkdown}</MarkdownContent> : <div className="project-document-empty"><strong>No project description yet</strong><p>Add Markdown to this project in the source sheet to publish its document here.</p></div>}
      </div>
    </article>
  </main>;
}
