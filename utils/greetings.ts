import { WeatherData } from '../hooks/useWeather';

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Time-based greetings
const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
};

// General suggestions
const generalSuggestions = [
    "Que tal explorar os serviços online hoje? Agende atendimentos ou consulte informações.",
    "Você sabia que pode abrir um protocolo para sugerir melhorias no seu bairro?",
    "Fique por dentro das últimas notícias de Baturité na nossa seção de notícias.",
    "Planejando o fim de semana? Dê uma olhada nas nossas dicas de turismo!",
    "Precisa de um telefone útil? A lista de contatos da cidade está a um clique de distância.",
    "Explore o mapa de serviços para encontrar unidades de saúde, escolas e mais.",
    "Tem uma ideia para a cidade? Use a seção de Participação Pública para compartilhar."
];

// Weather-based suggestions
const getWeatherBasedSuggestion = (weather: WeatherData | null): string | null => {
    if (!weather) return null;

    const code = parseInt(weather.weatherCode, 10);
    const temp = weather.temperature;

    // Sunny and warm/hot
    if ([113].includes(code) && temp > 25) {
        return getRandomItem([
            "hoje o dia está perfeito para um passeio ao ar livre! Que tal conhecer os pontos turísticos da serra?",
            "um belo dia de sol! Ideal para visitar a cachoeira ou um dos nossos parques.",
            "com este tempo, um sorvete na praça central seria uma ótima pedida.",
        ]);
    }
    // Cloudy/mild
    if ([116, 119, 122].includes(code)) {
        return getRandomItem([
            "o tempo está agradável para uma caminhada. Explore o centro histórico de Baturité.",
            "que tal aproveitar o dia ameno para conhecer um dos cafés charmosos da nossa cidade?",
        ]);
    }
    // Rainy
    if (code >= 263) { // Any form of rain
        return getRandomItem([
            "dia de chuva é perfeito para explorar a cultura local. Já visitou nossos museus e espaços culturais?",
            "a chuva chegou! Que tal aproveitar para colocar em dia os serviços online da prefeitura no conforto de casa?",
            "com a chuva, a serra fica ainda mais verde e cheirosa. Um ótimo dia para apreciar a paisagem de um local coberto.",
        ]);
    }

    return null;
};

export const generateDynamicGreeting = (userName: string, weather: WeatherData | null): { title: string; subtitle: string } => {
    const timeGreeting = getTimeBasedGreeting();
    const title = `${timeGreeting}, ${userName}!`;

    const weatherSuggestion = getWeatherBasedSuggestion(weather);
    if (weatherSuggestion && Math.random() > 0.4) { // 60% chance of using weather suggestion if available
        return { title, subtitle: weatherSuggestion };
    }

    const randomGeneralSuggestion = getRandomItem(generalSuggestions);
    return { title, subtitle: randomGeneralSuggestion };
};
