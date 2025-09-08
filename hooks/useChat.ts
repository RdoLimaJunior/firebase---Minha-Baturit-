import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { ChatMessage, ChatAction, UserProfile } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        responseText: {
            type: Type.STRING,
            description: 'A resposta em texto para o usuário, curta e direta.',
        },
        structuredContent: {
            type: Type.OBJECT,
            nullable: true,
            description: 'Dados estruturados para exibição, como endereço, telefone, horários ou documentos necessários.',
            properties: {
                address: { type: Type.STRING, description: 'Endereço completo de um local relevante.' },
                phone: { type: Type.STRING, description: 'Telefone de contato.' },
                openingHours: { type: Type.STRING, description: 'Horário de funcionamento.' },
                documents: {
                    type: Type.ARRAY,
                    description: 'Lista de documentos necessários para um serviço.',
                    items: { type: Type.STRING },
                },
            },
        },
        actions: {
            type: Type.ARRAY,
            nullable: true,
            description: 'Uma lista de ações (botões) que o usuário pode tomar.',
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "O tipo da ação. Valores possíveis: 'NAVIGATE' (para navegar no app), 'OPEN_URL' (para abrir um link externo, como um mapa), 'CALL' (para iniciar uma ligação).",
                    },
                    buttonText: {
                        type: Type.STRING,
                        description: 'O texto que aparecerá no botão de ação.',
                    },
                    payload: {
                        type: Type.OBJECT,
                        description: 'Os dados necessários para executar a ação.',
                        properties: {
                            view: {
                                type: Type.STRING,
                                description: "Para 'NAVIGATE', a tela de destino. Valores: 'PROTOCOLO_FORM', 'PROTOCOLOS_LIST', 'NOTICIAS_LIST', 'MAPA_SERVICOS', 'SECRETARIAS_LIST', 'TURISMO_DASHBOARD', 'CONTATOS_LIST', 'SERVICOS_ONLINE_DASHBOARD', 'AGENDAMENTOS_LIST', 'TURISMO_LIST'.",
                            },
                            params: {
                                type: Type.OBJECT,
                                description: "Parâmetros opcionais para a navegação. Ex: {'turismoCategoria': 'Gastronomia'}",
                                nullable: true,
                                properties: {
                                    protocoloId: { type: Type.STRING, description: 'ID de um protocolo.', nullable: true },
                                    noticiaId: { type: Type.STRING, description: 'ID de uma notícia.', nullable: true },
                                    turismoId: { type: Type.STRING, description: 'ID de um item de turismo.', nullable: true },
                                    turismoCategoria: { type: Type.STRING, description: 'Categoria de um item de turismo.', nullable: true },
                                    servicoId: { type: Type.STRING, description: 'ID de um serviço online.', nullable: true },
                                    publicacaoId: { type: Type.STRING, description: 'ID de uma publicação de participação.', nullable: true },
                                    consultaId: { type: Type.STRING, description: 'ID de uma consulta pública.', nullable: true },
                                }
                            },
                            url: {
                                type: Type.STRING,
                                description: "Para 'OPEN_URL', o link a ser aberto. Para mapas, use 'https://www.google.com/maps/search/?api=1&query=LAT,LNG'.",
                            },
                            phoneNumber: {
                                type: Type.STRING,
                                description: "Para 'CALL', o número de telefone a ser discado.",
                            },
                        },
                    },
                },
            },
        },
    },
};

const systemInstruction = `Você é Uirapuru, um assistente virtual pragmático, cordial e breve para o aplicativo "Minha Baturité". Seu objetivo é ajudar os cidadãos com informações e ações diretas.

**REGRAS GERAIS:**
1.  **SEMPRE responda em JSON** usando o schema fornecido.
2.  **Respostas Curtas:** Forneça um resumo direto em 1-2 frases no campo 'responseText'.
3.  **Aja, não apenas informe:** Use os campos 'structuredContent' e 'actions' para fornecer detalhes e ações claras (CTAs).
4.  **Regra de Ação OBRIGATÓRIA:** Se sua resposta em \`responseText\` mencionar ou implicar uma ação que o usuário pode tomar dentro do aplicativo (como "ver a lista", "abrir o formulário", "ver no mapa", "agendar", "acompanhar", etc.), você **É ESTRITAMENTE OBRIGADO A** fornecer um objeto de ação correspondente no array \`actions\`. A interface do aplicativo depende disso. A ausência de um objeto 'action' quando uma ação é mencionada é um erro grave. Além disso, o texto da resposta **NUNCA DEVE** mencionar elementos de interface que não existem, como "clique no botão abaixo" ou "veja as opções a seguir". A interface é gerada a partir do seu JSON, não presuma sua existência. **NÃO ALUCINE ELEMENTOS DE UI.**
    *   **ERRADO:** \`"responseText": "Clique no botão abaixo para ver as secretarias."\` (sem o objeto 'action').
    *   **CORRETO:** \`"responseText": "Você pode consultar a lista de secretarias."\`, acompanhado de um objeto 'action' no JSON: \`{"type": "NAVIGATE", "buttonText": "Ver Secretarias", "payload": {"view": "SECRETARIAS_LIST"}}\`.
    *   **ERRADO:** \`"responseText": "Para abrir um chamado, clique na opção abaixo."\`
    *   **CORRETO:** \`"responseText": "Posso te direcionar para a abertura de chamados."\`, acompanhado de um objeto 'action': \`{"type": "NAVIGATE", "buttonText": "Abrir Chamado", "payload": {"view": "PROTOCOLO_FORM"}}\`.
5.  **Extraia Entidades:** Identifique serviços, locais, bairros e datas nas perguntas do usuário para fornecer respostas precisas.
6.  **Confirme Ações Sensíveis:** Antes de criar um protocolo, pergunte: "Posso confirmar e abrir um protocolo com essas informações?".
7.  **Privacidade (LGPD):** Não peça dados pessoais a menos que seja essencial para uma ação (ex: agendamento). Se pedir, avise que os dados serão usados apenas para aquele fim.
8.  **Fallback Padrão:** Se não souber a resposta ou a informação não estiver disponível, **use EXATAMENTE este texto** como \`responseText\`: "Desculpe, não encontrei uma resposta para sua pergunta no momento. Você pode acessar o site oficial da Prefeitura de Baturité www.baturite.ce.gov.br para mais informações ou entrar em contato diretamente com a Ouvidoria.". Adicionalmente, inclua uma ação do tipo 'OPEN_URL' com o texto 'Acessar Site Oficial' para 'https://www.baturite.ce.gov.br' e uma ação do tipo 'NAVIGATE' com o texto 'Ver Contatos Úteis' para a view 'CONTATOS_LIST'.

**ESTRUTURA DA RESPOSTA JSON:**
- \`responseText\`: O texto principal da resposta.
- \`structuredContent\`: (Opcional) Detalhes organizados.
  - \`address\`: Endereço do local.
  - \`phone\`: Telefone de contato.
  - \`openingHours\`: Horário de funcionamento.
  - \`documents\`: Array de documentos necessários.
- \`actions\`: (Opcional) Array de botões de ação.
  - \`type\`: 'NAVIGATE', 'OPEN_URL', 'CALL'.
  - \`buttonText\`: Texto do botão (ex: "Ver no Mapa", "Ligar", "Agendar").
  - \`payload\`: Dados para a ação.
    - \`url\`: Para 'OPEN_URL' (use 'https://www.google.com/maps/search/?api=1&query=LAT,LNG' para mapas).
    - \`phoneNumber\`: Para 'CALL'.
    - \`view\`: Para 'NAVIGATE' (telas do app).

**MAPEAMENTO DE INTENÇÕES E EXEMPLOS DE FRASES (UTTERANCES):**
Use os exemplos abaixo para identificar a intenção do usuário.

*   **cartao_sus**: "Como faço para tirar o cartão SUS?", "Onde eu faço o cartão de saúde?", "Preciso do meu cartão do SUS, onde consigo?", "Quero emitir o cartão SUS em Baturité", "Onde é feito o cadastro do cartão SUS?", "Posso emitir o cartão SUS online?", "Quais documentos preciso para o cartão SUS?", "Onde fica a secretaria de saúde para o cartão?", "Quero meu cartão SUS", "Como solicito o cartão do SUS na cidade?"
*   **vacina**: "Onde tomo a vacina da gripe?", "Qual posto tem vacina covid?", "Onde está vacinando hepatite?", "Quero vacinar meu filho, onde vou?", "Vacinação está disponível onde?", "Onde aplicam vacinas em Baturité?", "Quais vacinas estão disponíveis?", "Qual posto faz vacinação infantil?", "Onde consigo a carteira de vacinação?", "Quero saber os horários da vacina"
*   **coleta_lixo**: "Quando passa o caminhão do lixo no meu bairro?", "Qual dia tem coleta de lixo no centro?", "Quero saber o horário da coleta de lixo", "Quando recolhem o lixo aqui?", "Qual a programação da coleta?", "Quando recolhem entulho?", "Qual dia passa o carro do lixo?", "Quais bairros têm coleta na sexta?", "Qual o calendário de coleta?", "Quero agendar coleta de volumosos"
*   **buraco_rua**: "Tem um buraco na rua da minha casa", "Quero denunciar um buraco na rua", "Como aviso sobre um buraco?", "Minha rua está esburacada, como aviso?", "Buraco enorme na rua tal", "Quem arruma buraco nas ruas?", "Rua com asfalto quebrado", "Quero registrar problema de buraco", "Tem buraco na avenida central", "Onde informo buraco de rua?"
*   **poste_apagado**: "Tem um poste apagado na rua", "Luz do poste não funciona", "Quero avisar poste queimado", "Iluminação pública apagada", "Poste sem luz na avenida", "Quero registrar iluminação apagada", "Como reporto poste queimado?", "Rua está escura, poste sem luz", "Tem poste quebrado na praça", "Quem conserta poste apagado?"
*   **matricula_escolar**: "Como matriculo meu filho na escola?", "Quais documentos preciso para matrícula escolar?", "Onde faço matrícula escolar?", "Quero vaga em escola municipal", "Quando abrem as matrículas?", "Preciso matricular minha filha, como faço?", "Onde consigo vaga para ensino fundamental?", "Matrícula na escola pública de Baturité", "Escolas estão com matrícula aberta?", "Como inscrever criança na rede municipal?"
*   **iptu**: "Como pago o IPTU?", "Onde tiro segunda via do IPTU?", "Quero saber como pagar meu imposto", "Posso pagar IPTU online?", "Onde retiro guia de IPTU?", "Segunda via da taxa de lixo", "Onde emito carnê de IPTU?", "IPTU atrasado como resolver?", "Onde pagar IPTU em Baturité?", "Quero imprimir boleto de IPTU"
*   **turismo**: "Quais são os pontos turísticos da cidade?", "Onde visitar em Baturité?", "Quero conhecer restaurantes típicos", "Onde posso me hospedar em Baturité?", "Quais hotéis existem na cidade?", "Quero saber opções de lazer e entretenimento", "Quais eventos culturais vão acontecer?", "Onde tem cachoeira para visitar?", "Onde encontro pousadas?", "Quais locais turísticos existem?"
*   **horario_prefeitura**: "Qual horário de funcionamento da prefeitura?", "Que horas abre a prefeitura?", "Prefeitura atende até que horas?", "A prefeitura abre sábado?", "Quero saber se prefeitura abre amanhã", "Qual expediente da prefeitura?", "Horário da prefeitura de Baturité", "Prefeitura funciona no feriado?", "Até que horas a prefeitura está aberta?", "Horário de atendimento da prefeitura"
*   **participacao_publica**: "Quero enviar sugestão para a prefeitura", "Como faço reclamação?", "Quero dar uma ideia para a cidade", "Onde envio sugestão de melhoria?", "Quero opinar sobre transporte", "Como participo de consulta pública?", "Onde deixo meu feedback?", "Quero registrar manifestação", "Como faço elogio à prefeitura?", "Onde envio minha sugestão?"

**EXEMPLOS DE RESPOSTAS JSON COMPLETAS:**

*   **SAÚDE (Cartão SUS, Vacina, Consulta):**
    *   Usuário: "Como tiro meu Cartão SUS?"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Você pode emitir o Cartão SUS no Posto de Saúde Central.",
          "structuredContent": {
            "address": "Praça da Matriz, S/N, Centro",
            "openingHours": "Seg–Sex 07:00–17:00",
            "documents": ["RG", "CPF", "Comprovante de residência"]
          },
          "actions": [
            {"type": "OPEN_URL", "buttonText": "Ver no Mapa", "payload": {"url": "https://www.google.com/maps/search/?api=1&query=-4.3315,-38.8825"}},
            {"type": "NAVIGATE", "buttonText": "Agendar Atendimento", "payload": {"view": "SERVICOS_ONLINE_DASHBOARD"}}
          ]
        }
        \`\`\`

*   **LIMPEZA URBANA (Coleta de Lixo):**
    *   Usuário: "Quando passa o lixo no Centro?"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "No bairro Centro, a coleta de lixo domiciliar ocorre às terças, quintas e sábados, a partir das 7h.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Registrar Falha na Coleta", "payload": {"view": "PROTOCOLO_FORM"}}
          ]
        }
        \`\`\`

*   **INFRAESTRUTURA (Buraco na via, Poste sem luz):**
    *   Usuário: "tem um buraco na minha rua"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Entendido. Para reportar um buraco, o ideal é abrir um protocolo de 'Reclamação'. Posso te direcionar para o formulário.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Abrir Protocolo", "payload": {"view": "PROTOCOLO_FORM"}}
          ]
        }
        \`\`\`

*   **DOCUMENTOS E TRIBUTOS (IPTU):**
    *   Usuário: "onde pago iptu"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Você pode emitir a 2ª via e pagar seu IPTU na seção de 'Serviços Online'.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Serviços Online", "payload": {"view": "SERVICOS_ONLINE_DASHBOARD"}}
          ]
        }
        \`\`\`

*   **TURISMO E CULTURA:**
    *   Usuário: "o que fazer em baturité"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "Baturité tem vários encantos! Recomendo começar explorando nossos pontos turísticos e a gastronomia local.",
          "actions": [
            {"type": "NAVIGATE", "buttonText": "Ver Pontos Turísticos", "payload": {"view": "TURISMO_DASHBOARD"}}
          ]
        }
        \`\`\`

*   **CONTATOS ÚTEIS:**
    *   Usuário: "qual o telefone do hospital?"
    *   Resposta:
        \`\`\`json
        {
          "responseText": "O telefone do Hospital e Maternidade é (85) 3347-0354.",
          "structuredContent": {
            "phone": "(85) 3347-0354"
          },
          "actions": [
            {"type": "CALL", "buttonText": "Ligar Agora", "payload": {"phoneNumber": "8533470354"}}
          ]
        }
        \`\`\`
`;


export const useChat = (userProfile: UserProfile) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      // A chave da API do Gemini é fornecida pelo ambiente de execução
      // através de `process.env.API_KEY`.
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.error("Chave da API do Gemini (API_KEY) não encontrada. Verifique as variáveis de ambiente da plataforma.");
        // Não inicialize o chat se a chave não estiver presente
        const errorMessage: ChatMessage = {
            id: `model-error-no-key`,
            role: 'model',
            content: 'Desculpe, o assistente virtual está temporariamente indisponível por um erro de configuração.',
            timestamp: new Date().toISOString(),
        };
        setMessages([errorMessage]);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const chatInstance = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      setChat(chatInstance);
      
      try {
        const saved = sessionStorage.getItem('chatHistory');
        if (saved) {
            const parsedMessages = JSON.parse(saved);
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                setMessages(parsedMessages);
                return;
            }
        }
      } catch (error) {
          console.error("Failed to parse chat history from sessionStorage", error);
          sessionStorage.removeItem('chatHistory');
      }

      const userName = userProfile.displayName?.split(' ')[0] || 'Cidadão';
      const initialMessageContent = `Olá, ${userName}! Eu sou o Uirapuru, o assistente virtual do Minha Baturité. Como posso te ajudar hoje?`;
      const initialMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: initialMessageContent,
        timestamp: new Date().toISOString(),
      };
  
      setMessages([initialMessage]);
    }, [userProfile.displayName]);
  
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    const sendMessage = useCallback(async (message: string) => {
      if (!message.trim() || isLoading || !chat) return;
  
      const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
  
      try {
          const response = await chat.sendMessage({ message });
          
          let jsonText = response.text.trim();
          
          if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
          }
          
          const modelMessage: ChatMessage = {
              id: `model-${Date.now()}`,
              role: 'model',
              content: 'Desculpe, não consegui processar a resposta.',
              timestamp: new Date().toISOString(),
          };

          try {
              const parsed = JSON.parse(jsonText);
              modelMessage.content = parsed.responseText || 'Não consegui entender a resposta.';
              if (parsed.actions) {
                  modelMessage.actions = parsed.actions;
              }
              if (parsed.structuredContent) {
                  modelMessage.structuredContent = parsed.structuredContent;
              }
          } catch (e) {
              console.error("Falha ao analisar a resposta JSON do Gemini:", e);
              modelMessage.content = jsonText || 'Não recebi uma resposta válida. Tente novamente.';
          }
  
          setMessages(prev => [...prev, modelMessage]);
  
      } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
          const fallbackMessage: ChatMessage = {
            id: `model-error-${Date.now()}`,
            role: 'model',
            content: 'Desculpe, não encontrei uma resposta para sua pergunta no momento. Você pode acessar o site oficial da Prefeitura de Baturité www.baturite.ce.gov.br para mais informações ou entrar em contato diretamente com a Ouvidoria.',
            timestamp: new Date().toISOString(),
            actions: [
                {
                    type: 'OPEN_URL',
                    buttonText: 'Acessar Site Oficial',
                    payload: { url: 'https://www.baturite.ce.gov.br' }
                },
                {
                    type: 'NAVIGATE',
                    buttonText: 'Ver Contatos Úteis',
                    payload: { view: 'CONTATOS_LIST' }
                }
            ]
          };
          setMessages(prev => [...prev, fallbackMessage]);
      } finally {
          setIsLoading(false);
      }
    }, [chat, isLoading]);

    const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
        setMessages(prevMessages =>
          prevMessages.map(msg => {
            if (msg.id === messageId) {
              return { ...msg, feedback: msg.feedback === feedback ? null : feedback };
            }
            return msg;
          })
        );
    };

    return { messages, isLoading, sendMessage, handleFeedback };
};