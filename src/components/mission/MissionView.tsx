import React, { useEffect, useState } from 'react';
import { ActiveTab } from '../../types';
import { UserRole } from '../../types/partner';
import { 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  Shield, 
  Car, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ZoomIn,
  X
} from 'lucide-react';
import '../../styles/mission.css';

interface MissionViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSwitchRole?: (role: UserRole) => void;
}

export const MissionView: React.FC<MissionViewProps> = ({
  onNavigateTab,
  onSwitchRole
}) => {
  const [activeLangSnippet, setActiveLangSnippet] = useState<'darija' | 'fr' | 'en'>('darija');
  const [isSketchModalOpen, setIsSketchModalOpen] = useState(false);
  const [selectedLap, setSelectedLap] = useState<number | null>(null);

  useEffect(() => {
    // Scroll smoothly to top on view load
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // IntersectionObserver to reveal sections as they scroll into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.15 }
    );

    const reveals = document.querySelectorAll('.mission-root .reveal, .mission-root .reveal-stagger');
    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="mission-root relative w-full">
      {/* ── 1. MISSION HERO ── */}
      <section className="mission-hero">
        <div className="mh-grain"></div>
        <div className="mh-inner">
          <div className="mh-eyebrow">Our mission · est. 2024 · Casablanca</div>
          <h1 className="mh-title">
            <span className="l1">The country</span>
            <span className="l2">is the <span className="underline">point</span>.</span>
            <span className="l3">The car is</span>
            <span className="l4">just the key.</span>
          </h1>
          <div className="mh-meta">
            <p className="lead">
              airbcar exists so that getting from <em>here</em> to <em>there</em> in Morocco — by Atlas pass or Atlantic coast, by 4×4 or by Dacia — never again costs more than the road itself, and never again routes through a middleman who has never been on it.
            </p>
            <div className="col">
              <h5>Founded</h5>
              <p>
                Casablanca, March 2024<br />
                by three Moroccan founders<br />
                and a borrowed Logan.
              </p>
            </div>
            <div className="col">
              <h5>Today</h5>
              <p>
                320+ partner agencies<br />
                14 cities · 2,400 vehicles<br />
                1 country, fully covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE RIBBON ── */}
      <div className="marquee">
        <div className="marquee-track">
          <span className="marquee-item">
            Built in Casablanca <span className="star">✦</span> for everyone with somewhere to be <span className="star">✦</span> no middlemen <span className="star">✦</span> no detours <span className="star">✦</span>
          </span>
          <span className="marquee-item">
            Built in Casablanca <span className="star">✦</span> for everyone with somewhere to be <span className="star">✦</span> no middlemen <span className="star">✦</span> no detours <span className="star">✦</span>
          </span>
        </div>
      </div>

      {/* ── 2. MANIFESTO ── */}
      <section className="section manifesto">
        <div className="manifesto-block reveal in">
          <div className="manifesto-rule">A manifesto, in five paragraphs</div>
          <div className="manifesto-text">
            <p>
              Morocco is not a destination. It is a <em>distance</em> — measured by the ones you cross to reach it, and the ones you cross once you're inside it.
            </p>
            <p>
              For thirty years, the keys to that distance have been kept by foreign platforms with offices in <strong>Paris</strong>, in <strong>Madrid</strong>, in <strong>Berlin</strong>. They charged a Casablanca driver in <span className="ko">euros</span>, took 22% off the top, and routed a Tangier breakdown call through a phone tree in another timezone.
            </p>
            <p>
              The agencies — the <em>actual</em> agencies, run by actual Moroccans on actual Moroccan streets — were left with the empty lots, the angry customers, and a shrinking margin.
            </p>
            <p>
              airbcar is the answer the country was already writing. Built in Casa. In <em>Darija</em>, French, English. Paid in MAD, taxed in Morocco. Insured by Wafa, supported by humans who know the difference between a Marrakech June and a Merzouga August.
            </p>
            <p>
              <strong>The country is the point. We're just helping you get to it.</strong>
            </p>
          </div>
          <div className="manifesto-sign">
            <div className="who">
              — The airbcar founding team
              <small>Casablanca · March 2024</small>
            </div>
            <div className="stamp">
              <span className="dot"></span>
              Document 001 · Mission
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. ORIGIN ── */}
      <section className="section origin">
        <div className="container">
          <div className="origin-grid">
            <div 
              className="origin-image reveal in cursor-pointer group"
              onClick={() => setIsSketchModalOpen(true)}
              title="Click to view archive document"
            >
              <div className="quote">
                "We borrowed a Dacia from my uncle's lot in Hay Mohammadi. The trunk had no spare. The first booking we ever closed was with our own ID."
              </div>
              <div className="meta flex justify-between items-center">
                <span>Sketch · Hay Mohammadi · 2023</span>
                <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                  Frame 01 / 04 <ZoomIn className="w-3.5 h-3.5 inline" />
                </span>
              </div>
            </div>

            <div className="origin-text reveal in">
              <div className="section-eyebrow">The origin</div>
              <h2>It started on a <em>Tuesday</em>, in an empty lot.</h2>
              <p>
                In late 2023, two of us — Mehdi (a product designer who'd just left a Berlin scaleup) and Lamia (an ops lead at a Casa fintech) — sat with Mehdi's uncle in Hay Mohammadi watching eight perfectly good cars do nothing for the fourth Tuesday in a row.
              </p>
              <p>
                His agency was on every booking platform that existed. They sent traffic. They also kept 22%, charged in euros, paid in 90 days, and routed customer support through a call centre that had never been to Morocco.
              </p>
              <p>
                By Friday we had a name, a borrowed Dacia, and a deck. By March 2024 we had Aymane (formerly the engineer behind Morocco's largest classifieds), a Casablanca seed, and 14 partner agencies who said they'd try it.
              </p>
              <p>
                By the end of 2025 we had 320.
              </p>
              <div className="pull">
                "We didn't build airbcar to disrupt anyone. We built it so the country didn't have to keep paying rent on its own roads."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PRINCIPLES ── */}
      <section className="section principles">
        <div className="container">
          <div className="section-head reveal in">
            <div>
              <div className="section-eyebrow">What we believe</div>
              <h2>Six things we'll <em>never</em><br />compromise on.</h2>
            </div>
            <p className="sub">
              Internal commitments, written down so we can't quietly walk them back. Updated when we get something wrong, never when we get it inconvenient.
            </p>
          </div>

          <div className="principle-grid reveal-stagger in">
            {/* Principle 01 */}
            <div className="principle">
              <div className="num">01</div>
              <h3>The agency keeps the relationship.</h3>
              <p>
                We are the bookings layer, never the brand the renter sees first. The walk-in customer at your counter is yours. The repeat traveller who loved your service is yours. We don't run a loyalty programme that pulls customers off your roster.
              </p>
              <div className="anti">Not us: <b>super-app monopoly</b></div>
            </div>

            {/* Principle 02 */}
            <div className="principle">
              <div className="num">02</div>
              <h3>Pricing is <em>transparent</em>, both ways.</h3>
              <p>
                The renter sees what the agency charges, plus our fee, plus tax — itemised, before they pay. The agency sees our take in MAD, before they list. No dynamic surprises, no hidden currency conversion margin.
              </p>
              <div className="anti">Not us: <b>opaque marketplace fees</b></div>
            </div>

            {/* Principle 03 */}
            <div className="principle">
              <div className="num">03</div>
              <h3>Trust is a layer, not a logo.</h3>
              <p>
                Every driver is verified against the national registry. Every trip is photographed at handover. Every dispute is reviewed by humans within 48 hours. We don't outsource trust to a star rating — we underwrite it ourselves.
              </p>
              <div className="anti">Not us: <b>star-rating roulette</b></div>
            </div>

            {/* Principle 04 */}
            <div className="principle">
              <div className="num">04</div>
              <h3>Built in <em>Darija</em>, French, English. In that order.</h3>
              <p>
                Our app, our support, our contracts, our tax invoices. The customer who asks a question in Darija gets answered in Darija by a human in Casablanca, not auto-translated by a chatbot in San Francisco.
              </p>
              
              {/* Interactive language preview snippet */}
              <div className="mt-3 p-2.5 rounded-lg bg-[#ede4d3]/80 border border-[#1a1208]/10 text-xs">
                <div className="flex gap-1 mb-1.5 font-mono text-[10px]">
                  <button 
                    onClick={() => setActiveLangSnippet('darija')}
                    className={`px-2 py-0.5 rounded ${activeLangSnippet === 'darija' ? 'bg-[#c0392b] text-white font-bold' : 'text-neutral-600'}`}
                  >
                    Darija (دارجة)
                  </button>
                  <button 
                    onClick={() => setActiveLangSnippet('fr')}
                    className={`px-2 py-0.5 rounded ${activeLangSnippet === 'fr' ? 'bg-[#c0392b] text-white font-bold' : 'text-neutral-600'}`}
                  >
                    Français
                  </button>
                  <button 
                    onClick={() => setActiveLangSnippet('en')}
                    className={`px-2 py-0.5 rounded ${activeLangSnippet === 'en' ? 'bg-[#c0392b] text-white font-bold' : 'text-neutral-600'}`}
                  >
                    English
                  </button>
                </div>
                <div className="italic text-neutral-800">
                  {activeLangSnippet === 'darija' && '"مرحبا بيك، الطوموبيل واجدة فكازا بور ومفتاحها فجيبك بلا وساطة ولا صداع."'}
                  {activeLangSnippet === 'fr' && '"Bienvenue, votre véhicule est prêt à Casablanca Port, clés en main sans intermédiaire."'}
                  {activeLangSnippet === 'en' && '"Welcome, your vehicle is prepped at Casablanca Port, keys in hand with zero middlemen."'}
                </div>
              </div>

              <div className="anti mt-2">Not us: <b>localised-as-an-afterthought</b></div>
            </div>

            {/* Principle 05 */}
            <div className="principle">
              <div className="num">05</div>
              <h3>Money stays in <em>Morocco</em>.</h3>
              <p>
                Settlements in MAD. Tax paid in Morocco. Engineering and ops headquartered in Casablanca, hired locally. We're not a foreign holding using the country as a market — we're a Moroccan company using the rest of the world as a market.
              </p>
              <div className="anti">Not us: <b>extractive platform economics</b></div>
            </div>

            {/* Principle 06 */}
            <div className="principle">
              <div className="num">06</div>
              <h3>The road belongs to the <em>traveller</em>.</h3>
              <p>
                We never sell your data. We never lock your bookings to one platform. If you want to leave with your reviews, your customer list, and your trip history — they're yours. We earn loyalty by being useful, not by being unavoidable.
              </p>
              <div className="anti">Not us: <b>data-as-moat</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TIMELINE ── */}
      <section className="section timeline-sec">
        <div className="container">
          <div className="section-head reveal in">
            <div>
              <div className="section-eyebrow">The road, so far</div>
              <h2>Six laps,<br />one <em>map</em>.</h2>
            </div>
            <p className="sub">
              A short history. Most of the milestones that matter to us aren't in the press — they're in the WhatsApp messages from agencies that said "this works".
            </p>
          </div>

          <div className="timeline reveal in">
            <div className="timeline-track">
              {/* Lap 1 */}
              <div 
                className={`tl-item cursor-pointer transition-transform ${selectedLap === 1 ? 'scale-105' : ''}`}
                onClick={() => setSelectedLap(selectedLap === 1 ? null : 1)}
              >
                <div className="dot"></div>
                <div className="yr"><span>Q4</span> 2023</div>
                <h4>The Tuesday<br />in <em>Hay Mohammadi</em>.</h4>
                <p>Three founders. One borrowed Dacia. Eight idle cars asking why.</p>
              </div>

              {/* Lap 2 */}
              <div 
                className={`tl-item cursor-pointer transition-transform ${selectedLap === 2 ? 'scale-105' : ''}`}
                onClick={() => setSelectedLap(selectedLap === 2 ? null : 2)}
              >
                <div className="dot"></div>
                <div className="yr"><span>Q1</span> 2024</div>
                <h4>Casablanca seed,<br />14 agencies on day one.</h4>
                <p>Founded as a Moroccan SARL. First booking closed in Casa, 18 March.</p>
              </div>

              {/* Lap 3 */}
              <div 
                className={`tl-item cursor-pointer transition-transform ${selectedLap === 3 ? 'scale-105' : ''}`}
                onClick={() => setSelectedLap(selectedLap === 3 ? null : 3)}
              >
                <div className="dot"></div>
                <div className="yr"><span>Q3</span> 2024</div>
                <h4><em>Wafa Assurance</em> partnership.</h4>
                <p>Trip-based insurance live. Casa ops team grows to twelve.</p>
              </div>

              {/* Lap 4 */}
              <div 
                className={`tl-item cursor-pointer transition-transform ${selectedLap === 4 ? 'scale-105' : ''}`}
                onClick={() => setSelectedLap(selectedLap === 4 ? null : 4)}
              >
                <div className="dot"></div>
                <div className="yr"><span>Q1</span> 2025</div>
                <h4>100 agencies,<br />9 cities.</h4>
                <p>Marrakech, Fes, Rabat, Tangier go live. First Darija-native app build.</p>
              </div>

              {/* Lap 5 */}
              <div 
                className={`tl-item cursor-pointer transition-transform ${selectedLap === 5 ? 'scale-105' : ''}`}
                onClick={() => setSelectedLap(selectedLap === 5 ? null : 5)}
              >
                <div className="dot"></div>
                <div className="yr"><span>Q4</span> 2025</div>
                <h4>B2B sharing,<br />320 partners.</h4>
                <p>Inter-agency overflow goes live. First one-million-MAD month.</p>
              </div>

              {/* Lap 6 (NOW) */}
              <div 
                className={`tl-item now cursor-pointer transition-transform ${selectedLap === 6 ? 'scale-105' : ''}`}
                onClick={() => setSelectedLap(selectedLap === 6 ? null : 6)}
              >
                <div className="dot"></div>
                <div className="yr"><span>NOW</span> 2026</div>
                <h4>14 cities,<br />2.4k vehicles, <em>open road.</em></h4>
                <p>The country, in your hands. And we're just getting started.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. IMPACT / NUMBERS ── */}
      <section className="section impact">
        <div className="container-wide">
          <div className="section-head reveal in" style={{ padding: '0 40px' }}>
            <div>
              <div className="section-eyebrow">By the numbers</div>
              <h2>The receipts,<br /><em>publicly</em> kept.</h2>
            </div>
            <p className="sub">
              Updated quarterly. Audited annually by KPMG Morocco. If a number ever moves the wrong way, you'll find it here before you find it on a slide deck.
            </p>
          </div>

          <div className="impact-row reveal-stagger in">
            <div className="impact-cell lead">
              <div className="lbl">FY26 · headline</div>
              <h3>Every MAD <em>spent</em> with airbcar is taxed and banked in Morocco.</h3>
              <div className="ctx">
                No offshore holdings. No transfer-pricing tricks. No Cayman boxes. We're a Moroccan SARL, full stop.
              </div>
            </div>

            <div className="impact-cell">
              <div className="lbl">Agencies on platform</div>
              <div className="num">320<em>+</em></div>
              <div className="ctx">Across 14 cities — and 4 more cities planned by Q3.</div>
            </div>

            <div className="impact-cell">
              <div className="lbl">MAD paid out · cumulative</div>
              <div className="num">42.6<span className="small">M</span></div>
              <div className="ctx">Direct to Moroccan partner agencies, every Tuesday since launch.</div>
            </div>

            <div className="impact-cell">
              <div className="lbl">Avg. revenue lift, partners</div>
              <div className="num gold">+38<em>%</em></div>
              <div className="ctx">Year-1 revenue lift for agencies who joined and stayed for at least 12 weeks.</div>
            </div>
          </div>

          <div className="impact-row reveal-stagger in" style={{ borderTop: 'none' }}>
            <div className="impact-cell">
              <div className="lbl">Avg trip rating</div>
              <div className="num">4.91<span className="small">★</span></div>
              <div className="ctx">From 22,400+ verified, completed trips. Median resolution time: 12 hours.</div>
            </div>

            <div className="impact-cell">
              <div className="lbl">Local jobs</div>
              <div className="num">38</div>
              <div className="ctx">Full-time, in-country. Casa HQ, Marrakech ops, remote across MA.</div>
            </div>

            <div className="impact-cell">
              <div className="lbl">Cars onboarded</div>
              <div className="num gold">2,412</div>
              <div className="ctx">From compact city sedans to dune-ready 4×4s. 64 EVs and counting.</div>
            </div>

            <div className="impact-cell">
              <div className="lbl">Platform fee</div>
              <div className="num">8–14<em>%</em></div>
              <div className="ctx">All-in. Vs. 22–30% on the foreign incumbents we replaced.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TEAM ── */}
      <section className="section team">
        <div className="container">
          <div className="section-head reveal in">
            <div>
              <div className="section-eyebrow">The people behind it</div>
              <h2>A small team<br />on a <em>large</em> map.</h2>
            </div>
            <p className="sub">
              Eight founding members in Casa, thirty more across the country. We hire for road-sense first and resumes second — most of us have run something on this map before.
            </p>
          </div>

          <div className="team-grid reveal-stagger in">
            <div className="team-card r1">
              <div className="photo font-serif-display">M</div>
              <div className="body">
                <div className="name">Mehdi El Amrani</div>
                <div className="role">Co-founder · Product</div>
                <div className="from">← Berlin · Casa</div>
              </div>
            </div>

            <div className="team-card r2">
              <div className="photo font-serif-display">L</div>
              <div className="body">
                <div className="name">Lamia Bouzidi</div>
                <div className="role">Co-founder · Operations</div>
                <div className="from">← Casa · Casa</div>
              </div>
            </div>

            <div className="team-card r3">
              <div className="photo font-serif-display">A</div>
              <div className="body">
                <div className="name">Aymane Tazi</div>
                <div className="role">Co-founder · Engineering</div>
                <div className="from">← Rabat · Casa</div>
              </div>
            </div>

            <div className="team-card">
              <div className="photo font-serif-display">N</div>
              <div className="body">
                <div className="name">Nadia Saidi</div>
                <div className="role">Head of Partner Ops</div>
                <div className="from">← Marrakech</div>
              </div>
            </div>

            <div className="team-card r2">
              <div className="photo font-serif-display">Y</div>
              <div className="body">
                <div className="name">Younes Cherradi</div>
                <div className="role">Head of Trust &amp; Safety</div>
                <div className="from">← Tangier · Casa</div>
              </div>
            </div>

            <div className="team-card">
              <div className="photo font-serif-display">S</div>
              <div className="body">
                <div className="name">Salma Idrissi</div>
                <div className="role">Head of Design</div>
                <div className="from">← Lyon · Casa</div>
              </div>
            </div>

            <div className="team-card r1">
              <div className="photo font-serif-display">R</div>
              <div className="body">
                <div className="name">Rachid Kabbaj</div>
                <div className="role">Head of Insurance</div>
                <div className="from">← Casa</div>
              </div>
            </div>

            <div className="team-card r3">
              <div className="photo font-serif-display">+</div>
              <div className="body">
                <div className="name">+ 30 others</div>
                <div className="role">Across 14 cities</div>
                <div className="from">→ careers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. COMMITMENT ── */}
      <section className="section commitment">
        <div className="commitment-inner">
          <div className="commitment-tag">A public commitment</div>
          <h2>If we ever forget the road, <em>remind us.</em></h2>
          <div className="commitment-list">
            <div className="item">
              <h4>Open accounting</h4>
              <p>Annual financials published the same week they're filed with the OMPIC. No quiet quarters.</p>
            </div>
            <div className="item">
              <h4>Founder office hours</h4>
              <p>One Friday a month, the three of us answer any partner question in person, in Casa. No deck.</p>
            </div>
            <div className="item">
              <h4>The exit clause</h4>
              <p>If you leave airbcar, you leave with everything you brought, plus everything you built. No dark patterns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. MISSION CTA ── */}
      <section className="section mission-cta">
        <div className="container">
          <div className="mc-card reveal in">
            <div>
              <h2>Two roads<br />from <em>here</em>.</h2>
              <p>Whichever side of the steering wheel you're on, the country is closer than it looks. Pick the door that fits the trip.</p>
            </div>
            <div className="ctas">
              <div className="row flex gap-3">
                <button 
                  onClick={() => onNavigateTab('overview')} 
                  className="btn btn-cream btn-lg"
                >
                  I'm renting →
                </button>
                <button 
                  onClick={() => onSwitchRole ? onSwitchRole('partner') : onNavigateTab('saved-cars')} 
                  className="btn btn-gold btn-lg"
                >
                  I run an agency →
                </button>
              </div>
              <div className="row flex gap-3">
                <button 
                  onClick={() => onNavigateTab('overview')} 
                  className="btn btn-outline-light btn-lg"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => onNavigateTab('help')} 
                  className="btn btn-outline-light btn-lg"
                >
                  Help &amp; FAQ
                </button>
              </div>
              <div className="note">Or just say hi: salam@airbcar.com</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKETCH MODAL (ARCHIVE RECORD) ── */}
      {isSketchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f1611] text-[#ede4d3] border border-[#3d2b1f] max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsSketchModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 text-xs font-mono text-[#f95721] uppercase tracking-wider">
              <span>Archive Document 001</span>
              <span>•</span>
              <span>Hay Mohammadi Lot, Casablanca</span>
            </div>

            <h3 className="font-serif-display text-2xl font-bold text-white">
              The Borrowed Dacia · Tuesday, 14 Nov 2023
            </h3>

            <div className="p-4 rounded-xl bg-[#140e0b] border border-[#2b1e15] font-mono text-xs space-y-2 text-neutral-300">
              <div className="text-[#f95721] font-bold">VEHICLE LOG:</div>
              <div>Model: Dacia Logan 1.5 dCi</div>
              <div>Plate: 24-A-84910 (Casablanca Prefecture)</div>
              <div>Condition: "No spare tire in the trunk. 142,000 km. AC working. Handed over with paper carnet."</div>
              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
                Founders note: "Closed first booking test run to Rabat with Mehdi's own CIN. Realized then that foreign platforms were skimming 22% while agencies absorbed 100% of risk."
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsSketchModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#f95721] text-white font-semibold text-xs hover:bg-[#e04816] transition-colors"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
