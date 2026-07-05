'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import ClientShowcase from '@/components/three/ClientShowcase'
import ScrollReveal from '@/components/ui/ScrollReveal'

const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 },
  }),
}

const milestones = [
  { year: '1996', text: 'БНСУ-д CJ Foodville-ийн хүрээнд анхны дэлгүүр нээгдсэн' },
  { year: '1997', text: 'Гурилан бүтээгдэхүүний үйлдвэрлэл эхэлсэн' },
  { year: '2016', text: 'Монгол Улсад албан ёсоор нээгдсэн' },
]

const features = [
  {
    title: 'Хурд',
    description:
      'Захиалгаас авах хүртэлх хугацааг богиносгож, шинэхэн бүтээгдэхүүнийг хурдан хүргэнэ.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: 'Лояалти',
    description: 'Үнэнч хэрэглэгчдэдээ зориулсан урамшуулал, цугларалтын системтэй.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
  },
  {
    title: 'Тоглоом',
    description: 'Дижитал туршлаг, 3D тоглоом болон интерактив контентоор зочдоо хөгжөөнэ.',
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
        />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────── */}
      <section
        className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 text-center"
        aria-label="Hero"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_60%)] opacity-10" />

        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={heroTextVariants}
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent/70"
        >
          TOUS les JOURS &middot; Mongolia
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={heroTextVariants}
          className="mt-4 font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Өдөр бүр шинэ
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={heroTextVariants}
          className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/60"
        >
          Франц-Ази шинэхэн бүтээгдэхүүний мэргэжлийн туршлага — технологи болон ур ухаанаар
          бүтээгдсэн.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={heroTextVariants}
          className="mt-10"
        >
          <Link
            href="/showcase"
            className="inline-block rounded-md bg-accent px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-widest text-background transition-colors hover:bg-accent/80"
          >
            3D бүтээгдэхүүн үзэх
          </Link>
        </motion.div>
      </section>

      {/* ── Brand Story ────────────────────────────── */}
      <section className="border-t border-muted/40 bg-surface px-4 py-24" aria-label="Brand story">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/60">
              Бидний түүх
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              28 жилийн туршлагатай
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="mt-6 text-lg leading-relaxed text-foreground/60">
              TOUS les JOURS нь Франц хэлээр &ldquo;Өдөр бүр&rdquo; гэсэн утгатай бөгөөд, шинэхэн
              гурилан бүтээгдэхүүнийг өдөр бүр хэрэглэгчдэд хүргэх зорилготой.
            </p>
          </ScrollReveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
          {milestones.map((m, i) => (
            <ScrollReveal key={m.year} delay={0.1 + i * 0.12}>
              <div className="rounded-lg border border-muted/40 bg-background p-6 text-center">
                <span className="font-display text-3xl font-bold text-accent">{m.year}</span>
                <p className="mt-3 text-sm leading-relaxed text-foreground/60">{m.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section className="px-4 py-24" aria-label="Why TLJ">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-accent/60">
              Яагаад TLJ
            </p>
            <h2 className="mt-3 text-center font-display text-3xl font-bold text-foreground sm:text-4xl">
              Гурван багана
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={0.1 + i * 0.12}>
                <article className="group rounded-lg border border-muted/40 bg-surface p-8 transition-colors hover:border-accent/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                    {f.icon}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60">{f.description}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3D Showcase ────────────────────────────── */}
      <section
        className="border-t border-muted/40 bg-surface px-4 py-24"
        aria-label="3D product showcase"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <ScrollReveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/60">
              3D туршлага
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Бүтээгдэхүүнийг эргүүлж үзээрэй
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-foreground/60">
              Гараараа эргүүлж, өнцөг бүрээс нь хараарай.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="mt-10 w-full max-w-2xl">
            <ClientShowcase />
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
