import React from 'react';
import { SiteData } from '../types/index.js';
import { Phone, Star, CheckCircle, MapPin, ExternalLink, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

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
  const { copy, colors, fonts, images, sections } = site;

  return (
    <div
      className="w-full min-h-screen text-slate-800 font-sans transition-all duration-300 overflow-x-hidden"
      style={{
        backgroundColor: colors.background || '#f8fafc',
        fontFamily: fonts.body || 'Inter, sans-serif'
      }}
    >
      {/* Top Banner Navigation */}
      <nav
        className="w-full px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/60"
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-lg"
            style={{ backgroundColor: colors.primary }}
          >
            {leadName.charAt(0)}
          </div>
          <span
            className="text-xl font-bold tracking-tight text-slate-900"
            style={{ fontFamily: fonts.display || 'serif' }}
          >
            {leadName}
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <a href="#about" className="hover:text-slate-900 transition-colors">Sobre</a>
          <a href="#services" className="hover:text-slate-900 transition-colors">Serviços</a>
          <a href="#testimonials" className="hover:text-slate-900 transition-colors">Avaliações</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">Contato</a>
        </div>
        <a
          href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center space-x-2 shadow-sm transition-transform transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: colors.secondary || '#15803d' }}
        >
          <Phone className="w-4 h-4" />
          <span>Falar no WhatsApp</span>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-2xs border border-amber-200 bg-amber-50 text-amber-800"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1.5" />
            Atendimento Recomendado no Google Maps
          </span>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
            style={{ fontFamily: fonts.display || 'serif' }}
          >
            {copy.heroTitle}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            {copy.heroSubtitle}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-xl text-white font-bold text-center shadow-lg transition-transform transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              style={{ backgroundColor: colors.primary }}
            >
              <span>{copy.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center space-x-2 text-xs text-slate-500 py-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{copy.guaranteeText}</span>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div
            className="absolute -inset-1 rounded-3xl blur-xl opacity-30 transition group-hover:opacity-60"
            style={{ backgroundColor: colors.accent }}
          ></div>
          <img
            src={images.hero}
            alt={leadName}
            className="relative rounded-2xl shadow-2xl w-full h-[380px] object-cover"
          />
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section) => {
        if (section.type === 'about') {
          return (
            <section key={section.id} id="about" className="py-16 px-6 bg-white border-y border-slate-100">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <img
                  src={images.about}
                  alt="Sobre"
                  className="rounded-2xl shadow-lg w-full h-[320px] object-cover"
                />
                <div className="space-y-4">
                  <h2
                    className="text-3xl font-bold text-slate-900"
                    style={{ fontFamily: fonts.display || 'serif' }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                    {section.content}
                  </p>
                  <div className="flex items-center space-x-3 text-slate-700 text-sm font-medium pt-2">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0" />
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
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: fonts.display || 'serif' }}
                >
                  {section.title}
                </h2>
                {section.subtitle && <p className="text-slate-600 mt-2">{section.subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4 shadow-2xs" style={{ backgroundColor: colors.primary }}>
                        <Star className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">{item.description}</p>
                    </div>
                    {item.price && (
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-emerald-700">
                        <span>{item.price}</span>
                        <a href={`https://wa.me/${leadPhone.replace(/\D/g, '')}`} className="text-xs text-slate-500 hover:underline">Pedir agora →</a>
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
            <section key={section.id} id="testimonials" className="py-16 px-6 bg-slate-900 text-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: fonts.display || 'serif' }}
                  >
                    {section.title}
                  </h2>
                  <p className="text-slate-400 mt-2">{section.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items?.map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-sm">
                      <div className="flex items-center space-x-1 mb-3 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-200 text-sm italic">"{item.description}"</p>
                      <span className="block mt-4 font-bold text-slate-100 text-xs text-right">— {item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'custom') {
          return (
            <section key={section.id} className="py-12 px-6 max-w-6xl mx-auto bg-amber-50/50 rounded-2xl border border-amber-200/60 my-8">
              <h2 className="text-2xl font-bold text-slate-900 text-center" style={{ fontFamily: fonts.display || 'serif' }}>{section.title}</h2>
              {section.subtitle && <p className="text-center text-slate-600 text-sm mb-6">{section.subtitle}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl shadow-xs border border-slate-200">
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-slate-600 text-xs mt-1">{item.description}</p>
                  </div>
                ))}
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
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-lg"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
