import { Children, cloneElement, useEffect, useRef } from 'react';
import {
  AlertTriangle, BadgeCheck, BookOpen, Check,
  ChevronLeft, ChevronRight, Clock3, CreditCard, FileCheck2, FileQuestion,
  Gift, Layers3, ListChecks, Mail, MonitorSmartphone, SearchCheck,
  RefreshCcw, ShieldCheck, Smartphone, Target, Zap
} from 'lucide-react';
import { content } from './content.js';
import { comercial } from './comercial.js';

const painIcons = [Layers3, BookOpen, AlertTriangle, Smartphone, FileQuestion, Target];
const mechanismIcons = [SearchCheck, BookOpen, AlertTriangle, ListChecks];
const audienceIcons = [MonitorSmartphone, Clock3, Layers3, RefreshCcw, ListChecks];

function CTA({ label = 'QUERO O PACOTE COMPLETO', href = '#oferta', external = false }) {
  return <a className="btn" href={href} rel={external ? 'noopener noreferrer' : undefined}>{label}<span aria-hidden="true">→</span></a>;
}

function SectionTitle({ children, lead }) {
  return <header className="section-title"><h2>{children}</h2>{lead && <p>{lead}</p>}</header>;
}

function ProductComposition({ compact = false, minimal = false }) {
  return <div className={`product-composition master-mockup${compact ? ' product-composition--compact' : ''}${minimal ? ' product-composition--minimal' : ''}`} aria-label="Mockup do produto com mapas em três telas, material impresso e três bônus">
    <img className="master-mockup-image" src="/assets/mockups/mapas-pmal-tres-telas.webp" alt="Mockup dos 156 Mapas PM-AL em computador, tablet, celular, material impresso e três bônus" loading="lazy" />
  </div>;
}

function DeviceShowcase({ compact = false }) {
  return <div className={`device-showcase master-mockup${compact ? ' device-showcase--compact' : ''}`} aria-label="Mockup do produto com mapas em três telas, material impresso e três bônus">
    <img className="master-mockup-image" src="/assets/mockups/mapas-pmal-tres-telas.webp" alt="Mockup dos 156 Mapas PM-AL em computador, tablet, celular, material impresso e três bônus" fetchPriority="high" />
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

export default function App() {
  return <>
    <div className="urgency-bar"><Zap size={21} aria-hidden="true"/><strong>OFERTA ESPECIAL DISPONÍVEL POR POUCO TEMPO</strong></div>
    <main>
      <section className="hero"><div className="content content--900 hero-flow">
        <p className="hero-pill"><span aria-hidden="true" />{content.hero.badge}</p>
        <h1>{content.hero.titleBefore}<em>{content.hero.titleEmphasis}</em>{content.hero.titleAfter}</h1>
        <div className="hero-media hero-media--devices"><DeviceShowcase /></div>
        <p className="hero-sub">{content.hero.subtitle}</p>
        <CTA label="QUERO VER OS MAPAS" href="#previas" />
        <ul className="hero-bullets">{content.hero.bullets.map(item => <li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
        <div className="amplitude-line"><Layers3 size={22}/><p>{content.hero.amplitude}</p></div>
      </div></section>

      <section className="section pain"><div className="content content--880 section-flow">
        <SectionTitle>{content.pain.title}<br/>{content.pain.emphasis}</SectionTitle>
        <div className="ornament" aria-hidden="true"><span /></div>
        <div className="pain-grid">{content.pains.map((item,index)=>{const Icon=painIcons[index];return <div className="pain-chip" key={item}><Icon size={18}/><span>{item}</span></div>})}</div>
        <p className="bridge">{content.pain.bridge}</p>
      </div></section>

      <section className="section section--tint gallery" id="previas"><div className="content content--1180 section-flow">
        <SectionTitle lead="Confira como Português, Matemática, Informática, Alagoas e disciplinas jurídicas aparecem dentro do material final.">Veja páginas reais antes de decidir.</SectionTitle>
        <ScrollRail label="Páginas reais do material" className="gallery-rail" auto interval={2500}>{content.gallery.map(([src,alt])=><figure className="gallery-card" key={src}><img src={src} alt={alt} loading="lazy"/></figure>)}</ScrollRail>
        <p className="gallery-caption">Páginas reais da coleção. Arraste para conferir diferentes módulos.</p>
      </div></section>

      <section className="section mechanism"><div className="content content--1120 section-flow">
        <SectionTitle>Um mapa para cada bloco que precisa voltar à memória.</SectionTitle>
        <figure className="mechanism-proof"><img src="/assets/paginas/mapa-portugues.webp" alt="Página real de Língua Portuguesa com conceitos visuais" loading="lazy" /></figure>
        <div className="mechanism-grid">{content.mechanism.map(([title,text],index)=>{const Icon=mechanismIcons[index];return <article key={title}><span className="mechanism-icon"><Icon size={25}/></span><h3>{title}</h3><p>{text}</p></article>})}</div>
        <p className="mechanism-close">Sem montar outro resumo: abra o módulo, revise a página e volte às questões sabendo o que conferir.</p><CTA />
      </div></section>

      <section className="section mid-pitch"><div className="content content--1040 mid-pitch-grid">
        <div className="mid-pitch-media"><ProductComposition minimal /></div>
        <div className="mid-pitch-copy"><h2>Quantos assuntos você já estudou, mas ainda precisa procurar tudo de novo para revisar?</h2><p>Com os mapas, cada bloco do edital tem um módulo definido. Você abre a página, retoma os pontos-chave e volta às questões sabendo o que observar.</p><CTA /></div>
      </div></section>

      <section className="section usage" id="usos"><div className="content content--1180 section-flow">
        <figure className="usage-banner"><img src="/assets/uso/mapas-pmal-na-vida-real.webp" alt="Mapas PM-AL na vida real: candidato estudando no celular no ônibus, no tablet durante o intervalo, com mapas impressos na parede e no computador" loading="lazy" /></figure>
        <small className="usage-disclaimer">Cenas ilustrativas geradas para demonstrar formas de uso. As páginas exibidas são do material real.</small>
      </div></section>

      <section className="section audiences"><div className="content content--1180 section-flow">
        <header className="recognition-title"><p>PARA QUEM É</p><h2>Você vai se reconhecer se...</h2><span>Situações concretas mostram para quem esta revisão foi criada.</span></header>
        <div className="audience-grid">{content.audiences.map(([title,text],index)=>{const Icon=audienceIcons[index];return <article key={title}><span><Icon size={30}/></span><h3>{title}</h3><p>{text}</p></article>})}</div>
        <p className="audience-close">“Isso foi feito para a minha rotina.”</p>
      </div></section>

      <section className="section section--tint receive"><div className="content content--1000 section-flow">
        <SectionTitle>Todo o conteúdo de Soldado organizado para a sua revisão.</SectionTitle>
        <div className="receive-media"><ProductComposition compact /></div>
        <article className="receive-card"><p className="access-badge">156 MAPAS VISUAIS + {content.bonuses.length} BÔNUS</p><h3>156 Mapas da Aprovação: PM-AL Soldado</h3><p className="product-descriptor">18 leis e todas as matérias do edital, sem reler apostila</p><p>Uma coleção em 29 módulos para localizar, revisar e comparar os pontos previstos no edital, no celular ou em páginas A4 impressas.</p><ul>{content.benefits.map(item=><li key={item}><Check size={20}/><span>{item}</span></li>)}</ul></article>
      </div></section>

      <section className="section bonuses"><div className="content content--1040 section-flow">
        <header className="bonus-intro"><p>APOIOS PARA A SUA REVISÃO</p><h2>TRÊS BÔNUS REAIS E INCLUÍDOS</h2><span><Gift size={17}/>{content.bonuses.length} BÔNUS</span></header>
        <div className="bonus-grid">{content.bonuses.map(bonus=><article className="bonus-card" key={bonus.title}>
          <div className="bonus-card-top"><p className="bonus-num">{bonus.number}</p><BonusMockup bonus={bonus}/></div>
          <div className="bonus-card-body"><h3>{bonus.title}</h3><p>{bonus.text}</p><div className="bonus-gain"><Check size={18}/><span>{bonus.gain}</span></div><div className="bonus-price"><strong>INCLUÍDO</strong></div></div>
        </article>)}</div>
      </div></section>

      <section className="section offer" id="oferta"><div className="content content--720 section-flow">
        <SectionTitle>Tudo o que será liberado para você hoje</SectionTitle>
        <div className="value-stack" aria-label="Itens incluídos na oferta"><p>O QUE VOCÊ RECEBE</p><ul>
          <li><span>156 mapas visuais em 29 módulos</span><strong>INCLUÍDO</strong></li>
          {content.bonuses.map(bonus=><li key={bonus.title}><span>{bonus.title}</span><strong>INCLUÍDO</strong></li>)}
        </ul></div>
        <article className="plan-card">
          <p className="plan-badge">156 MAPAS + {content.bonuses.length} BÔNUS</p>
          <p className="plan-kicker">PACOTE COMPLETO</p><h3>156 Mapas da Aprovação: PM-AL Soldado</h3>
          <div className="plan-mockup"><ProductComposition compact /></div>
          <ul>{content.included.map(item=><li key={item}><Check size={20}/><span>{item}</span></li>)}</ul>
          <div className="price"><small>Pagamento único</small><strong>{comercial.price}</strong>{comercial.installments && <span>{comercial.installments}</span>}</div>
          <CTA label="QUERO ACESSAR OS 156 MAPAS" href={comercial.checkoutUrl} external />
          <div className="payment-trust"><span><CreditCard size={18}/>Pagamento pela Kiwify</span><span><ShieldCheck size={18}/>Garantia de 7 dias</span><span><BadgeCheck size={18}/>Acesso após aprovação</span></div>
        </article>
        <p className="offer-close">Pagamento único. Sem mensalidade informada.</p>
      </div></section>

      <section className="section purchase-safety"><div className="content content--1000 safety-layout">
        <article className="guarantee-card"><ShieldCheck size={54}/><h2>Você tem 7 dias para avaliar</h2><p>{comercial.guarantee}</p></article>
        <div className="safety-cards"><article><CreditCard size={30}/><div><h3>Pagamento pela Kiwify</h3><p>O checkout informado para esta oferta é processado pela plataforma Kiwify.</p></div></article><article><FileCheck2 size={30}/><div><h3>Conteúdo alinhado ao edital</h3><p>Os 29 módulos foram conferidos contra as matérias indicadas para o cargo de Soldado.</p></div></article></div>
      </div></section>

      <section className="section section--tint access-steps"><div className="content content--980 section-flow">
        <SectionTitle>Como funciona depois do pagamento</SectionTitle>
        <div className="steps-grid"><article><span>1</span><CreditCard/><h3>Conclua o pagamento</h3><p>Use Pix ou cartão no checkout da Kiwify.</p></article><article><span>2</span><Mail/><h3>Receba o acesso</h3><p>{comercial.access}</p></article><article><span>3</span><MonitorSmartphone/><h3>Abra o primeiro módulo</h3><p>Consulte no celular, computador ou imprima as páginas A4.</p></article></div>
        <CTA />
      </div></section>

      <section className="section faq"><div className="content content--780 section-flow"><SectionTitle>Perguntas frequentes</SectionTitle><div className="faq-list">{content.faqs.map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>

      <section className="closing"><div className="content content--820 closing-inner"><p>PROVAS OBJETIVA E DISCURSIVA EM {comercial.examDate}</p><h2>Domine o edital da PM-AL Soldado e <em>conquiste sua vaga na carreira policial militar.</em></h2><CTA/><small>Material digital em PDF. Pagamento único de {comercial.price}.</small></div></section>
    </main>
    <footer className="footer"><div className="footer-inner"><p>Suporte: <a href={`mailto:${comercial.supportEmail}`}>{comercial.supportEmail}</a></p><p className="footer-legal">Material de estudo independente, sem vínculo com a PMAL, o Cebraspe ou o Governo de Alagoas. Resultados dependem da preparação e do desempenho individual.</p><p>{comercial.company}</p><p><a href={comercial.termsUrl}>Termos de uso</a> · <a href={comercial.privacyUrl}>Política de privacidade</a></p></div></footer>
  </>;
}
