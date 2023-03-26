"use client";

import Editor from "@/components/Editor";
import { useEditor } from "@/components/EditorProvider";
import { createClient } from "@/utils/supabaseBrowser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

async function getContent(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notes_v2")
    .select("*")
    .eq("slug", slug)
    .is("private", false)
    .single();
  return data?.content as string;
}

export default function SharedNote({ params }: any) {

  const router = useRouter();

  const { clear, updateContent } = useEditor();

  useEffect(() => {
    const getData = async () => {
      const found = await getContent(params.slug);
      if (!found) router.push("/notes");
      console.log("checing");
      clear();
      updateContent(found);
    };
    getData();
  }, [clear, updateContent, params.slug, router]);


  return (
    <Editor readOnly />
  );
}