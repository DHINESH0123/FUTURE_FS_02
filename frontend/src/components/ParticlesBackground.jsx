import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export const ParticlesBackground = () => {
  const init = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const options = {
    fpsLimit: 60,
    particles: {
      number: { value: 20 },
      color: { value: ['#14B3D6', '#0D9488', '#A3E635'] },
      opacity: { value: 0.15 },
      size: { value: { min: 1, max: 2 } },
      move: { enable: true, speed: 0.4 },
      links: { enable: false }
    },
    detectRetina: true
  };

  return <Particles id="hero-particles" init={init} options={options} className="absolute inset-0 -z-10" />;
};