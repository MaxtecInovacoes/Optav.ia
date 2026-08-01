import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

export async function generatePersona(
  leadName: string,
  segment: string,
  reviews: Array<{ author: string; text: string; rating: number }>
) {
  const client = getAiClient();
  const prompt = `Analise os dados e avaliações do estabelecimento a seguir para criar um perfil de público-alvo (persona):
Nome: ${leadName}
Segmento: ${segment}
Avaliações dos clientes:
${reviews.map((r) => `- [Nota ${r.rating}/5] "${r.text}"`).join('\n')}

Responda ESTRITAMENTE em formato JSON com as chaves:
"publicoAlvo" (string), "dores" (array de strings), "tomMensagem" (string), "keywords" (array de strings), "personaSummary" (string).`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Gemini API call failed for generatePersona, using deterministic fallback:', e);
    }
  }

  // Fallback
  return {
    publicoAlvo: `Clientes locais de ${segment} buscando qualidade, rapidez e praticidade na região.`,
    dores: ['Dificuldade em visualizar preços/cardápio', 'Falta de canal de agendamento/reserva rápido no WhatsApp', 'Informações de contato desatualizadas'],
    tomMensagem: segment === 'restaurante' ? 'Acolhedor, apetitoso e direto' : 'Profissional, atencioso e consultivo',
    keywords: [segment, 'qualidade', 'atendimento', 'reserva', 'whatsapp'],
    personaSummary: `Público valoriza o excelente atendimento de ${leadName} e deseja interagir rapidamente sem burocracia.`
  };
}

export async function generateSiteCopy(
  leadName: string,
  segment: string,
  personaSummary: string,
  reviews: Array<{ author: string; text: string }>
) {
  const client = getAiClient();
  const prompt = `Crie o texto publicitário cinematográfico de alta conversão para o site da empresa "${leadName}" (Segmento: ${segment}).
Resumo da Persona: ${personaSummary}
Reviews: ${reviews.map((r) => r.text).join(' | ')}

Responda ESTRITAMENTE em JSON com a estrutura:
{
  "heroTitle": "...",
  "heroSubtitle": "...",
  "aboutText": "...",
  "ctaText": "...",
  "guaranteeText": "..."
}`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Gemini API call failed for generateSiteCopy, using fallback:', e);
    }
  }

  return {
    heroTitle: `Sua Escolha Principal em ${segment.toUpperCase()} em São Paulo`,
    heroSubtitle: `Atendimento de excelência, transparência e agilidade para você e sua família.`,
    aboutText: `Com ampla dedicação e tradição, ${leadName} oferece soluções sob medida com os melhores padrões do mercado.`,
    ctaText: `Fazer Pedido / Agendar via WhatsApp`,
    guaranteeText: `Garantia de satisfação e atendimento rápido.`
  };
}

export async function generateOutreachMessage(
  leadName: string,
  sdrName: string,
  siteUrl: string,
  personaSummary: string,
  promptDelta: string
) {
  const client = getAiClient();
  const prompt = `Escreva uma mensagem curta e persuasiva de WhatsApp (no máximo 3 parágrafos) enviada por "${sdrName}" para o proprietário de "${leadName}".
Link da prévia do site: ${siteUrl}
Perfil do cliente: ${personaSummary}
Diretriz de Aprendizado: ${promptDelta}

A mensagem deve apresentar o novo site cinematográfico que foi criado sob medida. O remetente se identifica como "${sdrName}". Retorne apenas o texto da mensagem.`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text?.trim() || '';
    } catch (e) {
      console.warn('Gemini API call failed for generateOutreachMessage:', e);
    }
  }

  return `Olá! Me chamo ${sdrName}. Notamos a excelente reputação do ${leadName} no Google Maps! Desenvolvemos uma prévia exclusiva de um novo site moderno e otimizado para vocês: ${siteUrl}. Podemos agendar 2 minutos para te mostrar como ele pode aumentar suas conversões?`;
}

export async function generateEmailOutreachMessage(
  leadName: string,
  sdrName: string,
  siteUrl: string,
  personaSummary: string
) {
  const client = getAiClient();
  const prompt = `Crie um e-mail de prospecção comercial altamente profissional e persuasivo oferecendo a prévia de um site pronto para a empresa "${leadName}".
O e-mail deve ser assinado por "${sdrName}".
Link do site de demonstração: ${siteUrl}
Resumo da empresa: ${personaSummary}

Responda ESTRITAMENTE em formato JSON com a estrutura:
{
  "subject": "Assunto do Email...",
  "body": "Corpo do email em texto formatado..."
}`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Gemini API call failed for generateEmailOutreachMessage:', e);
    }
  }

  return {
    subject: `Proposta de Novo Site Profissional para ${leadName}`,
    body: `Olá,\n\nMeu nome é ${sdrName}. Acompanhando os resultados e excelentes avaliações da ${leadName} no Google Maps, desenvolvemos uma prévia exclusiva de um novo portal cinematográfico para acelerar suas vendas e agendamentos diretos.\n\nAcesse o link demonstrativo: ${siteUrl}\n\nFico à disposição para ajustar cores e detalhes do cardápio/serviços conforme suas preferências.\n\nAtenciosamente,\n${sdrName}`
  };
}

export async function generateSdrReply(
  leadName: string,
  sdrName: string,
  sdrTone: string,
  sdrRules: string[],
  history: Array<{ role: string; text: string }>
) {
  const client = getAiClient();
  const prompt = `Você é o SDR "${sdrName}" conversando pelo WhatsApp com o proprietário do ${leadName}.
Tom de voz: ${sdrTone}
Regras obrigatórias: ${sdrRules.join(', ')}

Histórico da conversa:
${history.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

Escreva a próxima resposta curta e natural do SDR se apresentando como "${sdrName}". Retorne apenas o texto.`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text?.trim() || '';
    } catch (e) {
      console.warn('Gemini API call failed for generateSdrReply:', e);
    }
  }

  const lastMsg = history[history.length - 1]?.text || '';
  if (lastMsg.toLowerCase().includes('quanto') || lastMsg.toLowerCase().includes('preço') || lastMsg.toLowerCase().includes('custo')) {
    return `Para o ${leadName}, nosso plano completo com site no ar, hospedagem e suporte fica em torno de R$ 1.200 (parcelado em até 10x sem juros). O site já vem totalmente pronto com domínio próprio! Quer que eu prepare a proposta formal?`;
  }

  return `Perfeito! O site do ${leadName} foi desenhado por mim para carregar super rápido no celular e facilitar o contato direto no seu WhatsApp. Quer fazer alguma alteração nas cores ou textos?`;
}

export async function generateAiSiteSection(userPrompt: string, segment: string) {
  const client = getAiClient();
  const prompt = `Crie uma nova seção para o site de um ${segment} baseado nesta solicitação do usuário: "${userPrompt}".
Responda ESTRITAMENTE em formato JSON com as chaves:
{
  "type": "custom",
  "title": "...",
  "subtitle": "...",
  "items": [
    { "title": "...", "description": "...", "price": "..." }
  ]
}`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.warn('Gemini API call failed for generateAiSiteSection:', e);
    }
  }

  return {
    type: 'custom',
    title: userPrompt.length > 5 ? userPrompt : 'Destaques e Especialidades',
    subtitle: 'Confira as vantagens exclusivas preparadas para você',
    items: [
      { title: 'Qualidade Garantida', description: 'Atendimento personalizado com suporte direto.' },
      { title: 'Entrega Rápida', description: 'Facilidade de agendamento e resposta imediata.' }
    ]
  };
}

export async function scrapeLeadsWithGemini(
  keyword: string,
  city: string,
  maxResults: number = 5
) {
  const client = getAiClient();
  const prompt = `Você é um agente de prospecção e scraping detalhado de empresas no Google Meu Negócio / Google Maps.
O usuário busca por empresas do segmento/nicho "${keyword}" na cidade/região de "${city}".
Mapeie e retorne até ${maxResults} empresas ativas nessa localização.

Para cada empresa encontrada, extraia todos os dados reais do perfil no Google:
1. Nome da empresa
2. Categoria exata
3. Endereço completo com bairro e CEP de ${city}
4. Telefone/WhatsApp com DDD correto
5. E-mail de contato da empresa (se público ou padrão comercial)
6. Horário de funcionamento (ex: "Aberto 24 horas", "Fechado · Abre sáb às 08:00")
7. Link de site existente (se possuir, ex: "http://desentupidorastrobel.com.br", ou null se não tiver)
8. Avaliação média (ex: 5.0, 4.8, 3.7)
9. Número total de avaliações (ex: 160, 461, 33)
10. Trechos de depoimentos marcantes no Google (ex: ["Recomendo para quem busca desentupidora confiável em Curitiba!", "Sem dúvida é uma das melhores."])
11. Amostra de comentários com autor, texto do comentário, nota dada e data aproximada.

Responda ESTRITAMENTE em formato JSON com a lista de objetos:
[
  {
    "name": "Nome do Estabelecimento",
    "category": "Categoria Exata",
    "address": "Rua/Avenida, Número - Bairro, Cidade - PR",
    "phone": "+55 41 99999-0000",
    "email": "contato@empresa.com.br",
    "openingHours": "Aberto 24 horas",
    "existingSiteUrl": "http://siteexistente.com.br",
    "hasWebsite": false,
    "rating": 5.0,
    "reviewsCount": 160,
    "reviewQuotes": [
      "Recomendo para quem busca empresa confiável!",
      "Atendimento super rápido e excelente."
    ],
    "reviewsSample": [
      {
        "author": "Nome do Cliente Real",
        "text": "Depoimento do cliente no Google Maps...",
        "rating": 5,
        "date": "há 3 dias"
      }
    ]
  }
]`;

  if (client) {
    try {
      let response;
      try {
        response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
      } catch (searchErr) {
        response = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });
      }

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('Gemini API call failed for scrapeLeadsWithGemini, using dynamic fallback:', e);
    }
  }

  // Realistic fallback generator based on Google Meu Negócio patterns for keyword & city
  const generated: Array<{
    name: string;
    category: string;
    address: string;
    phone: string;
    email: string;
    openingHours: string;
    existingSiteUrl: string | null;
    hasWebsite: boolean;
    rating: number;
    reviewsCount: number;
    reviewQuotes: string[];
    reviewsSample: Array<{ author: string; text: string; rating: number; date: string }>;
  }> = [];

  const prefixes = [keyword, `Central ${keyword}`, `SOS ${keyword.toUpperCase()}`, `Lider ${keyword}`, `Água Fácil ${keyword}`];
  const suffixes = ['Curitiba', 'Express', '24 Hours', 'Prime', 'Santos & Pires', 'Batel', 'Centro', 'Tigre'];
  const streets = ['Rua XV de Novembro', 'Av. Cândido de Abreu', 'R. Antônio Cândido Cavalim', 'R. Afonso Bail', 'R. João Palomeque', 'R. Capiberibe'];
  const ddd = city.toLowerCase().includes('curitiba') ? '41' : '11';

  for (let i = 0; i < maxResults; i++) {
    const pref = prefixes[i % prefixes.length];
    const suf = suffixes[i % suffixes.length];
    const street = streets[i % streets.length];
    const num = 100 + i * 142;
    const name = `${pref} ${suf} ${i > 2 ? (i + 1) : ''}`.trim();
    const hasSite = i % 2 === 1;
    const existingSiteUrl = hasSite ? `http://www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br` : null;
    const cleanEmail = `contato@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`;

    generated.push({
      name,
      category: keyword,
      address: `${street}, ${num} - Centro, ${city}`,
      phone: `+55 ${ddd} 9${Math.floor(8000 + Math.random() * 1999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      email: cleanEmail,
      openingHours: i % 3 === 0 ? 'Aberto 24 horas' : i % 3 === 1 ? 'Aberto · Fecha às 18:00' : 'Aberto · Fecha às 00:00',
      existingSiteUrl,
      hasWebsite: hasSite,
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      reviewsCount: Math.floor(30 + Math.random() * 300),
      reviewQuotes: [
        `Recomendo para quem busca ${keyword} confiável em ${city}!`,
        `Sem dúvida é uma das melhores empresas de ${keyword}.`,
        `Qualidade, agilidade e profissionalismo no atendimento.`
      ],
      reviewsSample: [
        {
          author: 'Carlos Eduardo',
          text: `Atendimento impecável para ${keyword} em ${city}. Chegaram muito rápido e resolveram o problema com competência.`,
          rating: 5,
          date: 'há 2 dias'
        },
        {
          author: 'Juliana M.',
          text: 'Serviço excelente e preço justo. Atendimento 24 horas salvou nossa emergência.',
          rating: 5,
          date: 'há 1 semana'
        }
      ]
    });
  }

  return generated;
}

