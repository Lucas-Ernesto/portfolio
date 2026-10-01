// Itens de uma faixa que corre. Repete 2x pra animação dar a volta sem emenda.
export const marqueeItems = (items, separator) =>
  items.map((item) => `<span>${item}</span><i>${separator}</i>`).join("").repeat(2);

// speed = segundos pra dar uma volta; reverse = corre pro outro lado
export const MarqueeTrack = ({ className, items, separator, speed, reverse = false }) => `
  <div class="${className} marquee" data-speed="${speed}"${reverse ? " data-reverse" : ""}>${marqueeItems(items, separator)}</div>`;
