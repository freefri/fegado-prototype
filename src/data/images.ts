/**
 * Every image the site uses, with where it came from and who owns it. Components take images only
 * from here, and `npm run check:images` fails the build when a file in `src/assets/images` or an
 * image in `public/` is missing from this registry, or when an entry is no longer used.
 *
 * Photos, posters and logos belong to FEGADO, the organising club or the sponsor; they are not
 * covered by the CC BY 4.0 licence of the design.
 */
import type { ImageMetadata } from "astro";
import type { Lang } from "@/i18n/ui";

import logo from "@/assets/images/logo.svg";
import heroTreceRosas from "@/assets/images/hero-trece-rosas.jpg";
import heroMtbo from "@/assets/images/hero-mtbo.jpg";
import heroOPe from "@/assets/images/hero-o-pe.jpg";
import eventoObjetivoFene from "@/assets/images/evento-objetivo-fene.jpg";
import eventoLigaEscolarValdeorras from "@/assets/images/evento-liga-escolar-valdeorras.jpg";
import eventoTreceRosas from "@/assets/images/evento-trece-rosas.jpg";
import coneceMapa from "@/assets/images/conece-mapa.jpg";
import coneceSeleccion from "@/assets/images/conece-seleccion.jpg";
import novaCampionatoUniversitario from "@/assets/images/nova-campionato-universitario.jpg";
import patrocinioXunta from "@/assets/images/patrocinio-xunta.png";
import patrocinioDeporteGalego from "@/assets/images/patrocinio-deporte-galego.png";
import patrocinioViolenciaNon from "@/assets/images/patrocinio-violencia-non.png";
import patrocinioCsd from "@/assets/images/patrocinio-csd.png";
import patrocinioMujerDeporte from "@/assets/images/patrocinio-mujer-deporte.png";

const FIGMA_HOME = "Figma, prototipo de Nuria Oujo Míguez, pantalla de inicio (nodo 2015:90104)";
const FEGADO_TEMPLATES = "fegado.es, web/templates/images/";

type Owner = "FEGADO" | "Club organizador" | "Entidad patrocinadora";

interface RegisteredImage {
  src: ImageMetadata;
  origin: string;
  owner: Owner;
  alt: Record<Lang, string>;
}

export const images = {
  logo: {
    src: logo,
    origin: `${FEGADO_TEMPLATES}logos.svg, versión con texto trazado`,
    owner: "FEGADO",
    alt: { gl: "FEGADO · Federación Galega de Orientación", es: "FEGADO · Federación Gallega de Orientación" },
  },
  heroTreceRosas: {
    src: heroTreceRosas,
    origin: FIGMA_HOME,
    owner: "FEGADO",
    alt: { gl: "Selección galega de orientación no monte", es: "Selección gallega de orientación en el monte" },
  },
  heroMtbo: {
    src: heroMtbo,
    origin: FIGMA_HOME,
    owner: "FEGADO",
    alt: { gl: "Ciclista nunha proba de MTB-O", es: "Ciclista en una prueba de MTB-O" },
  },
  heroOPe: {
    src: heroOPe,
    origin: FIGMA_HOME,
    owner: "FEGADO",
    alt: { gl: "Orientador consultando o mapa nunha proba a pé", es: "Orientador consultando el mapa en una prueba a pie" },
  },
  eventoObjetivoFene: {
    src: eventoObjetivoFene,
    origin: FIGMA_HOME,
    owner: "Club organizador",
    alt: { gl: "Cartel da 2ª LGR Objetivo Fene", es: "Cartel de la 2ª LGR Objetivo Fene" },
  },
  eventoLigaEscolarValdeorras: {
    src: eventoLigaEscolarValdeorras,
    origin: FIGMA_HOME,
    owner: "Club organizador",
    alt: { gl: "Cartel da II Liga Escolar de Valdeorras", es: "Cartel de la II Liga Escolar de Valdeorras" },
  },
  eventoTreceRosas: {
    src: eventoTreceRosas,
    origin: FIGMA_HOME,
    owner: "Club organizador",
    alt: { gl: "Cartel da 1ª Proba da Liga Galega de Sprint", es: "Cartel de la 1ª Prueba de la Liga Gallega de Sprint" },
  },
  coneceMapa: {
    src: coneceMapa,
    origin: `${FIGMA_HOME}; recorte vertical da mesma foto que heroOPe`,
    owner: "FEGADO",
    alt: { gl: "Orientador consultando o mapa durante unha proba", es: "Orientador consultando el mapa durante una prueba" },
  },
  coneceSeleccion: {
    src: coneceSeleccion,
    origin: FIGMA_HOME,
    owner: "FEGADO",
    alt: { gl: "Selección galega coa bandeira de Galicia", es: "Selección gallega con la bandera de Galicia" },
  },
  novaCampionatoUniversitario: {
    src: novaCampionatoUniversitario,
    origin: FIGMA_HOME,
    owner: "FEGADO",
    alt: { gl: "Orientador co dorsal 39 lendo o mapa", es: "Orientador con el dorsal 39 leyendo el mapa" },
  },
  patrocinioXunta: {
    src: patrocinioXunta,
    origin: `${FEGADO_TEMPLATES}eusondgan.png, metade superior`,
    owner: "Entidad patrocinadora",
    alt: { gl: "Xunta de Galicia", es: "Xunta de Galicia" },
  },
  patrocinioDeporteGalego: {
    src: patrocinioDeporteGalego,
    origin: `${FEGADO_TEMPLATES}eusondgan.png, metade inferior`,
    owner: "Entidad patrocinadora",
    alt: { gl: "Deporte Galego", es: "Deporte Galego" },
  },
  patrocinioViolenciaNon: {
    src: patrocinioViolenciaNon,
    origin: `${FEGADO_TEMPLATES}violencia-non.png`,
    owner: "Entidad patrocinadora",
    alt: { gl: "Non á violencia de xénero", es: "No a la violencia de género" },
  },
  patrocinioCsd: {
    src: patrocinioCsd,
    origin: `${FEGADO_TEMPLATES}csd.png`,
    owner: "Entidad patrocinadora",
    alt: { gl: "Consejo Superior de Deportes", es: "Consejo Superior de Deportes" },
  },
  patrocinioMujerDeporte: {
    src: patrocinioMujerDeporte,
    origin: `${FEGADO_TEMPLATES}mujer-deporte.png`,
    owner: "Entidad patrocinadora",
    alt: { gl: "Programas Mujer y Deporte", es: "Programas Mujer y Deporte" },
  },
} as const satisfies Record<string, RegisteredImage>;

export type ImageId = keyof typeof images;

/** Files served as they are from `public/`, outside Astro's image pipeline. */
export const publicImages = {
  "favicon.svg": `${FEGADO_TEMPLATES}logos.svg, só o símbolo do mapa nun lenzo cadrado`,
  "favicon-32.png": "Xerado desde favicon.svg",
  "apple-touch-icon.png": "Xerado desde favicon.svg, sobre fondo branco",
} as const;
