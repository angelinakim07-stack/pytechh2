'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Layers, Lightbulb, FolderGit2 } from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function WorkClient() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    let active = true;
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => { if (active) setProjects(Array.isArray(d?.projects) ? d.projects : []); })
      .catch(() => active && setProjects([]));
    return () => { active = false; };
  }, []);

  return (
    <div className="relative">
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--brand)), transparent 60%)' }} />
        <div className="container relative mx-auto px-6 pb-8 text-center">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Our work</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Projects we&apos;ve <span className="text-gradient">shipped</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            A living portfolio across Build, Brand, Market &amp; Automate — with real timelines and the challenges we solved.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 md:py-16">
        {projects === null ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-card/40" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><FolderGit2 className="h-7 w-7" /></span>
            <p className="mt-4 font-display text-lg font-semibold">Portfolio coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">We&apos;re curating our latest projects. In the meantime, explore our case studies.</p>
            <Button asChild className="mt-5 rounded-full"><Link href="/case-studies">View case studies</Link></Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50 transition-all hover:border-primary/40 hover:shadow-2xl">
                  {p.image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                      {p.category && <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{p.category}</span>}
                    </div>
                    {p.client && <p className="mt-1 text-sm text-muted-foreground">for {p.client}</p>}
                    {p.description && <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>}
                    {p.challenges && (
                      <div className="mt-4 rounded-lg border border-border bg-background/50 p-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Lightbulb className="h-3.5 w-3.5" /> Challenges we solved</p>
                        <p className="mt-1.5 text-sm text-muted-foreground">{p.challenges}</p>
                      </div>
                    )}
                    {Array.isArray(p.tech) && p.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"><Layers className="h-3 w-3 opacity-60" /> {t}</span>)}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-5">
                      {p.deliveryTime ? <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {p.deliveryTime}</span> : <span />}
                      {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Visit <ArrowUpRight className="h-4 w-4" /></a>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default WorkClient;
