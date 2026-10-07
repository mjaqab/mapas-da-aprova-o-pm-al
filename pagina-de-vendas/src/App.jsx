import { Children, cloneElement, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, BadgeCheck, BookOpen, Check,
  ChevronLeft, ChevronRight, Clock3, CreditCard, FileCheck2, FileQuestion,
  Gift, Layers3, ListChecks, Mail, MonitorSmartphone, SearchCheck,
  RefreshCcw, ShieldCheck, Smartphone, Target
} from 'lucide-react';
import { content } from './content.js';
import { comercial } from './comercial.js';

const painIcons = [Layers3, BookOpen, AlertTriangle, Smartphone, FileQuestion, Target];
const mechanismIcons = [SearchCheck, BookOpen, AlertTriangle, ListChecks];
const audienceIcons = [MonitorSmartphone, Clock3, Layers3, RefreshCcw, ListChecks];
const mainMockup = '/assets/mockups/mapas-pmal-265-mapas.webp';
const clientPhotos = [
  '/assets/clientes/cliente-01.webp',
  '/assets/clientes/cliente-02.webp',
  '/assets/clientes/cliente-03.webp',
  '/assets/clientes/cliente-04.webp',
  '/assets/clientes/cliente-05.webp'
];

function CTA({ label = 'QUERO O PACOTE COMPLETO', href = '#oferta', external = false }) {
  return <a className="btn" href={href} rel={external ? 'noopener noreferrer' : undefined}>{label}<span aria-hidden="true">→</span></a>;
}

function SectionTitle({ children, lead }) {
  return <header className="section-title"><h2>{children}</h2>{lead && <p>{lead}</p>}</header>;
}

function ProofStrip() {
  return <div className="proof-strip" aria-label="Clientes e cobertura do material">
    <div className="proof-thumbnails" aria-hidden="true">
      {clientPhotos.map((src, index) => <img src={src} alt="" key={src} loading={index ? 'lazy' : 'eager'} />)}
    </div>
    <p>Todo o edital de Soldado, <strong>com mais de 260 mapas, as 18 leis e 4 bônus.</strong></p>
  </div>;
}

function ProductComposition({ compact = false, minimal = false }) {
  return <div className={`product-composition master-mockup${compact ? ' product-composition--compact' : ''}${minimal ? ' product-composition--minimal' : ''}`} aria-hidden="true">
    <img className="master-mockup-image" src={mainMockup} alt="" loading="lazy" />
  </div>;
}

function DeviceShowcase({ compact = false }) {
  return <div className={`device-showcase master-mockup${compact ? ' device-showcase--compact' : ''}`}>
    <img className="master-mockup-image" src={mainMockup} alt="Mockup do material Mapas PM-AL Soldado 2026 com 265 mapas visuais, 28 módulos e quatro bônus" fetchPriority="high" />
  </div>;
}

function UsageVisual({ device, image, imageSecondary, alt, altSecondary, photo, sceneAlt }) {
  return <div className={`usage-visual usage-visual--${device}`}>
    <img className="usage-photo" src={photo} alt={sceneAlt} loading="lazy" />
    <img className="usage-map" src={image} alt={alt} loading="lazy" />
    {imageSecondary && <img className="usage-map usage-map--secondary" src={imageSecondary} alt={altSecondary} loading="lazy" />}
    <span className="usage-rays" aria-hidden="true" />
  </div>;
}

function ScrollRail({ children, label, className = '', auto = false, interval = 2800 }) {
  const ref = useRef(null);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const normalizeTimerRef = useRef(null);
  const items = Children.toArray(children);
  const renderedItems = auto ? [...items, ...items.map((child, index) => cloneElement(child, { key: `loop-${index}`, 'aria-hidden': true }))] : items;

  const cycleWidth = () => {
    const rail = ref.current;
    if (!rail || rail.children.length <= items.length) return 0;
    return rail.children[items.length].offsetLeft - rail.children[0].offsetLeft;
  };

  const normalize = () => {
    const rail = ref.current;
    const width = cycleWidth();
    if (rail && width && rail.scrollLeft >= width) rail.scrollLeft -= width;
  };

  const pauseTemporarily = () => {
    pausedRef.current = true;
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => { pausedRef.current = false; }, 4200);
  };

  const move = direction => {
    const rail = ref.current;
    if (!rail) return;
    pauseTemporarily();
    const width = cycleWidth();
    if (direction < 0 && width && rail.scrollLeft <= 2) rail.scrollLeft = width;
    rail.scrollBy({ left: direction * rail.clientWidth * .82, behavior: 'smooth' });
    window.clearTimeout(normalizeTimerRef.current);
    normalizeTimerRef.current = window.setTimeout(normalize, 700);
  };

  useEffect(() => {
    if (!auto || !ref.current) return undefined;
    const rail = ref.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; }, { threshold: .18 });
    observer.observe(rail);
    const timer = window.setInterval(() => {
      if (reduceMotion.matches || pausedRef.current || !visibleRef.current || document.hidden) return;
      const first = rail.children[0];
      const second = rail.children[1];
      const step = second ? second.offsetLeft - first.offsetLeft : rail.clientWidth * .82;
      rail.scrollBy({ left: step, behavior: 'smooth' });
      window.clearTimeout(normalizeTimerRef.current);
      normalizeTimerRef.current = window.setTimeout(normalize, 700);
    }, interval);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(resumeTimerRef.current);
      window.clearTimeout(normalizeTimerRef.current);
    };
  }, [auto, interval, items.length]);

  return <div className={`rail-stage ${className}`}>
    <button type="button" className="rail-arrow rail-arrow--left" onClick={() => move(-1)} aria-label={`Ver anteriores em ${label}`}><ChevronLeft /></button>
    <div className={`rail${auto ? ' rail--loop' : ''}`} ref={ref} tabIndex="0" aria-label={label}
      onKeyDown={event => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); }}
      onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; }}
      onFocus={() => { pausedRef.current = true; }} onBlur={() => { pausedRef.current = false; }}
      onPointerDown={() => { pausedRef.current = true; }} onPointerUp={pauseTemporarily} onTouchEnd={pauseTemporarily}>
      {renderedItems}
    </div>
    <button type="button" className="rail-arrow rail-arrow--right" onClick={() => move(1)} aria-label={`Ver próximos em ${label}`}><ChevronRight /></button>
  </div>;
}

function BonusMockup({ bonus }) {
  return <div className="bonus-mockup" aria-label={`Páginas reais do ${bonus.title}`}>
    <img className="bonus-mockup-page" src={bonus.page} alt="" aria-hidden="true" loading="lazy" />
    <img className="bonus-mockup-cover" src={bonus.image} alt={`Capa real do ${bonus.title}`} loading="lazy" />
  </div>;
}

function getDaysUntilExam() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const today = Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day));
  const exam = Date.UTC(2027, 0, 17);
  return Math.ceil((exam - today) / 86400000);
}

function UrgencyBar() {
  const [days, setDays] = useState(getDaysUntilExam);

  useEffect(() => {
    const timer = window.setInterval(() => setDays(getDaysUntilExam()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  if (days <= 0) {
    return <a className="urgency-bar" href="#oferta">SOLDADO PM-AL 2026 • SUA FARDA COMEÇA AQUI</a>;
  }

  const fullLead = days === 1 ? 'FALTA' : 'FALTAM';
  const fullUnit = days === 1 ? 'DIA' : 'DIAS';
  return <a className="urgency-bar" href="#oferta" aria-label={`${fullLead} ${days} ${fullUnit} PARA A PROVA • SUA FARDA COMEÇA AQUI`}>
    <span className="urgency-copy urgency-copy--full">{fullLead} <strong>{days}</strong> {fullUnit} PARA A PROVA • SUA FARDA COMEÇA AQUI</span>
    <span className="urgency-copy urgency-copy--short">{fullLead} <strong>{days}</strong> {fullUnit} • SUA FARDA COMEÇA AQUI</span>
  </a>;
}

export default function App() {
  return <>
    <UrgencyBar />
    <main>
      <section className="hero"><div className="content content--900 hero-flow">
        <p className="hero-pill"><span aria-hidden="true" />{content.hero.badge}</p>
        <h1>{content.hero.titleBefore}<em>{content.hero.titleEmphasis}</em>{content.hero.titleAfter}</h1>
        <div className="hero-media hero-media--devices"><DeviceShowcase /></div>
        <p className="hero-sub">{content.hero.subtitle}</p>
        <CTA label="QUERO VER OS MAPAS" href="#previas" />
        <ProofStrip />
        <ul className="hero-bullets">{content.hero.bullets.map(item => <li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
        <div className="amplitude-line"><Layers3 size={22}/><p>{content.hero.amplitude}</p></div>
      </div></section>

      <section className="section pain"><div className="content content--880 section-flow">
        <SectionTitle>{content.pain.title}<br/>{content.pain.emphasis}</SectionTitle>
        <div className="ornament" aria-hidden="true"><span /></div>
        <div className="pain-grid">{content.pains.map((item,index)=>{const Icon=painIcons[index];return <div className="pain-chip" key={item}><Icon size={18}/><span>{item}</span></div>})}</div>
        <p className="bridge">{content.pain.bridge}</p>
      </div></section>

      <section className="section section--tint differential"><div className="content content--1040 section-flow">
        <SectionTitle lead="Veja o que muda quando o material é feito a partir do edital, e não de um resumo genérico.">Não é mais um resumo. É a lei do edital, mapa por mapa.</SectionTitle>
        <div className="comparison" role="table" aria-label="Comparação entre resumo genérico e Mapas da Aprovação">
          <div className="comparison-head comparison-head--generic" role="columnheader">Resumo genérico</div>
          <div className="comparison-head comparison-head--maps" role="columnheader">Mapas da Aprovação</div>
          {content.comparison.map(([generic,maps]) => <div className="comparison-row" role="row" key={generic}>
            <div className="comparison-cell comparison-cell--generic" role="cell"><AlertTriangle size={19}/><span>{generic}</span></div>
            <div className="comparison-cell comparison-cell--maps" role="cell"><Check size={20}/><span>{maps}</span></div>
          </div>)}
        </div>
        <article className="date-cut"><p>RECORTE 18.32</p><h3>Por que a data importa?</h3><span>O edital diz, no item 18.32, que vale a legislação vigente na data da primeira publicação: 20/03/2026. Leis que saíram depois disso não caem nesta prova. A Lei Maria da Penha, por exemplo, foi alterada várias vezes depois dessa data. Nossos mapas seguem o texto que vale para a sua prova, nem mais nem menos.</span></article>
      </div></section>

      <section className="section section--tint gallery" id="previas"><div className="content content--1180 section-flow">
        <SectionTitle lead="Arraste para ver mapas de diferentes leis.">Veja páginas reais antes de decidir.</SectionTitle>
        <ScrollRail label="Páginas reais do material" className="gallery-rail" auto interval={2500}>{content.gallery.map(([src, alt])=><figure className="gallery-card" key={src}><img src={src} alt={alt} loading="lazy" /></figure>)}</ScrollRail>
      </div></section>

      <section className="section mechanism"><div className="content content--1120 section-flow">
        <SectionTitle>Um mapa, uma parte da lei. Tudo conectado.</SectionTitle>
        <figure className="mechanism-proof"><img src="/assets/paginas/mapa-estatuto-v2.webp" alt="Mapa real do Estatuto dos Policiais Militares de Alagoas" loading="lazy" /></figure>
        <div className="mechanism-grid">{content.mechanism.map(([title,text],index)=>{const Icon=mechanismIcons[index];return <article key={title}><span className="mechanism-icon"><Icon size={25}/></span><h3>{title}</h3><p>{text}</p></article>})}</div>
        <p className="mechanism-close">Abra o módulo, revise o mapa e volte às questões sabendo exatamente o que conferir.</p><CTA />
      </div></section>

      <section className="section mid-pitch"><div className="content content--1040 mid-pitch-grid">
        <div className="mid-pitch-media"><ProductComposition minimal /></div>
        <div className="mid-pitch-copy"><h2>Quantas vezes você já leu a mesma lei e, na questão, ficou em dúvida?</h2><p>Com os mapas, cada lei do edital tem o seu módulo. Você abre, revisa os cards e responde sabendo de qual artigo saiu a resposta.</p><CTA /></div>
      </div></section>

      <section className="section usage" id="usos"><div className="content content--1180 section-flow">
        <figure className="usage-banner"><img src="/assets/uso/mapas-pmal-na-vida-real.webp" alt="Mapas PM-AL na vida real: candidato estudando no celular no ônibus, no tablet durante o intervalo, com mapas impressos na parede e no computador" loading="lazy" /></figure>
        <small className="usage-disclaimer">Cenas ilustrativas geradas para demonstrar formas de uso. As páginas exibidas são do material real.</small>
      </div></section>

      <section className="section audiences"><div className="content content--1180 section-flow">
        <header className="recognition-title"><p>PARA QUEM É</p><h2>Você vai se reconhecer se...</h2></header>
        <div className="audience-grid">{content.audiences.map(([title,text],index)=>{const Icon=audienceIcons[index];return <article key={title}><span><Icon size={30}/></span><h3>{title}</h3><p>{text}</p></article>})}</div>
        <p className="audience-close">“Isso foi feito para a minha rotina.”</p>
      </div></section>

      <section className="section section--tint receive"><div className="content content--1000 section-flow">
        <div className="receive-media"><ProductComposition compact /></div>
        <article className="receive-card"><p className="access-badge">MAIS DE 260 MAPAS • TODO O EDITAL DE SOLDADO + 4 BÔNUS</p><h3>Mapas da Aprovação: PM-AL Soldado</h3><p className="product-descriptor">Mais de 260 mapas ilustrados. Só a Legislação tem 141 mapas e 842 cards.</p><h4>Lista dos módulos de Legislação</h4><ul className="module-list">{content.legislationModules.map(item=><li key={item}><Check size={18}/><span>{item}</span></li>)}</ul><div className="also-included"><h4>Também incluído</h4><ul className="additional-subjects">{content.additionalSubjects.map(item=><li key={item}><Check size={18}/><span>{item}</span></li>)}</ul><p className="same-format">Todos no mesmo formato de mapas ilustrados.</p><h4>Formato</h4><p>Feito para ler no celular, e em A4 para imprimir.</p></div></article>
      </div></section>

      <section className="section bonuses"><div className="content content--1040 section-flow">
        <header className="bonus-intro"><p>APOIOS PARA A SUA REVISÃO</p><h2>QUATRO BÔNUS INCLUÍDOS</h2><span><Gift size={17}/>{content.bonuses.length} BÔNUS</span></header>
        <ScrollRail label="Quatro bônus incluídos" className="bonus-rail">{content.bonuses.map(bonus=><article className="bonus-card" key={bonus.title}>
          <div className="bonus-card-top"><p className="bonus-num">{bonus.number}</p><BonusMockup bonus={bonus}/></div>
          <div className="bonus-card-body"><h3>{bonus.title}</h3><p>{bonus.text}</p><div className="bonus-gain"><Check size={18}/><span>{bonus.gain}</span></div><div className="bonus-price"><strong>INCLUÍDO</strong></div></div>
        </article>)}</ScrollRail>
      </div></section>

      <section className="section offer" id="oferta"><div className="content content--720 section-flow">
        <SectionTitle>Tudo o que será liberado para você hoje</SectionTitle>
        <div className="value-stack" aria-label="Itens incluídos na oferta"><p>O QUE VOCÊ RECEBE</p><ul>
          {content.releaseSummary.map(item=><li key={item}><span>{item}</span><strong>INCLUÍDO</strong></li>)}
        </ul></div>
        <article className="plan-card">
          <p className="plan-badge">PACOTE COMPLETO</p>
          <h3>Mapas da Aprovação: PM-AL Soldado</h3>
          <div className="plan-mockup"><ProductComposition compact /></div>
          <ul>{content.included.map(item=><li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
          <div className="price"><small>Pagamento único</small><strong>{comercial.price}</strong>{comercial.installments && <span>{comercial.installments}</span>}</div>
          <CTA label="QUERO ACESSAR OS MAPAS" href={comercial.checkoutUrl} external />
          <div className="payment-trust"><span><CreditCard size={18}/>Pagamento pela Kiwify</span><span><ShieldCheck size={18}/>Garantia de 7 dias</span><span><BadgeCheck size={18}/>Acesso após aprovação</span></div>
        </article>
      </div></section>

      <section className="section purchase-safety"><div className="content content--1000 safety-layout">
        <article className="guarantee-card"><ShieldCheck size={54}/><h2>Você tem 7 dias para avaliar</h2><p>{comercial.guarantee}</p></article>
        <div className="safety-cards"><article><CreditCard size={30}/><div><h3>Pagamento pela Kiwify</h3><p>O checkout informado para esta oferta é processado pela plataforma Kiwify.</p></div></article><article><FileCheck2 size={30}/><div><h3>Feito a partir do edital, item por item</h3><p>Cada módulo foi montado a partir do conteúdo programático de Soldado e conferido com o texto da lei vigente em 20/03/2026, como manda o item 18.32 do edital.</p></div></article></div>
      </div></section>

      <section className="section section--tint access-steps"><div className="content content--980 section-flow">
        <SectionTitle>Como funciona depois do pagamento</SectionTitle>
        <div className="steps-grid"><article><span>1</span><CreditCard/><h3>Conclua o pagamento</h3><p>Use Pix ou cartão no checkout da Kiwify.</p></article><article><span>2</span><Mail/><h3>Receba o acesso</h3><p>Por e-mail e pela área de membros da Kiwify, assim que o pagamento for aprovado.</p></article><article><span>3</span><MonitorSmartphone/><h3>Abra o primeiro módulo</h3><p>No celular, no computador ou impresso em A4.</p></article></div>
        <CTA />
      </div></section>

      <section className="section faq"><div className="content content--780 section-flow"><SectionTitle>Perguntas frequentes</SectionTitle><div className="faq-list">{content.faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <section className="closing"><div className="content content--820 closing-inner"><p>PROVAS OBJETIVA E DISCURSIVA EM {comercial.examDate}</p><h2>Chegue na prova sabendo de qual artigo saiu cada resposta.</h2><CTA/><small>Material digital em PDF. Pagamento único de {comercial.price}.</small></div></section>
    </main>
    <footer className="footer"><div className="footer-inner"><p>Suporte: <a href={`mailto:${comercial.supportEmail}`}>{comercial.supportEmail}</a></p><p className="footer-legal">Material de estudo independente, sem vínculo com a PMAL, o Cebraspe ou o Governo de Alagoas. Resultados dependem da preparação e do desempenho individual.</p><p>{comercial.company}</p><p><a href={comercial.termsUrl}>Termos de uso</a> · <a href={comercial.privacyUrl}>Política de privacidade</a></p></div></footer>
  </>;
}
