import Sidebar from "@/components/Sidebar/Sidebar";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <div className="relative flex w-full h-full overflow-hidden whitespace-nowrap">
      <Sidebar />
      {children}
    </div>
  );
}
