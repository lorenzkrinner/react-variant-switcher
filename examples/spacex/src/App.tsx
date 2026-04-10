/**
 * from Paper
 * https://app.paper.design/file/01KNVY3KDX0AF0T2KXS3R522Y3?node=1-0
 * on Apr 10, 2026
 */
import { VariantGroup, VariantOption } from 'react-variant-switcher';
import LaunchCountdown from './components/LaunchCountdown';
import Navbar from './components/Navbar';
import HeroSlide from './components/HeroSlide';
import Footer from './components/Footer';
import hero1a from './assets/spacex-1a.png';
import hero1b from './assets/spacex-1b.png';
import hero1c from './assets/spacex-1c.png';
import tech2a from './assets/spacex-2a.png';
import tech2b from './assets/spacex-2b.png';
import tech2c from './assets/spacex-2c.png';

export default function App() {
  return (
    <div className="[font-synthesis:none] flex flex-col w-404.25 h-1195 bg-black antialiased text-xs/4 max-w-full">
      <div className="basis-[0%] grow">
        <div className="flex flex-col justify-end min-h-[880.667px] w-full">
          <div className="relative">
            <div className="left-0 absolute top-0 w-full z-10" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(0% 0 0 / 60%) 0%, oklab(0% 0 0 / 0%) 95%)' }}>
              <LaunchCountdown />
              <Navbar />
              <div className="h-75 absolute top-0 w-full inset-x-0" style={{ backgroundImage: 'linear-gradient(in oklab 180deg, oklab(0% 0 0 / 50%) 0%, oklab(0% 0 0 / 0%) 100%)' }} />
            </div>
          </div>
          <div className="" />
          <div className="">
            <div className="w-full">
              <div className="">
                <VariantGroup name="Hero">
                  <VariantOption name="multiplanetary" label="Multiplanetary" default>
                    <HeroSlide
                      title="Making life multiplanetary"
                      description="SpaceX was founded under the belief that a future where humanity is out exploring the stars is fundamentally more exciting than one where we are not."
                      ctaLabel="EXPLORE"
                      align="left"
                      centered
                      backgroundImage={hero1a}
                    />
                  </VariantOption>
                  <VariantOption name="mars-colony" label="Mars Colony">
                    <HeroSlide
                      title="Building humanity's first Mars colony"
                      description="Our mission is to establish a permanent, self-sustaining human presence on Mars — making humanity a truly interplanetary species within our lifetime."
                      ctaLabel="SEE THE PLAN"
                      align="left"
                      centered
                      backgroundImage={hero1b}
                    />
                  </VariantOption>
                  <VariantOption name="beyond-earth" label="Beyond Earth">
                    <HeroSlide
                      title="The next giant leap starts here"
                      description="From the first orbital flights to landing on Mars, every mission brings us closer to a future among the stars. The journey beyond Earth begins now."
                      ctaLabel="FOLLOW THE JOURNEY"
                      align="left"
                      centered
                      backgroundImage={hero1c}
                    />
                  </VariantOption>
                </VariantGroup>
                <VariantGroup name="Technology">
                  <VariantOption name="revolutionizing" label="Revolutionizing" default>
                    <HeroSlide
                      title="Revolutionizing space technology"
                      description="SpaceX's Starship spacecraft and Super Heavy rocket is a fully reusable transportation system designed to carry both crew and cargo to Earth orbit, the Moon, Mars, and beyond."
                      ctaLabel="LEARN MORE"
                      align="right"
                      backgroundImage={tech2a}
                      gradientStyle="linear-gradient(in oklab 90deg, oklab(0% 0 0 / 0%) 50%, oklab(0% 0 0 / 80%) 100%)"
                    />
                  </VariantOption>
                  <VariantOption name="reusability" label="Reusability">
                    <HeroSlide
                      title="Reusability changes everything"
                      description="By landing and reflying rocket boosters, SpaceX has reduced the cost of reaching orbit by an order of magnitude — opening space to possibilities that were once unimaginable."
                      ctaLabel="SEE A LANDING"
                      align="right"
                      backgroundImage={tech2b}
                      gradientStyle="linear-gradient(in oklab 90deg, oklab(0% 0 0 / 0%) 50%, oklab(0% 0 0 / 80%) 100%)"
                    />
                  </VariantOption>
                  <VariantOption name="starship-era" label="Starship Era">
                    <HeroSlide
                      title="Welcome to the Starship era"
                      description="The most powerful launch system ever built. Starship is designed to carry over 100 metric tonnes to orbit, enabling missions to the Moon, Mars, and deep space."
                      ctaLabel="MEET STARSHIP"
                      align="right"
                      backgroundImage={tech2c}
                      gradientStyle="linear-gradient(in oklab 90deg, oklab(0% 0 0 / 0%) 50%, oklab(0% 0 0 / 80%) 100%)"
                    />
                  </VariantOption>
                </VariantGroup>
                <HeroSlide
                  title="World's leading launch service provider"
                  description="SpaceX leads the world in launches with its reliable, reusable rockets and is developing the fully and rapidly reusable rockets necessary to transform humanity's ability to access space into something as routine as air travel."
                  ctaLabel="RESERVE YOUR RIDE"
                  align="left"
                  gradientStyle="linear-gradient(in oklab 270deg, oklab(0% 0 0 / 0%) 50%, oklab(0% 0 0 / 80%) 100%)"
                />
                <HeroSlide
                  title="Advancing human spaceflight"
                  description="Since returning human spaceflight capabilities to the United States in 2020, SpaceX is helping build a new era where not just hundreds of people, but thousands and ultimately millions will be able to explore space."
                  ctaLabel="JOIN A MISSION"
                  align="right"
                  backgroundImage="https://app.paper.design/file-assets/01KNVY3KDX0AF0T2KXS3R522Y3/2QH1PPWTTWE514ZR15GV1Q9TBT.jpg"
                  gradientStyle="linear-gradient(in oklab 90deg, oklab(0% 0 0 / 0%) 50%, oklab(0% 0 0 / 80%) 100%)"
                />
                <HeroSlide
                  title="Delivering high-speed internet from space"
                  description="Starlink is the world's most advanced satellite constellation in low-Earth orbit, delivering reliable broadband internet capable of supporting streaming, online gaming, video calls, and more."
                  ctaLabel="ORDER NOW"
                  align="left"
                  centered
                  gradientStyle="linear-gradient(in oklab 180deg, oklab(0% 0 0 / 0%) 50%, oklab(0% 0 0) 100%)"
                />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
