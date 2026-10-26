import Marquee from "./Marquee";
import Burst from "./Burst";

const WORDS_A = ["Hamburguesas smash", "Papas cortadas a mano", "Malteadas espesas", "Domicilios en Laureles", "Martes de Doble 2×1"];
const WORDS_B = ["Carne molida cada mañana", "Pan brioche horneado aquí", "Salsas de la casa", "Abierto todos los días"];

// Dos cintas cruzadas, como cinta de empaque, entre el hero y la carta.
export default function TapeBand() {
  return (
    <div className="relative z-20 -mb-[110px] h-[220px] overflow-hidden lg:-mb-[150px] lg:h-[300px]" aria-label="Lo que hacemos">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-ketchup" aria-hidden="true" />
      <Marquee
        speed={80}
        direction={1}
        className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 -rotate-[3deg] scale-[1.04] bg-mustard text-char"
        trackClassName="pb-3 pt-4 lg:pb-4 lg:pt-6"
      >
        {WORDS_A.map((w) => (
          <span key={w} className="flex items-center gap-6 pr-6 font-display text-[clamp(2rem,4.5vw,4.5rem)] uppercase leading-[1.1]">
            {w}
            <Burst size={34} className="text-ketchup" />
          </span>
        ))}
      </Marquee>
      <Marquee
        speed={60}
        direction={-1}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[2.5deg] scale-[1.04] bg-char text-paper"
        trackClassName="pb-2 pt-3 lg:pb-3 lg:pt-4"
      >
        {WORDS_B.map((w) => (
          <span key={w} className="flex items-center gap-5 pr-5 font-display text-[clamp(1.4rem,2.6vw,2.6rem)] uppercase leading-[1.1]">
            {w}
            <Burst size={24} className="text-mustard" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
