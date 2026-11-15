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
import quenSomos from "@/assets/images/quen-somos.jpg";
import quenSomosHistoria from "@/assets/images/quen-somos-historia.jpg";
import quenSomosPodio from "@/assets/images/quen-somos-podio.jpg";
import modalidades from "@/assets/images/modalidades.jpg";
import modalidadeOPe1 from "@/assets/images/modalidade-o-pe-1.jpg";
import modalidadeOPe2 from "@/assets/images/modalidade-o-pe-2.jpg";
import modalidadeSprint1 from "@/assets/images/modalidade-sprint-1.jpg";
import modalidadeSprint2 from "@/assets/images/modalidade-sprint-2.jpg";
import modalidadeMtbo1 from "@/assets/images/modalidade-mtbo-1.jpg";
import modalidadeMtbo2 from "@/assets/images/modalidade-mtbo-2.jpg";
import modalidadeTrailO1 from "@/assets/images/modalidade-trail-o-1.jpg";
import modalidadeTrailO2 from "@/assets/images/modalidade-trail-o-2.jpg";
import modalidadeRogaining1 from "@/assets/images/modalidade-rogaining-1.jpg";
import modalidadeRogaining2 from "@/assets/images/modalidade-rogaining-2.jpg";
import modalidadeRaid1 from "@/assets/images/modalidade-raid-1.jpg";
import modalidadeRaid2 from "@/assets/images/modalidade-raid-2.jpg";
import federate from "@/assets/images/federate.jpg";
import federateLicenza from "@/assets/images/federate-licenza.jpg";
import federateRaid from "@/assets/images/federate-raid.jpg";
import federateCurso from "@/assets/images/federate-curso.jpg";
import xuntaSoniaGomez from "@/assets/images/xunta-sonia-gomez.jpg";
import xuntaClaudiaOreiro from "@/assets/images/xunta-claudia-oreiro.jpg";
import xuntaRobertoAmarelle from "@/assets/images/xunta-roberto-amarelle.jpg";
import xuntaJavierAntonon from "@/assets/images/xunta-javier-antonon.jpg";

const FIGMA_HOME = "Figma, prototipo de Nuria Oujo Míguez, pantalla de inicio (nodo 2015:90104)";
const FIGMA_ABOUT = "Figma, prototipo de Nuria Oujo Míguez, Sobre FEGADO > Quen somos (nodo 2015:90892)";
const FIGMA_DISCIPLINES = "Figma, prototipo de Nuria Oujo Míguez, Sobre FEGADO > Modalidades (nodo 2015:91166)";
const FIGMA_JOIN = "Figma, prototipo de Nuria Oujo Míguez, Sobre FEGADO > Fedérate (nodo 2015:91006)";
const FIGMA_BOARD = "Figma, prototipo de Nuria Oujo Míguez, Transparencia > Xunta Directiva (nodo 2015:91995)";
const FEGADO_TEMPLATES = "fegado.es, web/templates/images/";

type Owner = "FEGADO" | "Club organizador" | "Entidad patrocinadora" | "Persona retratada";

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
  quenSomos: {
    src: quenSomos,
    origin: FIGMA_ABOUT,
    owner: "FEGADO",
    alt: { gl: "Selección galega coa bandeira de Galicia na neve", es: "Selección gallega con la bandera de Galicia en la nieve" },
  },
  quenSomosHistoria: {
    src: quenSomosHistoria,
    origin: FIGMA_ABOUT,
    owner: "FEGADO",
    alt: { gl: "Membros da federación nunha reunión", es: "Miembros de la federación en una reunión" },
  },
  quenSomosPodio: {
    src: quenSomosPodio,
    origin: FIGMA_ABOUT,
    owner: "FEGADO",
    alt: { gl: "Equipo galego no podio dun campionato de España", es: "Equipo gallego en el podio de un campeonato de España" },
  },
  modalidades: {
    src: modalidades,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Saída dunha proba de orientación con moitos corredores", es: "Salida de una prueba de orientación con muchos corredores" },
  },
  modalidadeOPe1: {
    src: modalidadeOPe1,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Corredora de orientación a pé entre toxos", es: "Corredora de orientación a pie entre tojos" },
  },
  modalidadeOPe2: {
    src: modalidadeOPe2,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Corredor cruzando un prado co mapa na man", es: "Corredor cruzando un prado con el mapa en la mano" },
  },
  modalidadeSprint1: {
    src: modalidadeSprint1,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Corredora picando un control nunha rúa", es: "Corredora picando un control en una calle" },
  },
  modalidadeSprint2: {
    src: modalidadeSprint2,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Corredora nunha rúa de pedra durante un sprint", es: "Corredora en una calle de piedra durante un sprint" },
  },
  modalidadeMtbo1: {
    src: modalidadeMtbo1,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Ciclista de MTBO baixando xunto a unha baliza", es: "Ciclista de MTBO bajando junto a una baliza" },
  },
  modalidadeMtbo2: {
    src: modalidadeMtbo2,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Ciclista de MTBO co porta mapas", es: "Ciclista de MTBO con el portamapas" },
  },
  modalidadeTrailO1: {
    src: modalidadeTrailO1,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Participante de Trail-O lendo o mapa", es: "Participante de Trail-O leyendo el mapa" },
  },
  modalidadeTrailO2: {
    src: modalidadeTrailO2,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Xuíces revisando as respostas dunha proba de Trail-O", es: "Jueces revisando las respuestas de una prueba de Trail-O" },
  },
  modalidadeRogaining1: {
    src: modalidadeRogaining1,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Equipos planificando a ruta sobre o mapa", es: "Equipos planificando la ruta sobre el mapa" },
  },
  modalidadeRogaining2: {
    src: modalidadeRogaining2,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Corredores nun camiño de terra durante un rogaine", es: "Corredores en un camino de tierra durante un rogaine" },
  },
  modalidadeRaid1: {
    src: modalidadeRaid1,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Equipos de raid estudando os mapas no chan", es: "Equipos de raid estudiando los mapas en el suelo" },
  },
  modalidadeRaid2: {
    src: modalidadeRaid2,
    origin: FIGMA_DISCIPLINES,
    owner: "FEGADO",
    alt: { gl: "Paso con cordas sobre un río nun raid", es: "Paso con cuerdas sobre un río en un raid" },
  },
  federate: {
    src: federate,
    origin: FIGMA_JOIN,
    owner: "FEGADO",
    alt: { gl: "Dous orientadores buscando unha baliza xunto a un muro", es: "Dos orientadores buscando una baliza junto a un muro" },
  },
  federateLicenza: {
    src: federateLicenza,
    origin: FIGMA_JOIN,
    owner: "FEGADO",
    alt: { gl: "Nenos correndo nunha proba escolar", es: "Niños corriendo en una prueba escolar" },
  },
  federateRaid: {
    src: federateRaid,
    origin: FIGMA_JOIN,
    owner: "FEGADO",
    alt: { gl: "Dous corredores de raid nunha pista", es: "Dos corredores de raid en una pista" },
  },
  federateCurso: {
    src: federateCurso,
    origin: FIGMA_JOIN,
    owner: "FEGADO",
    alt: { gl: "Entrega dun mapa durante unha actividade", es: "Entrega de un mapa durante una actividad" },
  },
  xuntaSoniaGomez: {
    src: xuntaSoniaGomez,
    origin: FIGMA_BOARD,
    owner: "Persona retratada",
    alt: { gl: "Sonia Gómez Naya", es: "Sonia Gómez Naya" },
  },
  xuntaClaudiaOreiro: {
    src: xuntaClaudiaOreiro,
    origin: FIGMA_BOARD,
    owner: "Persona retratada",
    alt: { gl: "Claudia Oreiro Chapela", es: "Claudia Oreiro Chapela" },
  },
  xuntaRobertoAmarelle: {
    src: xuntaRobertoAmarelle,
    origin: FIGMA_BOARD,
    owner: "Persona retratada",
    alt: { gl: "Roberto Amarelle Garabán", es: "Roberto Amarelle Garabán" },
  },
  xuntaJavierAntonon: {
    src: xuntaJavierAntonon,
    origin: FIGMA_BOARD,
    owner: "Persona retratada",
    alt: { gl: "Francisco Javier Antoñón Clemente", es: "Francisco Javier Antoñón Clemente" },
  },
} as const satisfies Record<string, RegisteredImage>;

export type ImageId = keyof typeof images;

/**
 * Club logos, registered as a folder: each file is named after a club in `src/content/clubs.yaml`
 * and belongs to that club. Downloaded from the club list of fegado.es at 400 px.
 */
const clubLogoFiles = import.meta.glob<ImageMetadata>("../assets/images/clubs/*", { eager: true, import: "default" });
export const clubLogos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(clubLogoFiles).map(([path, src]) => [path.slice(path.lastIndexOf("/") + 1), src]),
);

/** Files served as they are from `public/`, outside Astro's image pipeline. */
export const publicImages = {
  "favicon.svg": `${FEGADO_TEMPLATES}logos.svg, só o símbolo do mapa nun lenzo cadrado`,
  "favicon-32.png": "Xerado desde favicon.svg",
  "apple-touch-icon.png": "Xerado desde favicon.svg, sobre fondo branco",
} as const;
