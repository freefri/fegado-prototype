/**
 * Start page content taken from the Figma prototype. Events and news move to content collections
 * in the next phase; until then they live here so the page can be built from data.
 */
import type { Lang } from "@/i18n/ui";
import type { ImageId } from "./images";

type Localized = Record<Lang, string>;

export interface HomeEvent {
  title: string;
  date: string;
  club: string;
  discipline: Localized;
  official: boolean;
  poster: ImageId;
  heroImage: ImageId;
  href: string;
  /** Seconds left to the registration deadline when the page opens; see Countdown. */
  registrationSecondsLeft: number;
}

export interface HomeNews {
  /** News is published in whichever language its author wrote it, not translated. */
  lang: Lang;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  categories: string[];
  image: ImageId;
  imagePosition?: string;
  /** Show the image as a centred logo on a tinted card instead of a full-bleed photo. */
  imageIsLogo?: boolean;
  href: string;
}

const LIVE = "https://fegado.es";
const INTRANET = "https://intranet.fegado.es";

export const links = {
  events: `${LIVE}/events/`,
  news: `${LIVE}/news/`,
  clubs: `${LIVE}/clubs/`,
  transparency: `${LIVE}/federation/downloads/`,
  contact: `${LIVE}/contact/`,
  cookies: `${LIVE}/cookies/`,
  legal: `${LIVE}/legal/`,
  privacy: `${LIVE}/privacy/`,
  intranet: `${INTRANET}/`,
  register: `${INTRANET}/users/register/`,
  channel: "https://groups.google.com/group/fegado",
  live: `${LIVE}/`,
};

const escolar: Localized = { gl: "Escolar e Universitario", es: "Escolar y Universitario" };
const oPe: Localized = { gl: "O-Pé", es: "O-Pie" };

export const events: HomeEvent[] = [
  {
    title: "1ª Proba da Liga Galega de O-PÉ nos Parques de TRECE ROSAS - AS GALERAS",
    date: "2026-05-09",
    club: "Sociedad de Montaña Ártabros",
    discipline: oPe,
    official: true,
    poster: "eventoTreceRosas",
    heroImage: "heroTreceRosas",
    href: links.events,
    registrationSecondsLeft: 1_295_362,
  },
  {
    title: "2ª LGR - OBJETIVO FENE (Gallaecia Raid)",
    date: "2026-04-18",
    club: "CLUB GALLAECIA RAID",
    discipline: escolar,
    official: true,
    poster: "eventoObjetivoFene",
    heroImage: "heroMtbo",
    href: links.events,
    registrationSecondsLeft: 2_073_600,
  },
  {
    title: "II Liga Escolar de Valdeorras de Orientación | 3ª Jornada",
    date: "2026-04-18",
    club: "OUR-O",
    discipline: escolar,
    official: false,
    poster: "eventoLigaEscolarValdeorras",
    heroImage: "heroOPe",
    href: links.events,
    registrationSecondsLeft: 2_851_200,
  },
];

/** Order of the "Próximos eventos" cards in the design. */
export const upcomingEvents: HomeEvent[] = [events[1], events[2], events[0]];

export const news: HomeNews[] = [
  {
    lang: "gl",
    title: "MATEO RODRÍGUEZ E LUCÍA PARGA PARTICIPARON A PASADA SEMANA NO CAMPIONATO DE ESPAÑA UNIVERSITARIO",
    excerpt: "Entre os pasados 9 e 11 de abril disputouse o Campionato de España Universitario de Orientación a Pé 2026 na localidade almeriense de Tíjola, organizado pola Universidade de Almería.",
    date: "2026-04-17",
    author: "FEGADO",
    categories: ["Resultados"],
    image: "novaCampionatoUniversitario",
    href: links.news,
  },
  {
    lang: "es",
    title: "Gallaecia Raid Objetivo Fene",
    excerpt: "Se publican los Road Book de las categorías 3.0 - 2+1 y categoría Orienta Raid. También se adjunta la información necesaria para las asistencias. Para este raid contaremos con zonas de asistencia.",
    date: "2026-04-16",
    author: "CLUB GALLAECIA RAID",
    categories: ["Eventos", "Raid"],
    image: "eventoObjetivoFene",
    imagePosition: "50% 42%",
    href: links.news,
  },
  {
    lang: "gl",
    title: "PRESELECCIÓN CESA 2026 e ACTIVIDADES DE TECNIFICACIÓN",
    excerpt: "Publicamos unha primeira listaxe de rapaces e rapazas preseleccionados/as que consideramos que teñen a continuidade necesaria e os coñecementos básicos para formar parte da selección.",
    date: "2026-04-16",
    author: "Dirección Técnica FEGADO",
    categories: ["Formación", "Comunicados"],
    image: "logo",
    imageIsLogo: true,
    href: links.news,
  },
];

export const aboutPhotos: ImageId[] = ["coneceMapa", "coneceSeleccion"];

export const sponsors: ImageId[] = [
  "patrocinioXunta",
  "patrocinioDeporteGalego",
  "patrocinioViolenciaNon",
  "patrocinioCsd",
  "patrocinioMujerDeporte",
];

export const contact = {
  address: ["Rúa Fotógrafo Luis Ksado,", "17, Planta 2, Oficina 22", "36209, Vigo - Pontevedra"],
  phone: { label: "696 459 544", href: "tel:+34696459544" },
  email: { label: "info@fegado.es", href: "mailto:info@fegado.es" },
};
