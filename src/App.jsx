import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ACCENT = '#bd5a31'

const SEASONS = {
  spring: { kanji: '春', romaji: 'Haru', sub: '桜 · SAKURA', tone: '#cf7e96', wash: 'linear-gradient(135deg,#f8ece9 0%,#f3e3e6 100%)', line: 'The cherry falls because it bloomed — a season of fragile beginnings.', detail: 'Hanami beneath drifting petals, the year exhaling into pink, and the whole country leaning toward bloom.', gallery: '03 WORKS · APR — MAY' },
  summer: { kanji: '夏', romaji: 'Natsu', sub: '祭 · MATSURI', tone: '#5f9c84', wash: 'linear-gradient(135deg,#eef1e9 0%,#e5ede6 100%)', line: 'Cicada song and lantern light — the islands at their most alive.', detail: 'Fireworks unfolding over the bay, festival drums in the dark, and the heavy green of flooded rice fields.', gallery: '03 WORKS · JUN — AUG' },
  autumn: { kanji: '秋', romaji: 'Aki', sub: '紅葉 · MOMIJI', tone: '#bd6e36', wash: 'linear-gradient(135deg,#f6ece0 0%,#f1e1d1 100%)', line: 'Maples turn to fire, and the harvest moon hangs low.', detail: 'Temple gardens deep in crimson, the air sharp with woodsmoke, and a quiet that settles before the cold.', gallery: '03 WORKS · SEP — NOV' },
  winter: { kanji: '冬', romaji: 'Fuyu', sub: '雪 · YUKI', tone: '#7589a0', wash: 'linear-gradient(135deg,#eceef1 0%,#e3e7ee 100%)', line: 'Snow settles over stone, and the world holds its breath.', detail: 'Steam rising from an onsen, frost laid along the shrine roof, and stillness made visible in the falling white.', gallery: '03 WORKS · DEC — FEB' },
}

const CARDS = {
  spring: [
    { glyph: '花', title: 'Hanami', blurb: 'Picnics beneath the cherry canopy as petals drift down like snow.' },
    { glyph: '田', title: 'Rice Planting', blurb: 'Flooded paddies mirror the sky; the farming year quietly begins.' },
    { glyph: '茶', title: 'First Flush', blurb: 'Tea fields wake from winter — the tenderest leaves of the year.' },
  ],
  summer: [
    { glyph: '火', title: 'Hanabi', blurb: 'Fireworks bloom over the bay in the warm summer dark.' },
    { glyph: '踊', title: 'Bon Odori', blurb: 'Lantern-lit circles dance to welcome the returning spirits.' },
    { glyph: '蝉', title: 'Cicada Days', blurb: 'Green mountains, paper fans, and the steady drone of summer.' },
  ],
  autumn: [
    { glyph: '紅', title: 'Momiji', blurb: 'Temple gardens turn to crimson and gold beneath clear skies.' },
    { glyph: '月', title: 'Tsukimi', blurb: 'Offerings of rice and grass beneath the full harvest moon.' },
    { glyph: '稲', title: 'Harvest', blurb: 'Rice gathered in; the fields left gold with autumn stubble.' },
  ],
  winter: [
    { glyph: '雪', title: 'Snow Country', blurb: 'Thatched roofs lie heavy with snow in the silent north.' },
    { glyph: '湯', title: 'Onsen', blurb: 'Steam rises from stone baths; warmth held against the cold.' },
    { glyph: '灯', title: 'New Year', blurb: 'Shrine bells and first light over a hushed, frosted land.' },
  ],
}

const HERO_DESKTOP = '/images/torii-gate-widescreen.png'
const HERO_MOBILE = '/images/torii-gate-mobile.png'

export default function App() {
  const [season, setSeason] = useState('spring')
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  const heroImgRef = useRef(null)
  const heroCopyRef = useRef(null)
  const heroCtaRef = useRef(null)
  const navRef = useRef(null)
  const kanjiRef = useRef(null)
  const scrollIndRef = useRef(null)

  // GSAP intro animation on page load
  useLayoutEffect(() => {
    // 1) set opacity/transform to 0 while still visibility:hidden (no flash possible)
    gsap.set(heroImgRef.current, { scale: 1.15, opacity: 0 })
    gsap.set(navRef.current, { y: -30, opacity: 0 })
    gsap.set(kanjiRef.current, { opacity: 0, x: -20 })
    gsap.set(scrollIndRef.current, { opacity: 0, y: 20 })
    const subtitle = heroCopyRef.current?.querySelector('p')
    const title = heroCopyRef.current?.querySelector('h1')
    gsap.set([subtitle, title], { opacity: 0, y: 30 })
    const ctaLinks = heroCtaRef.current?.querySelectorAll('a')
    gsap.set(ctaLinks, { opacity: 0, y: 20 })

    // 2) now safe to show — everything is opacity:0 so nothing flashes
    gsap.set('[data-gsap-intro]', { visibility: 'visible' })
    gsap.set(heroImgRef.current, { visibility: 'visible' })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.to(heroImgRef.current, { scale: 1.08, opacity: 1, duration: 1.8, ease: 'power2.out' })
      tl.to(navRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.4)
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.9 }, 0.6)
      tl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 0.8)
      tl.to(kanjiRef.current, { opacity: 1, x: 0, duration: 0.8 }, 1.1)
      tl.to(ctaLinks, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, 1.2)
      tl.to(scrollIndRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.5)

      // --- scroll-driven parallax + fade ---

      gsap.to(heroImgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to(heroCopyRef.current, {
        opacity: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '40% top',
          scrub: true,
        },
      })

      gsap.to(heroCtaRef.current, {
        opacity: 0,
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '35% top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // GSAP scroll-triggered reveals
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return

    gsap.set(els, { opacity: 0, y: 32 })

    const triggers = []
    els.forEach(el => {
      const delay = parseFloat(el.getAttribute('data-reveal-delay') || 0) / 1000
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            delay,
            ease: 'power2.out',
          })
        },
      })
      triggers.push(st)
    })

    return () => triggers.forEach(st => st.kill())
  }, [season])

  // nav scroll state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 130)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const S = SEASONS[season]
  const cards = CARDS[season]

  const navBtnCls = scrolled
    ? 'bg-accent text-[#fdf7ef]'
    : 'bg-[#fdf7ef] text-ink'

  return (
    <div className="overflow-hidden">

      {/* NAV */}
      <nav ref={navRef} style={{ opacity: 0, transform: 'translateY(-30px)' }} className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-[5vw] transition-all duration-500 ${scrolled ? 'py-4 bg-parchment/92 backdrop-blur-[12px] border-b border-ink/8 shadow-[0_6px_26px_rgba(34,27,22,0.06)]' : 'py-[30px] bg-transparent border-b border-transparent'}`}>
        <a href="#top" className={`flex items-baseline gap-3 no-underline transition-colors duration-400 ${scrolled ? 'text-ink' : 'text-[#fdf7ef]'}`}>
          <span className="font-mincho text-[22px]">物の哀れ</span>
          <span className="text-[11px] tracking-[5px] font-medium opacity-80 pl-0.5">AWARE</span>
        </a>
        <div className="flex items-center gap-5 md:gap-[2.6vw]">
          {[['#exhibition','Exhibition'],['#philosophy','Spirit'],['#visit','Visit']].map(([href,label]) => (
            <a key={label} href={href} className={`no-underline text-[13px] tracking-[1px] opacity-90 transition-colors duration-400 hidden sm:block ${scrolled ? 'text-ink' : 'text-[#fdf7ef]'}`}>{label}</a>
          ))}
          <a href="#visit" className={`text-[12.5px] tracking-[1.5px] px-[22px] py-[11px] rounded-full no-underline font-medium transition-all duration-400 ${navBtnCls}`}>Plan your visit</a>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} id="top" className="relative h-screen min-h-[680px] w-full overflow-hidden">
        <picture>
          <source media="(min-width: 1024px)" srcSet={HERO_DESKTOP} />
          <img ref={heroImgRef} data-gsap-intro src={HERO_MOBILE} alt="Floating torii gate at sunset" className="absolute inset-0 w-full h-full object-cover object-center scale-[1.08] will-change-transform" />
        </picture>

        {/* scrims */}
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(26,16,11,0.46) 0%, rgba(26,16,11,0.21) 32%, rgba(26,16,11,0) 64%)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(28,18,14,0.30) 0%, rgba(28,18,14,0) 24%)' }} />

        {/* vertical kanji */}
        <div ref={kanjiRef} data-gsap-intro className="absolute top-1/2 left-6 md:left-[4vw] -translate-y-1/2 z-[3] font-mincho text-[clamp(15px,1.4vw,19px)] tracking-[10px] text-[#fdf7ef]/78" style={{ writingMode:'vertical-rl', textShadow:'0 2px 14px rgba(40,20,10,0.4)' }}>
          神は水を渡る
        </div>

        {/* hero copy */}
        <div ref={heroCopyRef} data-gsap-intro className="absolute z-[3] inset-x-0 top-[8%] lg:top-[10%] flex flex-col items-center text-center">
          <p className="text-[10px] lg:text-[11px] tracking-[5px] font-medium text-[#fdf7ef]/70 mb-3 lg:mb-4">日本文化展 · A CULTURAL SHOWCASE</p>
          <h1 className="font-mincho font-medium text-[clamp(32px,5vw,58px)] xl:text-[clamp(38px,4.5vw,68px)] text-[#fdf7ef] leading-[1.1] -tracking-[0.5px]" style={{ textShadow:'0 4px 30px rgba(40,18,8,0.35)' }}>Where the gods<br/>cross the water</h1>
        </div>

        {/* CTA buttons */}
        <div ref={heroCtaRef} data-gsap-intro className="absolute z-3 inset-x-0 bottom-[10%] flex items-center justify-center gap-4 lg:gap-5">
          <a href="#exhibition" className="text-xs lg:text-[13px] tracking-[1.5px] text-[#fdf7ef] bg-accent px-6 lg:px-8 py-3 lg:py-4 rounded-full no-underline font-medium shadow-[0_10px_30px_rgba(150,60,25,0.35)]">Enter the showcase</a>
          <a href="#philosophy" className="text-xs lg:text-[13px] tracking-[1.5px] text-[#fdf7ef] no-underline font-normal inline-flex items-center gap-2">Watch the film <span className="text-[11px]">▶</span></a>
        </div>

        {/* scroll indicator */}
        <div ref={scrollIndRef} data-gsap-intro className="absolute left-1/2 bottom-[26px] -translate-x-1/2 z-3 flex flex-col items-center gap-2 text-[#fdf7ef]/70" style={{ animation:'floatNote 2.6s ease-in-out infinite' }}>
          <span className="text-[10px] tracking-[3px]">SCROLL</span>
          <span className="w-px h-[30px]" style={{ background:'linear-gradient(to bottom, rgba(253,247,239,0.7), transparent)' }} />
        </div>
      </section>

      {/* META STRIP */}
      <div className="bg-ink text-[#f0e7da]">
        <div className="max-w-[1180px] mx-auto py-[30px] px-6 md:px-[5vw] flex flex-wrap gap-y-6 gap-x-10 md:gap-x-[7vw] items-center justify-between">
          {[['会期','Spring — Summer 2026'],['会場','Kyoto · Tokyo · Naoshima'],['入場','Free admission']].map(([k,v]) => (
            <div key={k} className="flex items-baseline gap-[11px]">
              <span className="font-mincho text-accent text-[15px]">{k}</span>
              <span className="text-[13.5px] tracking-[1px] opacity-85">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* INTRO */}
      <section className="max-w-[980px] mx-auto py-[clamp(90px,13vh,160px)] px-6 md:px-[5vw] text-center">
        <span data-reveal className="inline-block font-mincho text-[26px] text-accent">序</span>
        <p data-reveal data-reveal-delay="80" className="font-mincho font-normal text-[clamp(24px,3.4vw,40px)] leading-[1.5] tracking-[0.2px] mt-7 text-[#2a211a]" style={{ textWrap:'balance' }}>A nation is not only its places, but the feeling of standing within them — the hush before a shrine, the turn of a season, the patience held in a maker's hands.</p>
        <p data-reveal data-reveal-delay="180" className="mt-8 text-[15px] tracking-[0.5px] leading-[1.8] text-[#6f6157] max-w-[560px] mx-auto font-light">This showcase gathers those quiet moments into one journey — across the islands, the crafts, and the centuries that shaped them.</p>
      </section>

      {/* EXHIBITION */}
      <section id="exhibition" className="transition-[background] duration-[800ms]" style={{ background:S.wash }}>
        <div className="max-w-[1240px] mx-auto py-[clamp(80px,12vh,150px)] px-6 md:px-[5vw]">

          <div data-reveal className="flex items-end justify-between flex-wrap gap-5 mb-10">
            <div>
              <div className="flex items-center gap-[13px] mb-4">
                <span className="w-[34px] h-px transition-colors duration-[800ms]" style={{ background:S.tone }} />
                <span className="text-[11px] tracking-[4px] font-semibold transition-colors duration-[800ms]" style={{ color:S.tone }}>展示室 · 四季 · FOUR SEASONS</span>
              </div>
              <h2 className="font-mincho font-medium text-[clamp(32px,4.4vw,52px)] leading-[1.1] -tracking-[0.3px] text-[#2a211a]">Four rooms, four seasons</h2>
            </div>
            <p className="max-w-[330px] text-[14.5px] leading-[1.75] text-[#6f6157] font-light">Each room holds a single season — choose one to walk its halls.</p>
          </div>

          {/* TABS */}
          <div className="flex gap-2 md:gap-[clamp(8px,1.4vw,16px)] flex-wrap mb-[clamp(40px,6vh,64px)] border-b border-ink/12 pb-[clamp(28px,4vh,40px)]">
            {Object.keys(SEASONS).map(key => (
              <button
                key={key}
                onClick={() => setSeason(key)}
                className="cursor-pointer px-[clamp(16px,2vw,26px)] py-3 rounded-full font-mincho text-[17px] tracking-[1px] transition-all duration-500"
                style={{
                  border: season === key ? `1px solid ${SEASONS[key].tone}` : '1px solid rgba(34,27,22,0.16)',
                  background: season === key ? SEASONS[key].tone : 'transparent',
                  color: season === key ? '#fff' : '#776a5f',
                }}
              >
                {SEASONS[key].kanji} {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {/* PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 md:gap-[clamp(32px,6vw,90px)] items-center mb-[clamp(52px,8vh,90px)]">
            <div className="flex flex-col items-center text-center">
              <span className="font-mincho font-semibold text-[clamp(120px,16vw,220px)] leading-[0.9] transition-colors duration-[800ms]" style={{ color:S.tone }}>{S.kanji}</span>
              <span className="mt-3.5 font-mincho text-[26px] text-[#2a211a]">{S.romaji}</span>
              <span className="mt-1 text-[12px] tracking-[3px] text-[#8a7a66]">{S.sub}</span>
            </div>
            <div>
              <p className="font-mincho font-normal text-[clamp(24px,3vw,38px)] leading-[1.45] text-[#2a211a]" style={{ textWrap:'balance' }}>{S.line}</p>
              <p className="mt-6 text-[15.5px] leading-[1.85] text-[#6f6157] font-light max-w-[460px]">{S.detail}</p>
              <div className="mt-8 flex items-center gap-3">
                <span className="w-[34px] h-px transition-colors duration-[800ms]" style={{ background:S.tone }} />
                <span className="text-[12px] tracking-[2px] transition-colors duration-[800ms]" style={{ color:S.tone }}>{S.gallery}</span>
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[clamp(24px,3vw,44px)]">
            {cards.map(card => (
              <article key={card.title} className="flex flex-col">
                <div className="w-full aspect-[3/4] bg-ink/5 rounded-[3px] flex items-center justify-center text-[#a09080] text-sm tracking-[1px]">
                  {card.glyph}
                </div>
                <div className="flex items-baseline gap-3 mt-[22px]">
                  <span className="font-mincho text-[26px] transition-colors duration-[800ms]" style={{ color:S.tone }}>{card.glyph}</span>
                  <h3 className="font-mincho font-medium text-2xl text-[#2a211a]">{card.title}</h3>
                </div>
                <p className="mt-[13px] text-[14.5px] leading-[1.75] text-[#6f6157] font-light">{card.blurb}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="relative bg-ink text-[#f0e7da] overflow-hidden">
        <div className="absolute top-0 bottom-0 right-0 w-[46%] opacity-50">
          <img src={HERO_DESKTOP} alt="" className="w-full h-full object-cover object-[left_center]" />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to right, #221b16 6%, rgba(34,27,22,0.4) 55%, rgba(34,27,22,0.15) 100%)' }} />
        </div>
        <div className="relative z-[2] max-w-[1180px] mx-auto py-[clamp(90px,14vh,170px)] px-6 md:px-[5vw]">
          <div data-reveal className="max-w-[620px]">
            <div className="flex items-center gap-3.5 mb-[30px]">
              <span className="font-mincho text-[30px] text-accent">物の哀れ</span>
              <span className="text-[11px] tracking-[4px] opacity-70">MONO NO AWARE</span>
            </div>
            <p className="font-mincho font-normal text-[clamp(24px,3.2vw,38px)] leading-[1.5] tracking-[0.2px]" style={{ textWrap:'balance' }}>A gentle awareness of impermanence — and the quiet beauty held in all things that pass.</p>
            <p className="mt-[30px] text-[15px] leading-[1.85] opacity-78 max-w-[480px] font-light">It is the feeling beneath every room of this showcase: that what is fleeting is not lesser, but more dear. The cherry falls because it bloomed. The tide rises around the gate, and the gate remains.</p>
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section id="visit" className="relative h-[78vh] min-h-[520px] overflow-hidden">
        <img src={HERO_DESKTOP} alt="Floating torii gate" className="absolute inset-0 w-full h-full object-cover object-[center_40%]" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(28,18,14,0.62) 0%, rgba(28,18,14,0.18) 55%, rgba(28,18,14,0.3) 100%)' }} />
        <div data-reveal className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-6 md:px-[5vw]">
          <div className="flex items-center gap-[13px] mb-6">
            <span className="w-[34px] h-px bg-accent" />
            <span className="text-[11px] tracking-[4.5px] font-semibold text-[#fdf7ef]">訪問 · PLAN YOUR VISIT</span>
            <span className="w-[34px] h-px bg-accent" />
          </div>
          <h2 className="font-mincho font-medium text-[#fdf7ef] text-[clamp(38px,6vw,76px)] leading-[1.06] -tracking-[0.4px]" style={{ textShadow:'0 4px 36px rgba(40,18,8,0.5)', textWrap:'balance' }}>Cross the threshold</h2>
          <p className="mt-6 max-w-[460px] text-base leading-[1.7] text-[#fdf7ef]/90 font-light">Open daily, sunrise to dusk. Spring through summer, 2026.</p>
          <a href="#" className="mt-8 text-sm tracking-[1.5px] text-[#fdf7ef] bg-accent px-10 py-[17px] rounded-full no-underline font-medium shadow-[0_12px_34px_rgba(150,60,25,0.4)]">Reserve your time</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1410] text-[#cdbfae]">
        <div className="max-w-[1180px] mx-auto py-[clamp(48px,7vh,76px)] px-6 md:px-[5vw] flex flex-wrap gap-9 items-start justify-between">
          <div>
            <div className="flex items-baseline gap-3 text-[#f0e7da] mb-3.5">
              <span className="font-mincho text-[21px]">物の哀れ</span>
              <span className="text-[11px] tracking-[5px] opacity-80">AWARE</span>
            </div>
            <p className="text-[13px] leading-[1.7] opacity-70 max-w-[280px] font-light">A cultural showcase celebrating the spirit, craft, and seasons of Japan.</p>
          </div>
          <div className="flex gap-10 md:gap-[clamp(40px,6vw,80px)] flex-wrap">
            <div className="flex flex-col gap-[11px]">
              <span className="text-[10.5px] tracking-[3px] opacity-55 mb-1.5">VISIT</span>
              {['Kyoto','Tokyo','Naoshima'].map(c => <a key={c} href="#" className="text-[#cdbfae] no-underline text-[13.5px]">{c}</a>)}
            </div>
            <div className="flex flex-col gap-[11px]">
              <span className="text-[10.5px] tracking-[3px] opacity-55 mb-1.5">MORE</span>
              <a href="#exhibition" className="text-[#cdbfae] no-underline text-[13.5px]">Exhibition</a>
              <a href="#philosophy" className="text-[#cdbfae] no-underline text-[13.5px]">Philosophy</a>
              <a href="#" className="text-[#cdbfae] no-underline text-[13.5px]">Press</a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#f0e7da]/10">
          <div className="max-w-[1180px] mx-auto py-5 px-6 md:px-[5vw] flex flex-wrap gap-3 justify-between text-xs opacity-55">
            <span>© 2026 AWARE — A Cultural Showcase of Japan</span>
            <span>展示・体験・訪問</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
