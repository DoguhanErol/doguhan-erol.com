import { ContactForm } from "@/components/site/contact-form";
import { LoopVideo } from "@/components/site/loop-video";
import { Reveal } from "@/components/site/reveal";
import { SiteHeader } from "@/components/site/header";
import { ScrollTop } from "@/components/site/scroll-top";
import { ShotReel } from "@/components/site/shot-reel";
import { WorkStage } from "@/components/site/work-stage";
import { BookOpen, Box, Globe, Languages, QrCode, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { PublicContent } from "@/lib/content";
import { contactInstagram, contactSubstack } from "@/lib/defaults";
import type { SiteLocale } from "@/lib/locale";
import { mailLink, safeHttpUrl, telegramLink, whatsappLink } from "@/lib/utils";

type Copy = {
  nav: {
    work: string;
    skills: string;
    about: string;
    contact: string;
    talk: string;
  };
  hero: { seeWork: string; talk: string };
  work: { kicker: string; title: string; lead: string };
  skills: { kicker: string; title: string };
  about: { kicker: string; title: string };
  contact: {
    kicker: string;
    title: string;
    lead: string;
    email: string;
    whatsapp: string;
    telegram: string;
    github: string;
    name: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
    rate: string;
  };
  footer: { top: string };
  theme: { toDark: string; toLight: string };
  locale: { switchToEn: string; switchToTr: string };
};

function Kicker({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{children}</p>
  );
}

function ProjectLogo({ tone }: { tone: string }) {
  if (tone === "qrivo") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/media/QrivoLogoSquare.png"
        alt=""
        className="size-12 shrink-0 rounded-xl bg-black object-cover"
      />
    );
  }
  if (tone === "scp") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/media/scplogo.png"
        alt=""
        className="h-12 w-16 shrink-0 rounded-xl bg-black object-cover object-[center_42%]"
      />
    );
  }
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-card text-accent">
      <Globe className="size-5" aria-hidden />
    </span>
  );
}

const skillIcons: LucideIcon[] = [Globe, QrCode, BookOpen, Box, Languages];

function SkillMark({ index }: { index: number }) {
  const Icon = skillIcons[index] ?? Globe;
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-line bg-card text-accent">
      <Icon className="size-5" aria-hidden />
    </span>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M12 3.2A8.7 8.7 0 0 0 3.4 11.7c0 1.53.4 2.96 1.1 4.2L3.2 20.8l5.08-1.24A8.8 8.8 0 0 0 12 20.2a8.7 8.7 0 0 0 0-17Zm4.86 11.1c-.2.56-1.16 1.04-1.62 1.1-.42.06-.94.08-1.52-.1-.35-.1-.8-.26-1.38-.5-2.42-1.04-4-3.48-4.12-3.64-.12-.16-1-1.32-1-2.52s.62-1.78.84-2.02c.22-.24.48-.3.64-.3h.46c.14 0 .34-.06.54.4.2.48.68 1.66.74 1.78.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.26.32-.36.42-.12.12-.24.26-.1.5.14.24.62 1.02 1.32 1.66.92.82 1.68 1.08 1.92 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.6-.14 1.16Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8ZM12 7.6A4.4 4.4 0 1 1 7.6 12 4.4 4.4 0 0 1 12 7.6Zm0 1.7A2.7 2.7 0 1 0 14.7 12 2.7 2.7 0 0 0 12 9.3Zm4.55-2.55a1.05 1.05 0 1 1-1.05 1.05 1.05 1.05 0 0 1 1.05-1.05Z" />
    </svg>
  );
}

function SubstackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M22.54 8.24H1.46V5.4h21.08v2.84ZM1.46 10.81V24L12 18.11 22.54 24V10.81H1.46ZM22.54 0H1.46v2.84h21.08V0Z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
      <path d="M20.7 4.3 3.9 10.6c-1.14.44-1.12 1.08-.2 1.36l4.28 1.34 9.9-6.24c.46-.28.9-.13.54.18l-8.02 7.24-.3 4.52c.44 0 .64-.2.88-.44l2.12-2.06 4.4 3.24c.8.44 1.38.22 1.58-.76l2.86-13.48c.3-1.18-.42-1.72-1.24-1.4Z" />
    </svg>
  );
}

function ReachButton({
  href,
  label,
  className,
  icon,
}: {
  href: string | null;
  label: string;
  className: string;
  icon: ReactNode;
}) {
  const classes = `inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-white ${className}`;
  if (!href) {
    return (
      <span className={classes} aria-disabled="true">
        {icon}
        {label}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {icon}
      {label}
    </a>
  );
}

export function HomePage({
  content,
  locale,
  copy,
}: {
  content: PublicContent;
  locale: SiteLocale;
  copy: Copy;
}) {
  const paragraphs = content.about.split(/\n\s*\n/).filter(Boolean);
  const email = mailLink(content.email);
  const whatsapp = whatsappLink(content.whatsapp);
  const telegram = telegramLink(content.telegram);
  const github = safeHttpUrl(content.github);
  const channels = [
    email ? { href: email, label: content.email, name: copy.contact.email } : null,
    github
      ? {
          href: github,
          label: github.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "") || copy.contact.github,
          name: copy.contact.github,
        }
      : null,
  ].filter(Boolean) as { href: string; label: string; name: string }[];

  return (
    <div id="top">
      <SiteHeader
        name={content.name}
        locale={locale}
        labels={{
          ...copy.nav,
          toDark: copy.theme.toDark,
          toLight: copy.theme.toLight,
          localeLabel: locale === "tr" ? copy.locale.switchToEn : copy.locale.switchToTr,
        }}
      />

      <main>
        <section className="mx-auto grid max-w-[1120px] grid-cols-[minmax(0,1fr)] items-start gap-8 px-5 pt-6 pb-12 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-8 lg:pb-14">
          <div>
            <h1 className="rise text-[clamp(2rem,10.2vw,2.75rem)] leading-[0.94] font-semibold tracking-[-0.045em] sm:text-[clamp(2.4rem,5.2vw,4.25rem)]">
              <span className="block">{content.headlineBefore}</span>
              <span className="mt-1 block text-accent">{content.headlineAccent}</span>
            </h1>
            <p className="rise rise-d1 mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {content.lead}
            </p>
            <div className="rise rise-d2 mt-6 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex h-12 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper"
              >
                {copy.hero.seeWork}
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-line px-5 text-sm font-medium"
              >
                {copy.hero.talk}
              </a>
            </div>
          </div>
          <div className="rise rise-d2">
            <WorkStage projects={content.projects} locale={locale} />
          </div>
        </section>

        {content.stack.length > 0 ? (
          <div className="overflow-hidden border-y border-line">
            <div className="marquee-track flex w-max gap-8 py-4">
              {[...content.stack, ...content.stack].map((item, index) => (
                <span key={`${item}-${index}`} className="text-sm text-muted">
                  {item}
                  <span className="px-8 text-ink/25">·</span>
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <section id="work" className="scroll-mt-20 mx-auto max-w-[1120px] px-5 py-20">
          <Reveal>
            <Kicker>{copy.work.kicker}</Kicker>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {copy.work.title}
            </h2>
            <p className="mt-4 max-w-2xl text-muted">{copy.work.lead}</p>
          </Reveal>
          <div className="mt-14 space-y-16">
            {content.projects.map((project, index) => {
              const flip = index % 2 === 1;
              const links = [
                { href: safeHttpUrl(project.url), label: project.urlLabel },
                { href: safeHttpUrl(project.url2), label: project.urlLabel2 },
              ].filter((item): item is { href: string; label: string } => Boolean(item.href && item.label));
              const reel =
                project.tone === "qrivo"
                  ? {
                      src: "/media/qrivo-desktop.mp4",
                      label: locale === "tr" ? "Qrivo panel kaydı" : "Qrivo on desktop",
                    }
                  : project.tone === "scp"
                    ? {
                        src: "/media/Trailer.mp4",
                        label: locale === "tr" ? "SCP-294 fragmanı" : "SCP-294 trailer",
                      }
                    : null;
              return (
                <Reveal key={project.id}>
                <article
                  className={`grid gap-6 border-t border-line pt-10 lg:items-start ${
                    flip
                      ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
                      : "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
                  }`}
                >
                  <div className={flip ? "lg:order-2" : undefined}>
                    <div className="flex items-center gap-3">
                      <ProjectLogo tone={project.tone} />
                      <div className="min-w-0">
                        <p className="text-sm text-accent">{project.kicker}</p>
                        <h3 className="mt-1 text-3xl font-semibold tracking-tight">{project.title}</h3>
                      </div>
                    </div>
                    {reel ? (
                      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-black">
                        <LoopVideo className="block w-full" src={reel.src} label={reel.label} />
                      </div>
                    ) : null}
                    {project.slug === "business-websites" ? <ShotReel locale={locale} /> : null}
                  </div>
                  <div className={flip ? "lg:order-1" : undefined}>
                    <p className="max-w-2xl leading-relaxed text-muted">{project.summary}</p>
                    <ul className="mt-5 space-y-2 text-sm">
                      {project.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-sm text-muted">{project.tags.join(" · ")}</p>
                    {links.length > 0 ? (
                      <div className="mt-5">
                        {project.slug === "business-websites" ? (
                          <p className="mb-2 text-xs font-medium tracking-[0.16em] text-muted uppercase">
                            {locale === "tr" ? "Örnekler" : "Examples"}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                        {links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-11 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper"
                          >
                            {link.label} ↗
                          </a>
                        ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="skills" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-[1120px] px-5 py-20">
            <Reveal>
              <Kicker>{copy.skills.kicker}</Kicker>
              <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {copy.skills.title}
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {content.skills.map((skill, index) => (
                <Reveal key={skill.id} delay={(index % 3) * 70}>
                <article>
                  <div className="flex items-center gap-3">
                    <SkillMark index={index} />
                    <h3 className="min-w-0 text-xl font-semibold tracking-tight">{skill.title}</h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-muted">{skill.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about-band scroll-mt-20 border-t border-line">
          <div className="about-plate absolute inset-0" aria-hidden />
          <div className="about-scrim absolute inset-0" aria-hidden />
          <div className="relative mx-auto grid max-w-[1120px] gap-10 px-5 py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Reveal>
            <div>
              <Kicker>{copy.about.kicker}</Kicker>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {copy.about.title}
              </h2>
              <p className="mt-4 text-sm text-muted">
                {content.role}
                {content.location ? ` · ${content.location}` : ""}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.portrait || "/media/portre.webp"}
                alt={content.name}
                className="mt-8 w-full max-w-[280px] rounded-2xl"
              />
            </div>
            </Reveal>
            <Reveal delay={80}>
            <div>
              <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted">{content.availability}</p>
            </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-[1120px] gap-12 px-5 py-20 lg:grid-cols-2">
            <Reveal>
            <div>
              <Kicker>{copy.contact.kicker}</Kicker>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {copy.contact.title}
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted">{copy.contact.lead}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <ReachButton href={whatsapp} label={copy.contact.whatsapp} className="bg-[#1f8f4e]" icon={<ChatIcon />} />
                <ReachButton href={telegram} label={copy.contact.telegram} className="bg-[#229ed9]" icon={<SendIcon />} />
                <ReachButton
                  href={contactInstagram}
                  label="Instagram"
                  className="bg-[linear-gradient(135deg,#f9ce34,#ee2a7b_55%,#6228d7)]"
                  icon={<InstagramIcon />}
                />
                <ReachButton href={contactSubstack} label="Substack" className="bg-[#ff6719]" icon={<SubstackIcon />} />
              </div>
              <ul className="mt-8 space-y-3">
                {channels.map((channel) => (
                  <li key={channel.href}>
                    <a
                      href={channel.href}
                      className="group inline-flex flex-col"
                      {...(channel.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      <span className="text-xs text-muted">{channel.name}</span>
                      <span className="text-lg font-medium group-hover:text-accent">{channel.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            </Reveal>
            <Reveal delay={80}>
            <ContactForm
              copy={{
                name: copy.contact.name,
                namePlaceholder: copy.contact.namePlaceholder,
                email: copy.contact.emailLabel,
                emailPlaceholder: copy.contact.emailPlaceholder,
                message: copy.contact.message,
                messagePlaceholder: copy.contact.messagePlaceholder,
                send: copy.contact.send,
                sending: copy.contact.sending,
                sent: copy.contact.sent,
                error: copy.contact.error,
                rate: copy.contact.rate,
              }}
            />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-5 py-6 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {content.name}
          </p>
          <a href="#top" className="hover:text-ink">
            {copy.footer.top} ↑
          </a>
        </div>
      </footer>
      <ScrollTop label={copy.footer.top} />
    </div>
  );
}
