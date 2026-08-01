import { callGeminiWithRetry } from './llm/client.js';
import { logger } from './logger.js';

export async function generatePersona(
  leadName: string,
  segment: string,
  reviews: Array<{ author: string; text: string; rating: number }>
) {
  const prompt = `Analise os dados e avaliações do estabelecimento a seguir para criar um perfil de público-alvo (persona):
Nome: ${leadName}
Segmento: ${segment}
Avaliações dos clientes:
${reviews.map((r) => `- [Nota ${r.rating}/5] "${r.text}"`).join('\n')}

Responda ESTRITAMENTE em formato JSON com as chaves:
"publicoAlvo" (string), "dores" (array de strings), "tomMensagem" (string), "keywords" (array de strings), "personaSummary" (string).`;

  try {
    const rawResult = await callGeminiWithRetry({
      prompt,
      systemInstruction: 'Você é um especialista em marketing estratégico e construção de personas para empresas locais.',
      responseMimeType: 'application/json'
    });
    const cleanJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err: any) {
    logger.error({ error: err.message }, '[generatePersona Failed]');
    throw new Error(`Falha na geração de persona via Gemini LLM: ${err.message}`);
  }
}

export async function generateSiteCopy(
  leadName: string,
  segment: string,
  personaSummary: string,
  reviews: Array<{ author: string; text: string }>
) {
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

  try {
    const rawResult = await callGeminiWithRetry({
      prompt,
      systemInstruction: 'Você é um copywriter sênior especializado em pousadas, restaurantes, clínicas e serviços locais.',
      responseMimeType: 'application/json'
    });
    const cleanJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err: any) {
    logger.error({ error: err.message }, '[generateSiteCopy Failed]');
    throw new Error(`Falha na geração de copy do site via Gemini LLM: ${err.message}`);
  }
}

export async function generateOutreachMessage(
  leadName: string,
  sdrName: string,
  siteUrl: string,
  personaSummary: string,
  promptDelta: string
) {
  const prompt = `Escreva uma mensagem curta e persuasiva de WhatsApp (no máximo 3 parágrafos) enviada por "${sdrName}" para o proprietário de "${leadName}".
Link da prévia do site: ${siteUrl}
Perfil do cliente: ${personaSummary}
Diretriz de Aprendizado: ${promptDelta}

A mensagem deve apresentar o novo site cinematográfico que foi criado sob medida. O remetente se identifica como "${sdrName}". Retorne apenas o texto da mensagem.`;

  try {
    const text = await callGeminiWithRetry({
      prompt,
      systemInstruction: 'Você é um SDR altamente capacitado enviando mensagens personalizadas de alta conversão via WhatsApp.'
    });
    return text.trim();
  } catch (err: any) {
    logger.error({ error: err.message }, '[generateOutreachMessage Failed]');
    throw new Error(`Falha na geração da abordagem de SDR via Gemini LLM: ${err.message}`);
  }
}

export async function generateEmailOutreachMessage(
  leadName: string,
  sdrName: string,
  siteUrl: string,
  personaSummary: string
) {
  const prompt = `Crie um e-mail de prospecção comercial altamente profissional e persuasivo oferecendo a prévia de um site pronto para a empresa "${leadName}".
O e-mail deve ser assinado por "${sdrName}".
Link do site de demonstração: ${siteUrl}
Resumo da empresa: ${personaSummary}

Responda ESTRITAMENTE em formato JSON com a estrutura:
{
  "subject": "Assunto do Email...",
  "body": "Corpo do email em texto formatado..."
}`;

  try {
    const rawResult = await callGeminiWithRetry({
      prompt,
      systemInstruction: 'Você é um executivo de vendas B2B experiente escrevendo e-mails de prospecção fria de alto impacto.',
      responseMimeType: 'application/json'
    });
    const cleanJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err: any) {
    logger.error({ error: err.message }, '[generateEmailOutreachMessage Failed]');
    throw new Error(`Falha na geração do e-mail de prospecção via Gemini LLM: ${err.message}`);
  }
}

export async function generateSdrReply(
  leadName: string,
  sdrName: string,
  sdrTone: string,
  sdrRules: string[],
  history: Array<{ role: string; text: string }>
) {
  const prompt = `Você é o SDR "${sdrName}" conversando pelo WhatsApp com o proprietário do ${leadName}.
Tom de voz: ${sdrTone}
Regras obrigatórias: ${sdrRules.join(', ')}

Histórico da conversa:
${history.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

Escreva a próxima resposta curta e natural do SDR se apresentando como "${sdrName}". Retorne apenas o texto.`;

  try {
    const text = await callGeminiWithRetry({
      prompt,
      systemInstruction: `Você é ${sdrName}, SDR atencioso e persuasivo focado em converter oportunidades via WhatsApp.`
    });
    return text.trim();
  } catch (err: any) {
    logger.error({ error: err.message }, '[generateSdrReply Failed]');
    throw new Error(`Falha na geração de resposta do SDR via Gemini LLM: ${err.message}`);
  }
}

export async function generateAiSiteSection(userPrompt: string, segment: string) {
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

  try {
    const rawResult = await callGeminiWithRetry({
      prompt,
      responseMimeType: 'application/json'
    });
    const cleanJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err: any) {
    logger.error({ error: err.message }, '[generateAiSiteSection Failed]');
    throw new Error(`Falha ao gerar nova seção do site via Gemini LLM: ${err.message}`);
  }
}

export async function scrapeLeadsWithGemini(
  keyword: string,
  city: string,
  maxResults: number = 5
) {
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
10. Trechos de depoimentos marcantes no Google
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
    "reviewQuotes": ["Depoimento 1", "Depoimento 2"],
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

  try {
    const rawResult = await callGeminiWithRetry({
      prompt,
      systemInstruction: 'Você é um robô de busca de leads comerciais reais no Google Maps com busca avançada.',
      responseMimeType: 'application/json'
    });
    const cleanJson = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error('Retorno do scraping do Gemini não contém uma lista válida de empresas.');
  } catch (err: any) {
    logger.error({ error: err.message }, '[scrapeLeadsWithGemini Failed]');
    throw new Error(`Erro na varredura de leads no Google Maps via Gemini LLM: ${err.message}`);
  }
}
