import React, { useState } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  Share2,
  X,
  Tag,
  BookOpen
} from 'lucide-react';

interface BlogViewProps {
  onOpenRegister: (planId?: string) => void;
  onNavigateHome: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onOpenRegister, onNavigateHome }) => {
  const [blogCategory, setBlogCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const articles = [
    {
      id: 'como-vender-sites-para-negocios-locais',
      title: 'Como Vender Sites Para Negócios Locais Sem Saber Programar em 2026',
      category: 'vendas',
      categoryLabel: 'Vendas',
      readTime: '6 min de leitura',
      date: '16 Mai 2026',
      featured: true,
      icon: '💻',
      summary: 'Descubra como freelancers e agências estão faturando de R$ 5.000 a R$ 15.000/mês minerando no Google Maps e enviando propostas de IA pelo WhatsApp.',
      content: `
### O Cenário Atual dos Negócios Locais em 2026
Milhares de restaurantes, clínicas odontológicas, barbearias e escritórios de advocacia perdem clientes diariamente porque não possuem um site profissional ou dependem apenas de perfis em redes sociais.

### Passo 1: Mineração Inteligente no Google Maps
Com a **OPTAV.IA**, você não precisa perder horas procurando manualmente. O sistema faz varreduras automáticas filtrando empresas por cidade e categoria, apontando exatamente quais possuem ausência de site ou pontuação SEO crítica.

### Passo 2: Geração Automática em 2 Minutos
Ao selecionar um lead, os 7 agentes autônomos da OPTAV.IA geram a cópia de vendas, o design responsivo em Tailwind/React e os botões diretos para o WhatsApp da empresa.

### Passo 3: Abordagem Sem Spam com o SDR Bryan
O agente SDR Bryan envia uma mensagem personalizada no WhatsApp do proprietário mostrando o site já pronto e publicado em link temporário. Quando o dono vê o próprio negócio com visual de alto nível, a conversão é imediata.

### Precificação Recomendada:
- Sites simples (Pizzarias/Salões): R$ 800 a R$ 1.200
- Sites médios (Clínicas/Personal Trainer): R$ 1.500 a R$ 2.500
- Projetos avançados (Advocacia/Imobiliária/SaaS): R$ 2.500 a R$ 5.000
      `
    },
    {
      id: 'quanto-cobrar-por-site-de-restaurante',
      title: 'Quanto Cobrar Por Um Site de Restaurante, Salão ou Clínica',
      category: 'vendas',
      categoryLabel: 'Vendas',
      readTime: '5 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '💰',
      summary: 'Tabela de preços realista com exemplos de cobrança direta para fechar contratos mensais e pontuais com margem de lucro de 95%.',
      content: `
### Como Precificar Seus Projetos sem Medo
A precificação errada é o principal motivo pelo qual freelancers perdem propostas. A regra de ouro em 2026 é focar no **retorno de valor percebido pelo cliente**.

### Tabela de Referência Mercado BR:
1. **Pizzarias e Lanchonetes:** R$ 800 à vista + R$ 99/mês (cardápio digital e link WhatsApp).
2. **Salões de Beleza e Barbearias:** R$ 1.200 à vista + R$ 149/mês (agenda + tabela de serviços).
3. **Clínicas Odontológicas e Estéticas:** R$ 2.000 à vista + R$ 199/mês (captação de leads de convênio e particulares).
4. **Escritórios de Advocacia:** R$ 3.000 à vista + R$ 299/mês (segurança jurídica e autoridade).

Com a assinatura fixada da OPTAV.IA (R$ 97/mês), **um único site vendido já paga até 10 meses de uso da plataforma**.
      `
    },
    {
      id: 'sdr-automatico-whatsapp-ia',
      title: 'SDR Automático: Como Prospectar Clientes Pelo WhatsApp Com IA',
      category: 'whatsapp',
      categoryLabel: 'WhatsApp',
      readTime: '7 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '📱',
      summary: 'Como um agente de IA conduz a conversa, responde dúvidas dos empresários e encaminha o link de pagamento no piloto automático.',
      content: `
### Por Que a Prospecção Tradicional Falha?
Ligar para números fixos ou enviar e-mails frios gera taxas de resposta inferiores a 1%. No Brasil, 99% dos tomadores de decisão em comércios locais usam o WhatsApp como canal principal.

### O Agente SDR Bryan em Ação:
- **Primeiro Contato:** Envia um cumprimento rápido personalizado com o nome da empresa e a foto da prévia do site.
- **Tratamento de Objeções:** Se o cliente disser "já tenho Instagram", a IA explica com dados de mercado que 74% dos clientes procuram no Google antes de comprar.
- **Fechamento:** Apresenta as opções de pagamento e disponibiliza o contrato digital.
      `
    },
    {
      id: 'encontrar-negocios-sem-site-google-maps',
      title: 'Como Encontrar Negócios Sem Site no Google Maps em Minutos',
      category: 'tutorial',
      categoryLabel: 'Tutorial',
      readTime: '4 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '🗺️',
      summary: 'Passo a passo para identificar negócios locais que não têm presença digital e transformá-los em clientes pagantes.',
      content: `
### Mineração Local Eficiente
O Google Maps é o maior banco de dados de clientes potenciais do planeta.

### Onde Focar Suas Buscas:
- Regiões metropolitanas emergentes e bairros comerciais movimentados.
- Nichos de alto ticket: clínicas de implantes, estética avançada, reformas residenciais e petshops premium.
- Verifique se a ficha do perfil da empresa possui o campo "Website" em branco ou apontando para um perfil desatualizado do Facebook.
      `
    },
    {
      id: 'criar-site-com-inteligencia-artificial',
      title: 'Criar Site Com Inteligência Artificial: Guia Completo 2026',
      category: 'ia',
      categoryLabel: 'Inteligência Artificial',
      readTime: '8 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '🤖',
      summary: 'Comparativo das ferramentas de IA do mercado e por que trabalhar em real sem taxas por crédito é a virada de chave.',
      content: `
### A Armadilha das Ferramentas em Dólar
Plataformas americanas cobram mensalidades de U$ 40 a U$ 150 + créditos de tokens por cada clique em "Regerar". Isso inviabiliza o modelo de agência solo no Brasil.

### A Solução OPTAV.IA:
Cobrança fixa em Real (R$ 97/mês), servidor em container de alta performance, esteira autônoma e suporte humano em português pelo WhatsApp.
      `
    },
    {
      id: 'freelancer-sites-como-ganhar-5000-por-mes',
      title: 'Freelancer de Sites: Como Ganhar R$ 5.000/Mês Vendendo Sites',
      category: 'estrategia',
      categoryLabel: 'Estratégia',
      readTime: '6 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '📈',
      summary: 'Plano de ação semanal para sair do zero e construir um faturamento recorrente sólido em 30 dias.',
      content: `
### Plano de Ação Semanal:
- **Semana 1:** Configurar seu perfil e rodar o simulador para mapear 100 potenciais alvos na sua região.
- **Semana 2:** Disparar os primeiros 30 contatos automatizados com prévias prontas.
- **Semana 3:** Fechar os 3 primeiros projetos a R$ 1.200 cada (R$ 3.600 faturados).
- **Semana 4:** Estabelecer a taxa de manutenção mensal de R$ 149 por cliente para garantir caixa futuro.
      `
    },
    {
      id: 'whatsapp-vendas-automatizar-sem-banir',
      title: 'WhatsApp Para Vendas: Como Automatizar Sem Correr Risco de Banimento',
      category: 'whatsapp',
      categoryLabel: 'WhatsApp',
      readTime: '5 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '🛡️',
      summary: 'Boas práticas para usar WhatsApp como canal de prospecção sem cair no filtro de spam.',
      content: `
### Regras Anti-Bloqueio:
- Utilize intervalos aleatórios entre envios (30 a 90 segundos).
- Nunca envie links brutos na primeira mensagem; espere a resposta do cliente.
- Mantenha mensagens humanizadas e curtas, perguntando se o proprietário gostaria de ver uma sugestão visual do seu negócio no Google.
      `
    },
    {
      id: 'nicho-sites-negocios-locais-2026',
      title: 'Nicho de Sites Para Negócios Locais: Por Que é o Melhor em 2026',
      category: 'estrategia',
      categoryLabel: 'Estratégia',
      readTime: '5 min de leitura',
      date: '16 Mai 2026',
      featured: false,
      icon: '🎯',
      summary: 'Dados de mercado que mostram por que vender sites para negócios locais é a oportunidade mais lucrativa e constante.',
      content: `
### O Poder dos Comércios Locais
Diferente de startups exigentes, comércios locais apreciam soluções diretas e rápidas. Eles querem que o telefone toque, a agenda encha e o cliente chegue. Quando você apresenta um site pronto que atinge esse objetivo em poucas horas, o contrato é assinado no mesmo dia.
      `
    }
  ];

  const filteredArticles = articles.filter(a => blogCategory === 'all' || a.category === blogCategory);
  const featuredArticle = articles.find(a => a.featured) || articles[0];

  return (
    <div className="min-h-screen bg-[#06040a] text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Header navigation */}
        <div className="flex items-center justify-between border-b border-purple-900/60 pb-4 font-mono text-xs">
          <button
            onClick={onNavigateHome}
            className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
          >
            <span>← Voltar para a Home</span>
          </button>
          <div className="text-slate-400">
            <span>Blog OPTAV.IA OS — Insights & Estratégias</span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black font-mono text-white uppercase">
            Blog OPTAV.IA OS
          </h1>
          <p className="text-slate-400 font-mono text-xs md:text-sm">
            Estratégias, tutoriais e técnicas de vendas com IA para negócios locais.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'vendas', label: 'Vendas' },
            { id: 'ia', label: 'Inteligência Artificial' },
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'estrategia', label: 'Estratégia' },
            { id: 'tutorial', label: 'Tutorial' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setBlogCategory(cat.id)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                blogCategory === cat.id
                  ? 'bg-purple-600 border-purple-400 text-white font-bold'
                  : 'bg-[#0e0a1a] border-purple-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Post Card */}
        {blogCategory === 'all' && (
          <div
            onClick={() => setSelectedArticle(featuredArticle)}
            className="bg-[#0e0a1a] border-2 border-purple-800/80 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 cursor-pointer hover:border-purple-500 transition-all shadow-2xl group"
          >
            <div className="md:col-span-4 aspect-video bg-[#140d28] rounded-2xl flex items-center justify-center text-5xl border border-purple-900/60">
              {featuredArticle.icon}
            </div>
            <div className="md:col-span-8 flex flex-col justify-center space-y-3 font-mono">
              <div className="flex items-center space-x-3 text-xs">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/60 uppercase">
                  DESTAQUE
                </span>
                <span className="text-slate-400">{featuredArticle.date}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400">{featuredArticle.readTime}</span>
              </div>
              <h2 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-slate-300 font-sans text-sm line-clamp-3">
                {featuredArticle.summary}
              </p>
              <div className="pt-2 text-xs font-bold text-[#00FFB3] flex items-center space-x-1">
                <span>LER ARTIGO COMPLETO</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-[#0e0a1a] rounded-2xl border border-purple-900/60 p-5 space-y-4 hover:border-purple-500 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-purple-400 font-bold uppercase">{article.categoryLabel}</span>
                  <span>{article.readTime}</span>
                </div>
                <div className="text-3xl">{article.icon}</div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-950 text-xs font-bold text-slate-300 flex items-center justify-between group-hover:text-[#00FFB3]">
                <span>Ler mais</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 p-6 md:p-10 bg-[#0e0a1a] border-2 border-purple-700/80 rounded-3xl shadow-2xl font-sans text-slate-100 space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2 font-mono">
              <span className="text-xs font-bold text-[#00FFB3] uppercase px-3 py-1 bg-[#00FFB3]/10 rounded border border-[#00FFB3]/30">
                {selectedArticle.categoryLabel}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white pt-2 leading-tight">
                {selectedArticle.title}
              </h1>
              <div className="text-xs text-slate-400 flex items-center space-x-3 pt-1">
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed border-t border-purple-900/60 pt-6 space-y-4 whitespace-pre-line">
              {selectedArticle.content}
            </div>

            <div className="pt-6 border-t border-purple-900/60 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
              <div className="text-xs text-slate-400">
                Gostou deste artigo? Comece a aplicar hoje mesmo com a OPTAV.IA.
              </div>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onOpenRegister('starter');
                }}
                className="px-6 py-3 bg-[#00FFB3] text-black font-black text-xs rounded fl-pixel-btn"
              >
                CRIAR MEU PROJETO AGORA →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
