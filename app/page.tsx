import Logo from "../public/logo.svg";
import Image from "next/image";
import dynamic from "next/dynamic";

const HeroButtons = dynamic(() => import("../components/HeroButtons"));

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
      </svg>
      <div className="mx-auto max-w-7xl px-6 sm:pb-16 pb-0 lg:flex pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <Logo className="h-11" />
          <h1 className="mt-24 sm:mt-32 lg:mt-16 text-4xl font-bold tracking-tight text-text-light sm:text-5xl">
            Never lose another thought
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-dark">
            Don{"'"}t let your ideas slip away. With Hastenote, you can easily jot down and organize your ideas, ensuring they{"'"}re always just a click away. Try it today and take control of your productivity.
          </p>
          <HeroButtons />
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              priority
              src="/static/Preview.png"
              alt="App screenshot"
              width={2938}
              height={1840}
              className="w-[70rem] rounded-lg bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
        <div className="absolute hidden sm:block top-5 right-3">
          <a target="_blank" href="https://github.com/UhMarco/hastenote" rel="noopener noreferrer" className="inline-flex space-x-6">
            <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-text-dark">
              <span>View on GitHub</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
