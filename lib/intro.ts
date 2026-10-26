// Coordina la pantalla de carga con la entrada del hero.
let done = false;
const subscribers = new Set<() => void>();

export function onIntroDone(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function markIntroDone() {
  if (done) return;
  done = true;
  subscribers.forEach((cb) => cb());
  subscribers.clear();
}
