import { gsap } from "../utils/motion.js";
import { qsa } from "../utils/dom.js";
import { updateStripView } from "../views/sections/StripView.js";

// Faixas que correm (.marquee): loop infinito que acelera com a velocidade do scroll
export class MarqueeController {
  constructor({ scroll, t, onLangChange, reduceMotion }) {
    this.reduceMotion = reduceMotion;
    this.tweens = [];
    this.build();

    // a faixa de serviços traduz: atualiza a view e recria as animações
    onLangChange(() => {
      updateStripView(t);
      this.build();
    });

    if (reduceMotion) return;
    let boost = 1;
    scroll.onScroll(({ velocity }) => (boost = 1 + Math.min(Math.abs(velocity) * 0.15, 5)));
    gsap.ticker.add(() => {
      boost += (1 - boost) * 0.05; // volta devagar pra velocidade normal
      this.tweens.forEach((tw) => tw.timeScale(boost));
    });
  }

  build() {
    this.tweens.forEach((tw) => tw.kill());
    this.tweens = qsa(".marquee").map((track) => {
      const reverse = "reverse" in track.dataset;
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: Number(track.dataset.speed), ease: "none", repeat: -1 },
      );
      if (this.reduceMotion) tween.pause();
      return tween;
    });
  }
}
