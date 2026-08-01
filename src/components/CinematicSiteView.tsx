import React, { useState } from 'react';
import { SiteData } from '../types/index.js';
import { Phone, Star, CheckCircle, MapPin, ExternalLink, Calendar, MessageSquare, ArrowRight, ChevronDown, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface CinematicSiteViewProps {
  site: SiteData;
  leadName: string;
  leadPhone: string;
  leadAddress: string;
}

export const CinematicSiteView: React.FC<CinematicSiteViewProps> = ({
  site,
  leadName,
  leadPhone,
  leadAddress
}) => {
  const { copy, colors, fonts, images, sections, prd } = site;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const archetype = prd?.archetype || 'minimal-clean';
  const layoutFamily = prd?.layoutDna?.layoutFamily || 'split-hero';

  return (
    <div
      className="w-full min-h-screen transition-all duration-300 overflow-x-hidden"
      style={{
        backgroundColor: colors.background || colors.paper || '#f8fafc',
        color: colors.ink || '#0f172a',
        fontFamily: fonts.body || 'Inter, sans-serif'
      }}
    >
      {/* Dynamic Font Google Import */}
      {prd?.designTokens?.googleFontsUrl && (
        <link rel="stylesheet" href={prd.designTokens.googleFontsUrl} />
      )}

      {/* Top Navigation */}
      <nav
        className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 text-white"
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-base"
            style={{ backgroundColor: colors.accent || colors.primary }}
          >
            {leadName.charAt(0)}
          </div>
          <span
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: fonts.display || 'sans-serif' }}
          >
            {leadName}
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-xs font-mono tracking-wider uppercase text-slate-300">
          <a href="#about" className="hover:text-cyan-400 transition-colors">Sobre</a>
          <a href="#bento" className="hover:text-cyan-400 transition-colors">Diferenciais</a>
          <a href="#services" className="hover:text-cyan-400 transition-colors">Serviços</a>
          <a href="#testimonials" className="hover:text-cyan-400 transition-colors">Avaliações</a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
        </div>
        <a
          href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all hover:scale-105"
          style={{ backgroundColor: colors.accent || '#10b981' }}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </nav>

      {/* Hero Section - Parallax / Split / Bento Variant */}
      <section className="relative w-full py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-tight border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{prd?.conversionMap?.trustBadge || `Nota ${site.visionScore || 4.9} ★★★★★ no Google Maps`}</span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-black leading-tight tracking-tight uppercase"
              style={{ fontFamily: fonts.display || 'sans-serif', color: colors.primary }}
            >
              {prd?.hero?.h1 || copy.heroTitle}
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {prd?.hero?.subheadline || copy.heroSubtitle}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a
                href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`}
                className="px-7 py-4 rounded-xl text-white font-bold text-sm text-center shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                style={{ backgroundColor: colors.primary }}
              >
                <span>{prd?.conversionMap?.ctaPrimaryLabel || copy.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono py-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{prd?.conversionMap?.guaranteeText || copy.guaranteeText}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 relative group">
            <div
              className="absolute -inset-1 rounded-3xl blur-2xl opacity-40 transition group-hover:opacity-70"
              style={{ backgroundColor: colors.accent }}
            ></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src={images.hero}
                alt={leadName}
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">[ ARCHETYPE: {archetype} ]</span>
                <span className="font-bold text-lg">{leadName}</span>
                <span className="text-xs text-slate-300">{leadAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Render of PRD Sections */}
      {sections.map((section) => {
        if (section.type === 'bento') {
          return (
            <section key={section.id} id="bento" className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-200/60">
              <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
                <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 text-cyan-700 font-mono text-xs uppercase font-bold">
                  BENTO GRID // DESIGNER PRD
                </div>
                <h2 className="text-3xl font-extrabold uppercase tracking-tight" style={{ fontFamily: fonts.display }}>
                  {section.title}
                </h2>
                {section.subtitle && <p className="text-slate-600 text-sm">{section.subtitle}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {section.items?.map((item, idx) => {
                  const isWide = idx === 0 || idx === 3;
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-3 bg-white ${
                        isWide ? 'md:col-span-2' : 'md:col-span-2'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-white">
                          {item.tag || 'DESTAQUE'}
                        </span>
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        if (section.type === 'about') {
          return (
            <section key={section.id} id="about" className="py-16 px-6 bg-slate-900 text-white">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <img
                  src={images.about}
                  alt="Sobre"
                  className="rounded-2xl shadow-2xl w-full h-[340px] object-cover border border-slate-800"
                />
                <div className="space-y-4">
                  <h2
                    className="text-3xl font-bold uppercase"
                    style={{ fontFamily: fonts.display }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                    {section.content}
                  </p>
                  <div className="flex items-center space-x-3 text-emerald-400 text-sm font-mono pt-2">
                    <MapPin className="w-5 h-5 shrink-0" />
                    <span>{leadAddress}</span>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'services') {
          return (
            <section key={section.id} id="services" className="py-16 px-6 max-w-6xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2
                  className="text-3xl font-bold uppercase text-slate-900"
                  style={{ fontFamily: fonts.display }}
                >
                  {section.title}
                </h2>
                {section.subtitle && <p className="text-slate-600 mt-2 text-sm">{section.subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-xs" style={{ backgroundColor: colors.primary }}>
                        <Star className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    {item.price && (
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-emerald-700 text-xs">
                        <span>{item.price}</span>
                        <a href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`} className="text-xs text-slate-500 hover:underline">Solicitar Orçamento →</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'testimonials') {
          return (
            <section key={section.id} id="testimonials" className="py-16 px-6 bg-slate-950 text-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2
                    className="text-3xl font-bold text-white uppercase"
                    style={{ fontFamily: fonts.display }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-slate-400 mt-2 text-sm">{section.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items?.map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
                      <div className="flex items-center space-x-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-sm italic">"{item.description}"</p>
                      <span className="block font-mono font-bold text-slate-400 text-xs text-right">— {item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'faq') {
          return (
            <section key={section.id} id="faq" className="py-16 px-6 max-w-4xl mx-auto border-t border-slate-200">
              <div className="text-center mb-10 space-y-2">
                <h2 className="text-3xl font-extrabold uppercase text-slate-900" style={{ fontFamily: fonts.display }}>
                  {section.title}
                </h2>
                {section.subtitle && <p className="text-slate-600 text-sm">{section.subtitle}</p>}
              </div>

              <div className="space-y-3">
                {section.items?.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-5 py-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                      >
                        <span>{item.title}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-600' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {item.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Footer Contact Section */}
      <footer id="contact" className="py-12 px-6 bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-white font-bold text-lg">{leadName}</h3>
            <p className="text-slate-400 text-xs">{leadAddress}</p>
            <p className="text-slate-400 text-xs">Telefone / WhatsApp: {leadPhone}</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-lg"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

