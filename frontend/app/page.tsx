import { Button } from "@heroui/button";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, BookIcon } from "@/components/icons";
import { getApiUrl } from "@/config/api";
import { StatusSection } from "@/components/status-section";

export default async function Home() {
  let output = "Backend unavailable";
  let isSuccess = false;

  try {
    const response = await fetch(`${getApiUrl()}/latest-message`, {
      cache: "no-store",
    });

    if (response.ok) {
      output = await response.text();
      isSuccess = true;
    } else {
      output = "Error fetching message";
    }
  } catch {
    output = "Backend unavailable";
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>The&nbsp;</span>
        <span className={title({ color: "violet" })}>easiest&nbsp;</span>
        <br />
        <span className={title()}>way to distribute enterprise software</span>
        <div className={subtitle({ class: "mt-4" })}>Distr.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl w-full px-4">
        {/* Documentation Card */}
        <a
          href={siteConfig.links.docs}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/30 dark:to-secondary-950/30 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-600"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-primary-100 dark:bg-primary-900/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BookIcon size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100">
                Documentation
              </h3>
            </div>
            <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
              Learn how to get started, integrate, and make the most of Distr with comprehensive guides and examples.
            </p>
            <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
              Read the docs
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/0 via-primary-400/0 to-primary-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>

        {/* GitHub Card */}
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden bg-gradient-to-br from-default-50 to-default-100 dark:from-default-950/30 dark:to-default-900/30 border-2 border-default-300 dark:border-default-700 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-default-500 dark:hover:border-default-500"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-default-200 dark:bg-default-800/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <GithubIcon size={24} className="text-default-700 dark:text-default-300" />
              </div>
              <h3 className="text-xl font-bold text-default-900 dark:text-default-100">
                GitHub
              </h3>
            </div>
            <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
              Explore the source code, contribute to the project, report issues, and join our community of developers.
            </p>
            <div className="mt-4 flex items-center text-default-700 dark:text-default-300 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
              View on GitHub
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-default-400/0 via-default-400/0 to-default-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>

      <div className="mt-8 w-full max-w-md">
        <div className="bg-default-50 border-2 border-default-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">API Status</h3>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isSuccess
                  ? "bg-success-100 text-success-700"
                  : "bg-danger-100 text-danger-700"
              }`}
            >
              {isSuccess ? "● Connected" : "● Disconnected"}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-default-600 font-medium">
              Latest message:
            </p>
            <div className="bg-default-100 border border-default-300 rounded-xl px-4 py-3 shadow-sm">
              <code className="text-base font-mono text-primary font-semibold">
                {output}
              </code>
            </div>
          </div>
        </div>
      </div>

      <StatusSection />
    </section>
  );
}
