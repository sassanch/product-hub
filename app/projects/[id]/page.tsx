import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { DataOutage } from "@/components/data-outage";
import { ProjectPage } from "@/components/project-page";
import { getRoadmapSnapshot } from "@/lib/google-sheets";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const snapshot = await getRoadmapSnapshot();
  const project = snapshot?.projects.find((item) => item.id === id);
  return { title: project?.name || "Project" };
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const snapshot = await getRoadmapSnapshot();
  if (!snapshot) return <DataOutage/>;
  const project = snapshot.projects.find((item) => item.id === id); if (!project) notFound();
  return <AppShell snapshot={snapshot}><ProjectPage project={project}/></AppShell>;
}
