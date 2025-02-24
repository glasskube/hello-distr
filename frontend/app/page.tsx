import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { getLatestMessage } from "@/api/latest-message";

export default async function Home() {
  const latestMessage = await getLatestMessage();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>The&nbsp;</span>
        <span className={title({ color: "violet" })}>easiest&nbsp;</span>
        <br />
        <span className={title()}>way to distribute enterprise software</span>
        <div className={subtitle({ class: "mt-4" })}>Distr.</div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Latest Message from API:{" "}
            <Code color="primary">{latestMessage}</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
