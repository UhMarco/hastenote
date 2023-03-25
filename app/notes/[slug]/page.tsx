"use client";

import Editor from "@/components/Editor";
import { useEditor } from "@/components/EditorProvider";
import { createClient } from "@/utils/supabaseBrowser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [content, setContent] = useState<string>();

  const router = useRouter();

  const { clear } = useEditor();

  useEffect(() => {
    const getData = async () => {
      const found = await getContent(params.slug);
      if (!found) router.push("/notes");
      setContent(found);
      clear();
    };
    getData();
  }, [clear, params.slug, router]);


  return (
    <Editor readOnly content={content} />
  );
}