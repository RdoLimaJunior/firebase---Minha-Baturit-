import { useState, useEffect } from 'react';
import {
  Noticia,
  Secretaria,
  PredioPublico,
  TurismoItem,
  ContatoUtil,
  ServicoOnline,
  Protocolo,
  Agendamento,
  Notificacao,
  Publicacao,
  ConsultaPublica,
  StatusProtocolo,
  TipoProtocolo,
  CategoriaReclamacao,
  Comment,
  CategoriaPredioPublico,
  TurismoCategoria,
  CategoriaContato,
  CategoriaServicoOnline,
  AgendamentoStatus,
  TipoPublicacao,
  StatusPublicacao,
  ComentarioPublicacao,
  StatusConsultaPublica,
  OpiniaoConsulta,
} from '../types';
import { BAIRROS_BATURITE, MOCK_USER_PROFILES } from '../constants';

const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', author: { uid: 'user-1-uid', name: MOCK_USER_PROFILES[0].name, avatar: MOCK_USER_PROFILES[0].avatar }, text: 'Ótima notícia!', date: '2023-10-26T10:00:00Z' },
    { id: 'c2', author: { uid: 'user-2-uid', name: MOCK_USER_PROFILES[1].name, avatar: MOCK_USER_PROFILES[1].avatar }, text: 'Parabéns aos envolvidos!', date: '2023-10-26T11:30:00Z' },
];

const MOCK_NOTICIAS: Noticia[] = [
  { id: '1', title: 'Prefeitura de Baturité inicia campanha de vacinação contra a gripe', summary: 'A campanha abrangerá todos os postos de saúde da cidade, com foco em idosos e crianças.', date: '2023-10-26T09:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1605289355482-7e3243851532?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', link: '#', likes: 152, comments: MOCK_COMMENTS },
  { id: '2', title: 'Revitalização da Praça da Matriz é concluída', summary: 'O espaço agora conta com nova iluminação, bancos e paisagismo, oferecendo mais conforto para os cidadãos.', date: '2023-10-25T15:00:00Z', imageUrl: 'https://images.unsplash.com/photo-1589028214738-1a2a9b340a6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80', link: '#', likes: 320, comments: [] },
];

const MOCK_SECRETARIAS: Secretaria[] = [
  { id: 'sec1', nome: 'Secretaria de Saúde', secretario: 'Dr. João da Silva', cargo: 'Secretário Municipal de Saúde', avatarUrl: 'https://i.pravatar.cc/150?u=saude', endereco: 'Rua Principal, 123, Centro', telefone: '(85) 3347-0001', email: 'saude@baturite.ce.gov.br', horario: '08:00 - 17:00' },
  { id: 'sec2', nome: 'Secretaria de Educação', secretario: 'Maria Oliveira', cargo: 'Secretária Municipal de Educação', avatarUrl: 'https://i.pravatar.cc/150?u=educacao', endereco: 'Av. das Escolas, 456, Centro', telefone: '(85) 3347-0002', email: 'educacao@baturite.ce.gov.br', horario: '08:00 - 17:00' },
];

const MOCK_PREDIOS: PredioPublico[] = [
    { id: 'pred1', nome: 'Hospital e Maternidade de Baturité', endereco: 'Rua Justiniano de Serpa, 550', bairro: 'Centro', telefone: '(85) 3347-0354', categoria: 'Saúde', horario: '24 horas', servicos: ['Emergência', 'Internação', 'Maternidade'], localizacao: { latitude: -4.3315, longitude: -38.8825 }, isOpenNow: true, busyness: 'Movimento moderado' },
    { id: 'pred2', nome: 'EEF TI Domingos Sávio', endereco: 'Rua 15 de Novembro, 1000', bairro: 'Conselheiro Estelita', telefone: '(85) 3347-1122', categoria: 'Educação', horario: '07:00 - 17:00', servicos: ['Ensino Fundamental', 'Tempo Integral'], localizacao: { latitude: -4.335, longitude: -38.885 }, isOpenNow: new Date().getHours() >= 7 && new Date().getHours() < 17 },
];

const MOCK_TURISMO: TurismoItem[] = [
    { id: 'tur1', categoria: 'Pontos Turísticos', nome: 'Mosteiro dos Jesuítas', descricao: 'Um refúgio de paz e contemplação, com uma rica história e arquitetura impressionante.', descricaoCurta: 'Paz, história e arquitetura.', endereco: 'Sítio Olho D\'água, s/n', localizacao: { latitude: -4.33, longitude: -38.88 }, imagens: ['https://images.unsplash.com/photo-1628779238333-f5485de5a498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'] },
    // FIX: Removed the 'bairro' property as it does not exist in the 'TurismoItem' type.
    { id: 'tur2', categoria: 'Gastronomia', nome: 'Restaurante Sabor da Serra', descricao: 'Culinária regional com um toque gourmet, aproveitando os ingredientes frescos da serra.', descricaoCurta: 'Culinária regional com toque gourmet.', endereco: 'Rua dos Sabores, 10', localizacao: { latitude: -4.332, longitude: -38.881 }, imagens: ['https://images.unsplash.com/photo-1555243896-c709bfa0b564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'] },
];

const MOCK_CONTATOS: ContatoUtil[] = [
    // FIX: Changed string literal to enum member CategoriaContato.EMERGENCIA to match the expected type.
    { id: 'con1', categoria: CategoriaContato.EMERGENCIA, nome: 'Polícia Militar', telefone: '190', icon: 'local_police' },
    // FIX: Changed string literal to enum member CategoriaContato.EMERGENCIA to match the expected type.
    { id: 'con2', categoria: CategoriaContato.EMERGENCIA, nome: 'SAMU', telefone: '192', icon: 'emergency' },
    // FIX: Changed string literal to enum member CategoriaContato.SAUDE to match the expected type.
    { id: 'con3', categoria: CategoriaContato.SAUDE, nome: 'Hospital de Baturité', telefone: '(85) 3347-0354', icon: 'local_hospital' },
];

const MOCK_SERVICOS: ServicoOnline[] = [
    // FIX: Changed string literal to enum member CategoriaServicoOnline.ASSISTENCIA to match the expected type.
    { id: 'serv1', categoria: CategoriaServicoOnline.ASSISTENCIA, nome: 'Cadastro Único (CadÚnico)', descricao: 'Agende seu atendimento para inscrição ou atualização.', icon: 'people', requiresAuth: true },
    // FIX: Changed string literal to enum member CategoriaServicoOnline.TRIBUTOS to match the expected type.
    { id: 'serv2', categoria: CategoriaServicoOnline.TRIBUTOS, nome: 'Emissão de 2ª via de IPTU', descricao: 'Gere o boleto do seu imposto de forma online.', icon: 'receipt', requiresAuth: true },
];

const MOCK_PROTOCOLOS: Protocolo[] = [
    { id: 'prot1', protocolo: '20231027001', userId: 'user-1-uid', tipo: TipoProtocolo.RECLAMACAO, categoria: CategoriaReclamacao.BURACO_VIA, descricao: 'Buraco grande na Rua 15 de Novembro, próximo ao número 1020.', bairro: BAIRROS_BATURITE[1], status: StatusProtocolo.EM_ANDAMENTO, dataAbertura: '2023-10-27T14:00:00Z', dataAtualizacao: '2023-10-28T10:00:00Z', historico: [{ status: StatusProtocolo.RECEBIDO, data: '2023-10-27T14:00:00Z' }, { status: StatusProtocolo.EM_ANDAMENTO, data: '2023-10-28T10:00:00Z', observacao: 'Encaminhado para a Secretaria de Obras.' }] },
    { id: 'prot2', protocolo: '20231026005', userId: 'user-1-uid', tipo: TipoProtocolo.SUGESTAO, descricao: 'Instalar mais lixeiras na Praça da Matriz.', bairro: BAIRROS_BATURITE[0], status: StatusProtocolo.RESOLVIDO, dataAbertura: '2023-10-26T11:00:00Z', dataAtualizacao: '2023-10-29T16:00:00Z', historico: [{ status: StatusProtocolo.RECEBIDO, data: '2023-10-26T11:00:00Z' }, { status: StatusProtocolo.RESOLVIDO, data: '2023-10-29T16:00:00Z', observacao: 'Sugestão acatada. Novas lixeiras serão instaladas.' }] },
];

const MOCK_AGENDAMENTOS: Agendamento[] = [
    { id: 'ag1', userId: 'user-1-uid', servicoId: 'serv1', servicoNome: 'Cadastro Único (CadÚnico)', servicoIcon: 'people', dataHora: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: AgendamentoStatus.AGENDADO, lembreteAtivo: true },
    { id: 'ag2', userId: 'user-1-uid', servicoId: 'serv1', servicoNome: 'Atendimento Social', servicoIcon: 'people', dataHora: '2023-10-20T10:00:00Z', status: AgendamentoStatus.REALIZADO, lembreteAtivo: false },
];

const MOCK_NOTIFICACOES: Notificacao[] = [
    { id: 'not1', userId: 'user-1-uid', titulo: 'Protocolo Atualizado', mensagem: 'Seu protocolo 20231027001 teve o status alterado para "Em Andamento".', data: '2023-10-28T10:00:00Z', lida: false, link: { view: 'PROTOCOLO_DETAIL', params: { protocoloId: 'prot1' } } },
    { id: 'not2', userId: 'user-1-uid', titulo: 'Lembrete de Agendamento', mensagem: 'Não se esqueça do seu atendimento do CadÚnico amanhã!', data: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), lida: true },
];

const MOCK_PUBLICACOES: Publicacao[] = [
    { id: 'pub1', tipo: TipoPublicacao.IDEIA, title: 'Ciclofaixa na Avenida Principal', resumo: 'Sugestão para criar uma ciclofaixa na principal avenida da cidade, conectando o centro aos bairros mais afastados.', descricao: 'Detalhes da ideia...', bairro: BAIRROS_BATURITE[0], author: { uid: MOCK_USER_PROFILES[0].uid, name: MOCK_USER_PROFILES[0].name, avatar: MOCK_USER_PROFILES[0].avatar, isAnonymous: false }, counts: { supports: 42, comments: 5 }, status: StatusPublicacao.EM_ANALISE, createdAt: '2023-10-20T09:00:00Z', updatedAt: '2023-10-22T11:00:00Z', comments: [], historico: [] },
];

const MOCK_CONSULTAS: ConsultaPublica[] = [
    { id: 'cons1', title: 'Novo Plano Diretor de Baturité', summary: 'Participe da discussão sobre o futuro do desenvolvimento urbano da nossa cidade.', description: 'Detalhes...', imageUrl: 'https://images.unsplash.com/photo-1549492423-400259a3e580?auto=format&fit=crop&q=80&w=1170', status: StatusConsultaPublica.ABERTA, startDate: '2023-10-15T00:00:00Z', endDate: '2023-11-15T23:59:59Z', opinioes: [], documentos: [{ nome: 'Minuta do Plano Diretor.pdf', url: '#', icon: 'picture_as_pdf'}] },
];

// Generic hook factory
const useMockDataHook = <T,>(data: T) => {
    const [mockData, setMockData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setMockData(data);
            setLoading(false);
        }, 500 + Math.random() * 800);
        return () => clearTimeout(timer);
    }, []);
    return { data: mockData, loading };
};

// Generic hook factory for finding by ID
const useMockDataByIdHook = <T extends { id: string }>(data: T[], id: string | null) => {
    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            if (id) {
                setItem(data.find(d => d.id === id) || null);
            } else {
                setItem(null);
            }
            setLoading(false);
        }, 300 + Math.random() * 500);
        return () => clearTimeout(timer);
    }, [id]);
    return { data: item, loading };
};

// Export all hooks
export const useNoticias = () => useMockDataHook(MOCK_NOTICIAS);
export const useNoticiaById = (id: string | null) => useMockDataByIdHook(MOCK_NOTICIAS, id);
export const useSecretarias = () => useMockDataHook(MOCK_SECRETARIAS);
export const usePrediosPublicos = () => useMockDataHook(MOCK_PREDIOS);
export const useTurismoItens = () => useMockDataHook(MOCK_TURISMO);
export const useTurismoItemById = (id: string | null) => useMockDataByIdHook(MOCK_TURISMO, id);
export const useContatosUteis = () => useMockDataHook(MOCK_CONTATOS);
export const useServicosOnline = () => useMockDataHook(MOCK_SERVICOS);
export const useServicoOnlineById = (id: string | null) => useMockDataByIdHook(MOCK_SERVICOS, id);
export const useProtocolos = () => useMockDataHook(MOCK_PROTOCOLOS);
export const useProtocoloById = (id: string | null) => useMockDataByIdHook(MOCK_PROTOCOLOS, id);
export const useAgendamentos = () => useMockDataHook(MOCK_AGENDAMENTOS);
export const useNotificacoes = () => useMockDataHook(MOCK_NOTIFICACOES);
export const usePublicacoes = () => useMockDataHook(MOCK_PUBLICACOES);
export const usePublicacaoById = (id: string | null) => useMockDataByIdHook(MOCK_PUBLICACOES, id);
export const useConsultasPublicas = () => useMockDataHook(MOCK_CONSULTAS);
export const useConsultaPublicaById = (id: string | null) => useMockDataByIdHook(MOCK_CONSULTAS, id);