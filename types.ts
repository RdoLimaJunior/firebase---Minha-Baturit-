export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export type View = 
  | 'DASHBOARD'
  | 'PROTOCOLOS_LIST'
  | 'PROTOCOLO_DETAIL'
  | 'PROTOCOLO_FORM'
  | 'NOTICIAS_LIST'
  | 'NOTICIA_DETAIL'
  | 'SECRETARIAS_LIST'
  | 'MAPA_SERVICOS'
  | 'TURISMO_DASHBOARD'
  | 'TURISMO_LIST'
  | 'TURISMO_DETAIL'
  | 'CONTATOS_LIST'
  | 'SERVICOS_ONLINE_DASHBOARD'
  | 'SERVICO_FORM'
  | 'AGENDAMENTOS_LIST'
  | 'NOTIFICACOES_LIST'
  | 'SERVICOS_DASHBOARD'
  | 'MAIS_DASHBOARD'
  | 'SEARCH'
  | 'ACESSIBILIDADE'
  | 'PARTICIPACAO_FEED'
  | 'PARTICIPACAO_DETAIL'
  | 'PARTICIPACAO_FORM'
  | 'CONSULTAS_PUBLICAS_LIST'
  | 'CONSULTAS_PUBLICAS_DETAIL'
  | 'PREDIOS_POR_CATEGORIA_LIST';

export enum TipoProtocolo {
  RECLAMACAO = 'Reclamação',
  SUGESTAO = 'Sugestão',
  DENUNCIA = 'Denúncia',
  ELOGIO = 'Elogio',
}

export enum CategoriaReclamacao {
  ILUMINACAO = 'Iluminação Pública',
  BURACO_VIA = 'Buraco na Via',
  LIXO = 'Coleta de Lixo',
  OBRAS = 'Obras e Reparos',
  SANEAMENTO = 'Saneamento Básico',
  OUTRO = 'Outro',
}

export enum StatusProtocolo {
  RECEBIDO = 'Recebido',
  EM_ANDAMENTO = 'Em Andamento',
  RESOLVIDO = 'Resolvido',
  REJEITADO = 'Rejeitado',
}

export interface HistoricoProtocolo {
  status: StatusProtocolo;
  data: string; // ISO string date
  observacao?: string;
}

export interface Protocolo {
  id: string;
  protocolo: string;
  userId: string;
  tipo: TipoProtocolo;
  categoria?: CategoriaReclamacao;
  descricao: string;
  localizacao?: {
    lat: number;
    lng: number;
  };
  fotos?: string[]; // URLs from Storage
  status: StatusProtocolo;
  dataAbertura: string; // ISO string date
  dataAtualizacao: string; // ISO string date
  bairro: string;
  historico: HistoricoProtocolo[];
}

export interface UserProfile {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    email: string | null;
}

export interface Comment {
  id: string;
  author: {
    uid: string;
    name: string;
    avatar: string;
  };
  text: string;
  date: string; // ISO string date
}

export interface Noticia {
  id: string;
  title: string;
  summary: string;
  date: string; // ISO string date
  imageUrl: string;
  link: string;
  likes: number;
  comments: Comment[];
}

export interface Secretaria {
  id: string;
  nome: string;
  secretario: string;
  cargo: string;
  avatarUrl: string;
  endereco: string;
  telefone: string;
  email: string;
  horario: string;
  link?: string;
}

export type CategoriaPredioPublico = 'Saúde' | 'Educação' | 'Assistência Social' | 'Administração';

export interface Profissional {
  nome: string;
  cargo: string;
  cargaHoraria: string;
}

export interface PredioPublico {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  telefone: string;
  email?: string;
  categoria: CategoriaPredioPublico;
  horario: string;
  servicos: string[];
  localizacao: {
    latitude: number;
    longitude: number;
  };
  isOpenNow: boolean;
  busyness?: string;
  imagens?: string[];
  profissionais?: Profissional[];
}

export type TurismoCategoria = 'Gastronomia' | 'Lazer e Entretenimento' | 'Hospedagem' | 'Pontos Turísticos' | 'Cultura';

export interface TurismoItem {
  id: string;
  categoria: TurismoCategoria;
  nome: string;
  descricao: string;
  descricaoCurta: string;
  endereco: string;
  contato?: string;
  site?: string;
  localizacao: {
    latitude: number;
    longitude: number;
  };
  imagens: string[];
}

export type ActionType = 'NAVIGATE' | 'OPEN_URL' | 'CALL';

export interface ActionPayload {
    view?: View;
    params?: any;
    url?: string;
    phoneNumber?: string;
}

export interface ChatAction {
    type: ActionType;
    buttonText: string;
    payload: ActionPayload;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
  structuredContent?: {
      address?: string;
      phone?: string;
      openingHours?: string;
      documents?: string[];
  };
  feedback?: 'like' | 'dislike' | null;
}

export enum CategoriaContato {
  EMERGENCIA = 'Emergência',
  SERVICOS = 'Serviços Municipais',
  SAUDE = 'Saúde',
  OUTROS = 'Outros',
}

export interface ContatoUtil {
  id: string;
  categoria: CategoriaContato;
  nome: string;
  telefone: string;
  icon: string; // Material Icon name
}

export enum CategoriaServicoOnline {
  ASSISTENCIA = 'Assistência Social',
  TRIBUTOS = 'Tributos e Finanças',
  EDUCACAO = 'Educação',
  SAUDE = 'Saúde',
  OUTROS = 'Outros Serviços',
}

export interface ServicoOnline {
  id: string;
  categoria: CategoriaServicoOnline;
  nome: string;
  descricao: string;
  icon: string; // Material Icon name
  requiresAuth: boolean;
}

export enum AgendamentoStatus {
  AGENDADO = 'Agendado',
  CANCELADO = 'Cancelado',
  REALIZADO = 'Realizado',
}

export interface Agendamento {
  id: string;
  userId: string;
  servicoId: string;
  servicoNome: string;
  servicoIcon: string;
  dataHora: string; // ISO string date
  status: AgendamentoStatus;
  lembreteAtivo: boolean;
}

export interface Notificacao {
  id: string;
  userId: string;
  titulo: string;
  mensagem: string;
  data: string; // ISO string date
  lida: boolean;
  link?: {
    view: View;
    params?: any;
  };
}

// --- Tipos para Participação Pública ---

export enum TipoPublicacao {
  IDEIA = 'Ideia',
  PROBLEMA = 'Problema',
  ELOGIO = 'Elogio',
  EVENTO = 'Evento',
}

export enum StatusPublicacao {
  ABERTO = 'Aberto',
  EM_ANALISE = 'Em análise',
  ENCAMINHADO = 'Encaminhado',
  CONCLUIDO = 'Concluído',
  REJEITADO = 'Rejeitado',
}

export interface ComentarioPublicacao {
  id: string;
  author: {
    uid: string;
    name: string;
    avatar: string;
  };
  text: string;
  date: string; // ISO string date
  isOfficialReply: boolean;
}

export interface HistoricoPublicacao {
  status: StatusPublicacao;
  data: string; // ISO string date
  observacao?: string;
  responsavel?: string;
}


export interface Publicacao {
  id: string;
  tipo: TipoPublicacao;
  title: string;
  resumo: string;
  descricao: string;
  bairro: string;
  tags?: string[];
  fotos?: string[]; // URLs from Storage
  localizacao?: { lat: number; lng: number };
  author: {
    uid: string;
    name: string;
    avatar: string;
    isAnonymous: boolean;
  };
  counts: {
    supports: number;
    comments: number;
  };
  status: StatusPublicacao;
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
  // Comments and history might be subcollections in Firestore
  comments?: ComentarioPublicacao[];
  historico?: HistoricoPublicacao[];
}

// --- Tipos para Consultas Públicas ---

export enum StatusConsultaPublica {
  ABERTA = 'Aberta',
  ENCERRADA = 'Encerrada',
  EM_ANALISE = 'Resultados em Análise',
}

export interface OpiniaoConsulta {
  id: string;
  author: {
    uid:string;
    name: string;
    avatar: string;
  };
  text: string;
  date: string; // ISO string date
  supports: number;
}

export interface DocumentoConsulta {
  nome: string;
  url: string;
  icon: string; // Material Icon name
}

export interface ConsultaPublica {
  id: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  status: StatusConsultaPublica;
  startDate: string; // ISO string date
  endDate: string; // ISO string date
  documentos?: DocumentoConsulta[];
  // Opinions would be a subcollection in Firestore
  opinioes?: OpiniaoConsulta[];
}