/** Site-wide data: outbound links, contact details and the fixed images of the start page. */
import type { ImageId } from "./images";

const LIVE = "https://fegado.es";
const INTRANET = "https://intranet.fegado.es";

export const links = {
  events: `${LIVE}/events/`,
  transparency: `${LIVE}/federation/downloads/`,
  cookies: `${LIVE}/cookies/`,
  legal: `${LIVE}/legal/`,
  privacy: `${LIVE}/privacy/`,
  intranet: `${INTRANET}/`,
  channel: "https://groups.google.com/group/fegado",
  live: `${LIVE}/`,
};

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
  president: "Sonia Gómez Naya",
  /** Casa do Deporte de Vigo, from OpenStreetMap. */
  location: { lat: 42.21707, lon: -8.74315 },
};
