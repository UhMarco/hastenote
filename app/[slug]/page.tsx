import { createClient } from "@/utils/supabaseBrowser";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

async function getNote(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes_v2")
    .select("*")
    .eq("slug", slug)
    .is("private", false)
    .single();
  return data;
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const note = await getNote(params.slug);
  return { title: note?.note_name || "Hastentoe", description: note?.content ? ((note.content.length > 40) ? note.content.slice(0, 40 - 1) + "&hellip;" : note.content) : "Create and share notes in markdown." };
}

export default async function NotePage({ params }: any) {
  const note = await getNote(params.slug);

  if (!note) notFound();
  else redirect(`/notes/${params.slug}`);
}