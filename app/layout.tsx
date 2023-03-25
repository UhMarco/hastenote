import "server-only";

import SupabaseListener from "../components/supabaseListener";
import SupabaseProvider, { HastenoteUser } from "../components/supabaseProvider";
import { createClient } from "../utils/supabaseServer";

import { Metadata } from "next";
import "./globals.css";
import NoteProvider from "@/components/NoteProvider";
import ExplorerProvider from "@/components/ExplorerProvider";

// do not cache this layout
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Hastenote",
  description: "Create and share notes in markdown.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  let notesUser: HastenoteUser | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("username, pro").eq("id", user.id).single();
    notesUser = {
      id: user.id,
      username: data?.username!,
      pro: data?.pro!
    };
  }

  return (
    <html lang="en" className="bg-bg-default h-full">
      <body className="h-full">
        <SupabaseProvider session={session} user={notesUser}>
          <NoteProvider>
            <ExplorerProvider>
              <SupabaseListener serverAccessToken={session?.access_token} />
              {children}
            </ExplorerProvider>
          </NoteProvider>
        </SupabaseProvider>
      </body>
    </html >
  );
}