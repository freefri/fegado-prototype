/**
 * Document categories, grouped as in the information architecture of the design (Figura 33 of the
 * thesis). `scripts/import-documents.mjs` maps the category names of fegado.es onto these keys.
 */
import type { Lang } from "@/i18n/ui";

type Label = Record<Lang, string>;

export const documentGroups = {
  organization: { gl: "Organización", es: "Organización" },
  economy: { gl: "Xestión económica", es: "Gestión económica" },
  competition: { gl: "Competición", es: "Competición" },
  clubs: { gl: "Clubs", es: "Clubes" },
  training: { gl: "Formación", es: "Formación" },
  staff: { gl: "Persoal técnico", es: "Personal técnico" },
} as const satisfies Record<string, Label>;

export type DocumentGroup = keyof typeof documentGroups;

export const documentCategories = {
  organigrama: { group: "organization", gl: "Organigrama", es: "Organigrama" },
  actas: { group: "organization", gl: "Actas", es: "Actas" },
  normativa: { group: "organization", gl: "Normativa", es: "Normativa" },
  estatutos: { group: "organization", gl: "Estatutos e normas autonómicas", es: "Estatutos y normas autonómicas" },
  "eleccions-2026": { group: "organization", gl: "Eleccións 2026", es: "Elecciones 2026" },
  "procesos-electorais": { group: "organization", gl: "Procesos electorais", es: "Procesos electorales" },
  convenios: { group: "organization", gl: "Convenios", es: "Convenios" },
  memoria: { group: "organization", gl: "Memoria de actividades", es: "Memoria de actividades" },
  "proxecto-deportivo": { group: "organization", gl: "Proxecto deportivo", es: "Proyecto deportivo" },
  colaboradores: { group: "organization", gl: "Colaboradores", es: "Colaboradores" },
  "proteccion-datos": { group: "organization", gl: "Protección de datos", es: "Protección de datos" },
  "covid-19": { group: "organization", gl: "Covid-19", es: "Covid-19" },
  outros: { group: "organization", gl: "Outros", es: "Otros" },
  contabilidade: { group: "economy", gl: "Contabilidade", es: "Contabilidad" },
  auditoria: { group: "economy", gl: "Auditoría", es: "Auditoría" },
  "axudas-dxan": { group: "economy", gl: "Axudas DXAN", es: "Ayudas DXAN" },
  calendarios: { group: "competition", gl: "Calendarios", es: "Calendarios" },
  rankings: { group: "competition", gl: "Rankings", es: "Rankings" },
  seleccions: { group: "competition", gl: "Seleccións galegas", es: "Selecciones gallegas" },
  "alto-nivel": { group: "competition", gl: "Deportistas de alto nivel", es: "Deportistas de alto nivel" },
  uniformidade: { group: "competition", gl: "Uniformidade", es: "Uniformidad" },
  "clubs-orientadores": { group: "clubs", gl: "Clubs e orientadores", es: "Clubes y orientadores" },
  "practica-deportiva": { group: "clubs", gl: "Práctica deportiva", es: "Práctica deportiva" },
  licenzas: { group: "clubs", gl: "Licenzas", es: "Licencias" },
  seguro: { group: "clubs", gl: "Seguro", es: "Seguro" },
  xogade: { group: "clubs", gl: "XOGADE", es: "XOGADE" },
  formacion: { group: "training", gl: "Formación", es: "Formación" },
  "recursos-didacticos": { group: "training", gl: "Recursos didácticos", es: "Recursos didácticos" },
  "xuices-controladores": { group: "staff", gl: "Xuíces controladores", es: "Jueces controladores" },
  "xuices-cronometradores": { group: "staff", gl: "Xuíces cronometradores", es: "Jueces cronometradores" },
  trazadores: { group: "staff", gl: "Trazadores", es: "Trazadores" },
  cartografia: { group: "staff", gl: "Cartografía", es: "Cartografía" },
  // Logos and identity files, shown on the Identidade corporativa page instead of the list.
  identidade: { group: null, gl: "Identidade", es: "Identidad" },
} as const satisfies Record<string, Label & { group: DocumentGroup | null }>;

export type DocumentCategory = keyof typeof documentCategories;
export const documentCategoryKeys = Object.keys(documentCategories) as [DocumentCategory, ...DocumentCategory[]];
