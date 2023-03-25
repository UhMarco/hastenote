import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate min-h-full">
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-56 lg:px-8">
        <p className="text-base font-semibold leading-8 text-fg-muted text-text-medium">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg-default sm:text-5xl text-text-light">Nothing found</h1>
        <p className="mt-8 text-base text-fg-muted text-text-medium">These aren{"'"}t the notes you{"'"}re looking for.</p>
        <div className="flex justify-center text-text-light">
          <Link href="" className="text-sm font-semibold leading-7 text-fg-default">
            <span aria-hidden="true">&larr;</span> Move along
          </Link>
        </div>
      </div>
    </main>
  );
}