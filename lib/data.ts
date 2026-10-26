// Contenido de la demo de "La Plancha 70".
// Todos los datos (dirección, teléfonos, precios, reseñas) son ficticios y deben confirmarse antes de publicar.

export type Category = "hamburguesas" | "acompanamientos" | "bebidas" | "postres";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "hamburguesas", label: "Hamburguesas" },
  { id: "acompanamientos", label: "Acompañamientos" },
  { id: "bebidas", label: "Bebidas" },
  { id: "postres", label: "Postres" },
];

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: Category;
  image?: string;
  tag?: string;
};

export const MENU: MenuItem[] = [
  {
    id: "la-clasica",
    name: "La Clásica",
    desc: "150 g de res, cheddar, lechuga, tomate, cebolla roja y salsa de la casa en pan brioche.",
    price: 21900,
    category: "hamburguesas",
    image: "/images/burger-la-clasica.jpg",
  },
  {
    id: "doble-70",
    name: "La Doble 70",
    desc: "Dos smash de 110 g, doble cheddar, pepinillos, cebolla a la plancha y Salsa 70.",
    price: 28900,
    category: "hamburguesas",
    image: "/images/hero-burger-estrella-smash-doble.jpg",
    tag: "La estrella",
  },
  {
    id: "la-paisa",
    name: "La Paisa",
    desc: "Res, chicharrón crocante, hogao, queso costeño asado y una lámina de maduro.",
    price: 27500,
    category: "hamburguesas",
    image: "/images/burger-campesina.jpg",
    tag: "De aquí",
  },
  {
    id: "tocineta-bbq",
    name: "Tocineta BBQ",
    desc: "Res, tocineta ahumada, cheddar, aros de cebolla y BBQ de panela hecha en casa.",
    price: 26900,
    category: "hamburguesas",
    image: "/images/burger-tocineta-bbq.jpg",
  },
  {
    id: "la-bestia",
    name: "La Bestia",
    desc: "Triple carne, pastrami, tocineta, doble cheddar y jalapeños. Se come con las dos manos.",
    price: 36900,
    category: "hamburguesas",
    image: "/images/burger-la-bestia-pastrami.jpg",
    tag: "Picante",
  },
  {
    id: "mostaza-miel",
    name: "Mostaza y Miel",
    desc: "Doble res, gouda fundido, pepinillos y mostaza dulce de miel de abejas.",
    price: 25500,
    category: "hamburguesas",
    image: "/images/burger-doble-queso.jpg",
  },
  {
    id: "dulce-cebolla",
    name: "Dulce Cebolla",
    desc: "Doble res, cebolla caramelizada a fuego lento durante cuatro horas, suizo y alioli.",
    price: 27900,
    category: "hamburguesas",
    image: "/images/burger-cebolla-caramelizada.jpg",
  },
  {
    id: "pollo-crispy",
    name: "Pollo Crispy",
    desc: "Pechuga apanada en suero, ensalada de repollo y alioli de limón mandarino.",
    price: 23900,
    category: "hamburguesas",
    image: "/images/burger-pollo-crispy.jpg",
  },
  {
    id: "madrugadora",
    name: "La Madrugadora",
    desc: "Res, huevo frito de yema blanda, tocineta, cheddar y tomate. Para el guayabo.",
    price: 26500,
    category: "hamburguesas",
    image: "/images/burger-huevo-tocineta.jpg",
    tag: "Nueva",
  },
  {
    id: "papas-mano",
    name: "Papas a mano",
    desc: "Papa pastusa cortada cada mañana, doble fritura y sal marina.",
    price: 8900,
    category: "acompanamientos",
    image: "/images/papas-clasicas-canasta.jpg",
  },
  {
    id: "papas-parmesano",
    name: "Papas parmesano",
    desc: "Nuestras papas con parmesano rallado, perejil y un toque de aceite de trufa.",
    price: 13900,
    category: "acompanamientos",
    image: "/images/papas-parmesano-trufa.jpg",
  },
  {
    id: "papas-ajo",
    name: "Papas con ajo",
    desc: "Papas a mano con salsa de ajo asado para untar sin vergüenza.",
    price: 11500,
    category: "acompanamientos",
    image: "/images/papas-con-salsa-ajo.jpg",
  },
  {
    id: "papas-familiares",
    name: "Papas familiares",
    desc: "Bandeja para cuatro con tres salsas: Salsa 70, BBQ de panela y ajo asado.",
    price: 18900,
    category: "acompanamientos",
    image: "/images/papas-familiares-bandeja.jpg",
  },
  {
    id: "croquetas",
    name: "Croquetas de papa",
    desc: "Diez bolitas de papa rellenas de queso doble crema, crocantes por fuera.",
    price: 10900,
    category: "acompanamientos",
    image: "/images/papas-croquetas.jpg",
  },
  {
    id: "tiras-pollo",
    name: "Tiras de pollo",
    desc: "Seis tiras de pechuga apanada con miel mostaza para mojar.",
    price: 15900,
    category: "acompanamientos",
    image: "/images/pollo-tiras-crispy.jpg",
  },
  {
    id: "malteada-oreo",
    name: "Malteada Oreo",
    desc: "Helado de vainilla, galleta triturada y crema batida. Espesa, como debe ser.",
    price: 15900,
    category: "bebidas",
    image: "/images/malteada-oreo.jpg",
  },
  {
    id: "malteada-fresa",
    name: "Malteada de fresa",
    desc: "Fresas frescas de Guarne, helado de vainilla y leche entera.",
    price: 14900,
    category: "bebidas",
    image: "/images/malteada-fresa.jpg",
  },
  {
    id: "malteada-monstruo",
    name: "Malteada Monstruo",
    desc: "Chocolate, arequipe, brownie encima y salsa chorreando por el vaso.",
    price: 19900,
    category: "bebidas",
    image: "/images/malteada-monstruo.jpg",
    tag: "Para compartir",
  },
  {
    id: "limonada-coco",
    name: "Limonada de coco",
    desc: "Limón Tahití, crema de coco y hielo frappé. 450 ml.",
    price: 9900,
    category: "bebidas",
    image: "/images/bebida-limonada-de-coco.jpg",
  },
  {
    id: "gaseosa",
    name: "Gaseosa",
    desc: "Botella de 400 ml. Cola, naranja, uva o manzana.",
    price: 5500,
    category: "bebidas",
    image: "/images/bebida-gaseosa.jpg",
  },
  {
    id: "brownie-vaso",
    name: "Brownie en vaso",
    desc: "Brownie tibio, helado de vainilla, arequipe y galleta en capas.",
    price: 12900,
    category: "postres",
    image: "/images/postre-brownie-en-vaso.jpg",
  },
  {
    id: "donas",
    name: "Donas glaseadas",
    desc: "Tres donas del día con glaseado de chocolate y grageas de colores.",
    price: 11900,
    category: "postres",
    image: "/images/postre-donas.jpg",
  },
  {
    id: "sundae-arequipe",
    name: "Sundae de arequipe",
    desc: "Helado de vainilla, arequipe caliente y maní tostado.",
    price: 9900,
    category: "postres",
    image: "/images/postre-sundae-arequipe.jpg",
  },
  {
    id: "cono-doble",
    name: "Cono doble",
    desc: "Dos bolas a elección (vainilla, chocolate o arequipe) en cono de galleta.",
    price: 7900,
    category: "postres",
    image: "/images/postre-cono-doble.jpg",
  },
];

export type Combo = {
  id: string;
  name: string;
  line: string;
  includes: string[];
  price: number;
  before?: number;
  image: string;
  when?: string;
};

export const COMBOS: Combo[] = [
  {
    id: "combo-pareja",
    name: "Combo Pareja",
    line: "Dos que se entienden",
    includes: ["2 La Clásica", "Papas a mano", "2 limonadas de coco"],
    price: 49900,
    before: 72500,
    image: "/images/combo-pareja-papas-burger.jpg",
  },
  {
    id: "combo-mesa-llena",
    name: "La Mesa Llena",
    line: "Para la familia entera",
    includes: ["4 La Clásica o Pollo Crispy", "2 papas familiares", "4 gaseosas", "1 brownie en vaso"],
    price: 109900,
    before: 160300,
    image: "/images/combo-familiar-mesa.jpg",
  },
  {
    id: "combo-mini",
    name: "Mini 70",
    line: "Para los de 12 y menos",
    includes: ["Mini burger de 90 g", "Papas pequeñas", "Malteada mini", "Calcomanía de regalo"],
    price: 22900,
    image: "/images/combo-mini-burgers-kids.jpg",
  },
  {
    id: "martes-doble",
    name: "Martes de Doble",
    line: "2×1 en La Doble 70",
    includes: ["2 La Doble 70", "Solo martes, todo el día", "En el local y a domicilio"],
    price: 28900,
    before: 57800,
    image: "/images/combo-burger-papas.jpg",
    when: "Solo martes",
  },
];

export type Review = {
  name: string;
  where: string;
  text: string;
  stars: number;
};

export const REVIEWS: Review[] = [
  { name: "Juan Pablo M.", where: "Estadio", text: "La Doble 70 es otra cosa. El borde de la carne queda crocante, como en las fotos.", stars: 5 },
  { name: "Mariana G.", where: "Belén", text: "Pedí a domicilio un viernes a las 9 y llegó en 28 minutos, las papas todavía crujían.", stars: 5 },
  { name: "Andrés F.", where: "Laureles", text: "La Paisa con chicharrón no debería funcionar y funciona demasiado bien.", stars: 5 },
  { name: "Sara L.", where: "Envigado", text: "La malteada Monstruo es para dos. Yo no la compartí.", stars: 5 },
  { name: "Camilo R.", where: "La América", text: "Buen precio para lo que es. El combo Pareja nos salvó la cita.", stars: 4 },
  { name: "Daniela P.", where: "Conquistadores", text: "Fuimos con los niños, el Mini 70 trae calcomanía y ya quieren volver.", stars: 5 },
  { name: "Felipe O.", where: "Robledo", text: "Atienden rápido aunque esté lleno. El alioli de limón es adictivo.", stars: 5 },
  { name: "Luisa C.", where: "Floresta", text: "Las papas parmesano valen el viaje solas. Pidan extra salsa de ajo.", stars: 4 },
  { name: "Tomás V.", where: "Simón Bolívar", text: "Martes de Doble es la mejor tradición de la semana en la oficina.", stars: 5 },
  { name: "Isabela H.", where: "Calasanz", text: "Pan brioche suave, carne jugosa y nada se desarma. Diez de diez.", stars: 5 },
];

export const LETTER = {
  opening: "Llegamos con tres niños con hambre y salimos con tres fans.",
  body: [
    "Era sábado, el local estaba lleno y aun así en doce minutos teníamos todo en la mesa. Mi hijo menor pidió el Mini 70 y se pasó la tarde mostrándole la calcomanía a todo el mundo.",
    "Yo me pedí La Doble 70 pensando que era mucho. No era mucho. Las papas a mano saben a papa de verdad, y la malteada de fresa tiene fruta, se nota.",
    "Ya es nuestro plan fijo de fin de mes. Gracias por tratar a los niños como clientes importantes.",
  ],
  name: "Valentina Restrepo",
  role: "Mamá de tres, clienta desde 2022",
};

export const INFO = {
  name: "La Plancha 70",
  street: "Cra. 70 #44-21",
  area: "Laureles, Medellín",
  // Número de WhatsApp con indicativo, sin "+" ni espacios.
  whatsapp: "573008564773",
  mapsQuery: "Carrera 70 #44-21, Laureles, Medellín, Antioquia",
  since: 2016,
};

// Mensaje prellenado de los botones generales de WhatsApp y de la franja de demo.
export const DEMO_MESSAGE = "Hola David, vi tu demo del restaurante y me interesa una web así para mi negocio.";
// Primera línea del mensaje que arma el carrito.
export const CART_INTRO = "Hola David, probé el carrito de tu demo del restaurante:";

export function whatsappLink(message: string) {
  return `https://wa.me/${INFO.whatsapp}?text=${encodeURIComponent(message)}`;
}

export type Hours = { label: string; days: number[]; open: string; close: string };

// 0 = domingo. Los festivos se atienden en horario de domingo.
export const HOURS: Hours[] = [
  { label: "Lunes a jueves", days: [1, 2, 3, 4], open: "12:00", close: "22:00" },
  { label: "Viernes y sábado", days: [5, 6], open: "12:00", close: "23:30" },
  { label: "Domingo y festivos", days: [0], open: "12:00", close: "21:00" },
];

export const STATS = [
  { value: 100, suffix: "%", decimals: 0, title: "Carne fresca", text: "Res molida cada mañana a las 6:00 a. m. En nuestra cocina no hay congelador de carne." },
  { value: 12, suffix: " min", decimals: 0, title: "Hasta tu mesa", text: "Tiempo promedio entre tu pedido en caja y el primer mordisco." },
  { value: 35, suffix: " min", decimals: 0, title: "A tu puerta", text: "Domicilio promedio en Laureles, Estadio, Conquistadores y La 70." },
  { value: 4.8, suffix: "", decimals: 1, title: "Calificación", text: "Calificación de ejemplo para la demo." },
];

export function formatCOP(n: number) {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatHour(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (h === 12 && m === 0) return "12:00 m.";
  const suffix = h >= 12 ? "p. m." : "a. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export type Orderable = { id: string; name: string; price: number };

export const ORDERABLES: Record<string, Orderable> = Object.fromEntries([
  ...MENU.map((m) => [m.id, { id: m.id, name: m.name, price: m.price }] as const),
  ...COMBOS.map((c) => [c.id, { id: c.id, name: c.name, price: c.price }] as const),
]);
