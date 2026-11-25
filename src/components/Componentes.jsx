import React, { useState, useEffect, useRef } from 'react';
import { MapPin, BookOpen, Maximize, Bed, LayoutGrid, Clock, ChevronLeft, ChevronRight, X, Download, Bus } from 'lucide-react';
import { LOGOS_EMPREENDIMENTO, REVISTA_LOGO_MAP } from '../data/dados.js';

// ── RippleButton ────────────────────────────────────────────────
export function RippleButton({ onClick, className, children, style }) {
    const btnRef = useRef(null);
    const handleClick = (e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(0);width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.35);animation:ripple-anim 0.55s ease-out forwards;pointer-events:none;`;
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
        onClick?.(e);
    };
    return (
        <button ref={btnRef} className={`${className || ''} hw-btn`} style={{ ...style, position: 'relative', overflow: 'hidden' }} onClick={handleClick}>
            {children}
        </button>
    );
}

// ── BannerExpandido ──────────────────────────────────────────────
function BannerExpandido({ revista, onClose, modoNoturno, onVerRevista, onVerPois, onVerOnibus }) {
    const [phase, setPhase] = useState('entering');
    const [fotos, setFotos] = useState([revista.cover]);
    const checkedRef = useRef(false);
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    useEffect(() => {
        if (checkedRef.current) return;
        checkedRef.current = true;
        (revista.fotosExtras || []).forEach(url => {
            const img = new Image();
            img.referrerPolicy = 'no-referrer';
            img.onload = () => setFotos(prev => prev.includes(url) ? prev : [...prev, url]);
            img.src = url;
        });
    }, []);

    const [idx, setIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState(null);
    const [dir, setDir] = useState(null);
    const sliding = useRef(false);
    const touchStartX = useRef(null);

    const goTo = (newIdx, d) => {
        if (sliding.current || newIdx === idx) return;
        sliding.current = true;
        setPrevIdx(idx); setDir(d); setIdx(newIdx);
        setTimeout(() => { setPrevIdx(null); setDir(null); sliding.current = false; }, 380);
    };
    const goPrev = (e) => { e.stopPropagation(); goTo((idx - 1 + fotos.length) % fotos.length, 'right'); };
    const goNext = (e) => { e.stopPropagation(); goTo((idx + 1) % fotos.length, 'left'); };
    const goDot  = (i, e) => { e.stopPropagation(); if (i !== idx) goTo(i, i > idx ? 'left' : 'right'); };

    const isDir = revista.brand === 'Direcional';
    const accent     = isDir ? '#2563eb' : '#007aff';
    const accentDark = isDir ? '#1e40af' : '#084d73';
    const bg      = modoNoturno ? '#0f172a' : '#ffffff';
    const bgSub   = modoNoturno ? '#1e293b' : '#f1f5f9';
    const text    = modoNoturno ? '#f1f5f9' : '#1e293b';
    const sub     = modoNoturno ? '#94a3b8' : '#64748b';
    const divider = modoNoturno ? '#1e293b' : '#e2e8f0';

    const triggerClose = () => { setPhase('out'); setTimeout(onClose, 280); };

    useEffect(() => {
        const r1 = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')));
        const onKey = (e) => {
            if (e.key === 'Escape') { triggerClose(); return; }
            if (e.key === 'ArrowLeft')  { goPrev(Object.assign(new Event('k'), { stopPropagation: () => {} })); return; }
            if (e.key === 'ArrowRight') { goNext(Object.assign(new Event('k'), { stopPropagation: () => {} })); return; }
        };
        window.addEventListener('keydown', onKey);
        return () => { cancelAnimationFrame(r1); window.removeEventListener('keydown', onKey); };
    }, [idx]);

    const Chip = ({ icon, label }) => (
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99,
            background:bgSub, border:`1px solid ${divider}`, color:sub, fontSize:12, fontWeight:600 }}>
            <span style={{ color:accent, display:'flex', alignItems:'center' }}>{icon}</span>{label}
        </div>
    );

    const outX = dir === 'left' ? '-100%' : '100%';
    const DUR = '0.38s';
    const EASE = 'cubic-bezier(0.4,0,0.2,1)';

    return (
        <>
            <div onClick={triggerClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(0,0,0,0.48)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', opacity: phase === 'in' ? 1 : 0, transition: phase === 'entering' ? 'none' : 'opacity 0.28s ease' }}/>
            <div style={{ position:'fixed', inset:0, zIndex:201, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', pointerEvents:'none' }}>
                <div onMouseLeave={!isMobile ? triggerClose : undefined} onClick={e => e.stopPropagation()} style={{ pointerEvents:'auto', width:'100%', maxWidth:1160, height:'min(90vh, 720px)', borderRadius:26, overflow:'hidden', display:'flex', background:bg, boxShadow:'0 32px 100px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.20)', opacity: phase === 'in' ? 1 : 0, transform: phase === 'in' ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(28px)', transition: phase === 'entering' ? 'none' : `opacity 0.32s cubic-bezier(0.22,1,0.36,1), transform 0.32s cubic-bezier(0.22,1,0.36,1)` }}>
                    <div style={{ flex:'0 0 58%', position:'relative', overflow:'hidden' }}
                        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
                        onTouchEnd={e => {
                            if (touchStartX.current === null) return;
                            const diff = e.changedTouches[0].clientX - touchStartX.current;
                            if (Math.abs(diff) > 40) {
                                const fakeE = { stopPropagation: () => {} };
                                if (diff > 0) goPrev(fakeE); else goNext(fakeE);
                            }
                            touchStartX.current = null;
                        }}
                    >
                        {dir && prevIdx !== null && (<img key={`out-${prevIdx}`} src={fotos[prevIdx]} referrerPolicy="no-referrer" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform:`translateX(${outX})`, transition:`transform ${DUR} ${EASE}`, zIndex:1 }}/>)}
                        <img key={`in-${idx}`} src={fotos[idx]} referrerPolicy="no-referrer" alt={revista.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', animation: dir ? `slideIn-${dir} ${DUR} ${EASE} forwards` : 'none', zIndex:2 }}/>
                        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3, background:'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)' }}/>
                        {(() => {
                            const logoKey = REVISTA_LOGO_MAP[revista.id];
                            const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null;
                            if (!logoSrc) return null;
                            return (<div style={{ position:'absolute', top:16, left:16, zIndex:6, width:150, height:90, display:'flex', alignItems:'flex-start', justifyContent:'flex-start' }}><img src={logoSrc} alt={revista.title} style={{ maxHeight: logoKey === 'brisas' ? 76 : 88, maxWidth: logoKey === 'brisas' ? 148 : 145, width:'auto', height:'auto', objectFit:'contain', objectPosition:'top left', filter:'drop-shadow(0 0 10px rgba(0,0,0,0.95)) drop-shadow(0 3px 16px rgba(0,0,0,0.8)) drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}/></div>);
                        })()}
                        {fotos.length > 1 && (<>
                            <button onClick={goPrev} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', zIndex:7, width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(0,0,0,0.36)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.62)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.36)'}><ChevronLeft size={20} color="#fff"/></button>
                            <button onClick={goNext} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', zIndex:7, width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(0,0,0,0.36)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.62)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0.36)'}><ChevronRight size={20} color="#fff"/></button>
                            <div style={{ position:'absolute', bottom:18, left:0, right:0, display:'flex', justifyContent:'center', gap:5, zIndex:7 }}>
                                {fotos.map((_,i) => <button key={i} onClick={e=>goDot(i,e)} style={{ width:i===idx?22:6, height:6, borderRadius:99, padding:0, border:'none', cursor:'pointer', background:i===idx?'#fff':'rgba(255,255,255,0.36)', transition:'width 0.25s, background 0.25s' }}/>)}
                            </div>
                        </>)}
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'0 24px 24px', zIndex:5 }}>
                            <h2 style={{ margin:0, fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.2, textShadow:'0 2px 14px rgba(0,0,0,0.6)' }}>{revista.title}</h2>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:6 }}><MapPin size={13} color="rgba(255,255,255,0.68)"/><span style={{ fontSize:13, color:'rgba(255,255,255,0.76)', fontWeight:500 }}>{revista.region}</span></div>
                        </div>
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                        <div style={{ padding:'22px 24px 14px', borderBottom:`1px solid ${divider}`, flexShrink:0 }}>
                            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:text, lineHeight:1.2 }}>{revista.title}</h3>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:5 }}><MapPin size={12} color={accent}/><span style={{ fontSize:12, color:sub, fontWeight:500 }}>{revista.region}</span></div>
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'14px 24px 12px', borderBottom:`1px solid ${divider}`, flexShrink:0 }}>
                            <Chip icon={<Maximize size={12}/>} label={revista.size}/>
                            <Chip icon={<Bed size={12}/>} label={revista.bedrooms}/>
                            <Chip icon={<LayoutGrid size={12}/>} label={revista.flooring}/>
                            {revista.entrega && <Chip icon={<Clock size={12}/>} label={revista.entrega === 'Entregue' ? '✅ Entregue' : `Entrega ${revista.entrega}`}/>}
                        </div>
                        <div style={{ flex:1, overflowY:'auto', padding:'14px 24px 10px', scrollbarWidth:'thin' }}>
                            {revista.pois?.length > 0 && (<>
                                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:10 }}><MapPin size={11} color={accent}/><span style={{ fontSize:10, fontWeight:800, color:sub, textTransform:'uppercase', letterSpacing:'0.12em' }}>Pontos de referência</span></div>
                                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                                    {revista.pois.map((poi,i) => (<div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9 }}><div style={{ width:6, height:6, borderRadius:'50%', background:accent, flexShrink:0, marginTop:5 }}/><span style={{ fontSize:13, color:text, lineHeight:1.45 }}>{poi}</span></div>))}
                                </div>
                            </>)}
                        </div>
                        <div style={{ padding:'14px 24px 20px', display:'flex', flexDirection:'column', gap:9, flexShrink:0, borderTop:`1px solid ${divider}` }}>
                            <div style={{ display:'flex', gap:8, alignItems:'stretch' }}>
                                <button onClick={()=>{triggerClose();setTimeout(onVerRevista,300);}} style={{ flex:1, padding:'13px 0', borderRadius:16, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:accent, color:'#fff', fontSize:14, fontWeight:800, boxShadow:`0 4px 16px ${accent}44`, transition:'background 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.background=accentDark;e.currentTarget.style.transform='scale(1.01)';}} onMouseLeave={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.transform='scale(1)';}}>
                                    <BookOpen size={16}/> Ver Revista Digital
                                </button>
                                <button onClick={(e)=>{ e.preventDefault(); const match = revista.link.match(/\/d\/([a-zA-Z0-9_-]+)/); if(match){ window.open(`https://drive.google.com/uc?export=download&id=${match[1]}`,'_blank'); } else { window.open(revista.link,'_blank'); } }} title="Baixar revista" style={{ flexShrink:0, width:48, height:48, alignSelf:'center', borderRadius:'50%', border:`1.5px solid ${accent}55`, display:'flex', alignItems:'center', justifyContent:'center', background:`${accent}18`, color:accent, cursor:'pointer', transition:'background 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.background=`${accent}30`;e.currentTarget.style.transform='scale(1.08)';}} onMouseLeave={e=>{e.currentTarget.style.background=`${accent}18`;e.currentTarget.style.transform='scale(1)';}}>
                                    <Download size={18}/>
                                </button>
                            </div>
                            <button onClick={()=>{triggerClose();setTimeout(onVerPois,300);}} style={{ width:'100%', padding:'11px 0', borderRadius:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'transparent', border:`1.5px solid ${divider}`, color:sub, fontSize:13, fontWeight:700, transition:'border-color 0.15s, color 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;e.currentTarget.style.transform='scale(1.01)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor=divider;e.currentTarget.style.color=sub;e.currentTarget.style.transform='scale(1)';}}>
                                <MapPin size={14} color="#f43f5e"/> Ver pontos de referência
                            </button>
                            <button onClick={()=>{triggerClose();setTimeout(()=>onVerOnibus && onVerOnibus(),300);}} style={{ width:'100%', padding:'11px 0', borderRadius:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'transparent', border:`1.5px solid ${divider}`, color:sub, fontSize:13, fontWeight:700, transition:'border-color 0.15s, color 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor='#16a34a';e.currentTarget.style.color='#16a34a';e.currentTarget.style.transform='scale(1.01)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor=divider;e.currentTarget.style.color=sub;e.currentTarget.style.transform='scale(1)';}}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M3 9h18M8 21l2-5M16 21l-2-5M7 16h10"/><circle cx="7.5" cy="13" r="0.5" fill="#16a34a"/><circle cx="16.5" cy="13" r="0.5" fill="#16a34a"/></svg>
                                Linhas de ônibus próximas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── ObraTaxaModal ──────────────────────────────────────────────────
function ObraTaxaModal({ revista, onClose, modoNoturno }) {
    const [parcela, setParcela] = useState('');
    const accent = '#007aff';
    const bg      = modoNoturno ? '#0f172a' : '#ffffff';
    const text    = modoNoturno ? '#f1f5f9' : '#1e293b';
    const sub     = modoNoturno ? '#94a3b8' : '#64748b';
    const bgSub   = modoNoturno ? '#1e293b' : '#f8fafc';
    const divider = modoNoturno ? '#1e293b' : '#e2e8f0';
    const pct = typeof revista.obraPercent === 'number' ? revista.obraPercent : 0;

    const parcelaNum = parseFloat(String(parcela || '').replace(/\./g, '').replace(',', '.')) || 0;
    const taxaCalculada = parcelaNum > 0 ? Math.max((pct / 100) * parcelaNum, 170) : null;

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <>
            <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)' }}/>
            <div style={{ position:'fixed', inset:0, zIndex:301, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
                <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:340, borderRadius:22, background:bg, boxShadow:'0 24px 64px rgba(0,0,0,0.35)', overflow:'hidden' }}>
                    <div style={{ padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${divider}` }}>
                        <span style={{ fontSize:14, fontWeight:800, color:text }}>Taxa de Obra</span>
                        <button onClick={onClose} style={{ border:'none', background:'transparent', cursor:'pointer', color:sub, display:'flex' }}><X size={18}/></button>
                    </div>
                    <div style={{ padding:'22px 18px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:sub, textTransform:'uppercase', letterSpacing:'0.08em' }}>Obra em andamento</span>
                        <span style={{ fontSize:46, fontWeight:900, color:accent, lineHeight:1 }}>{Math.round(pct)}%</span>
                        <span style={{ fontSize:12, color:sub, textAlign:'center' }}>{revista.title}</span>
                    </div>
                    <div style={{ padding:'4px 18px 20px' }}>
                        <div style={{ fontSize:12, fontWeight:800, color:text, marginBottom:10, textAlign:'center' }}>Simular taxa de obra</div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, background:bgSub, border:`1px solid ${divider}`, borderRadius:14, padding:'10px 12px' }}>
                            <span style={{ fontSize:13, fontWeight:700, color:sub }}>R$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="Valor da parcela de financiamento"
                                value={parcela}
                                onChange={e => setParcela(e.target.value)}
                                style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontWeight:700, color:text }}
                            />
                        </div>
                        {taxaCalculada !== null && (
                            <div style={{ marginTop:14, padding:'12px 14px', borderRadius:14, background: modoNoturno ? `${accent}22` : `${accent}12`, border:`1px solid ${accent}44`, textAlign:'center' }}>
                                <div style={{ fontSize:11, fontWeight:700, color:sub, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Taxa de obra estimada</div>
                                <div style={{ fontSize:22, fontWeight:900, color:accent }}>
                                    R$ {taxaCalculada.toLocaleString('pt-BR', { minimumFractionDigits:2, maximumFractionDigits:2 })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

// ── CapaRevista ──────────────────────────────────────────────────
// Mostra a capa da revista. Se a imagem falhar, tenta as outras fotos do
// empreendimento e, por último, um fundo com a logo/nome dele (nunca uma foto genérica).
function CapaRevista({ revista }) {
    const candidatas = [revista.cover, ...(revista.fotosExtras || [])].filter(Boolean);
    const [tentativa, setTentativa] = useState(0);
    useEffect(() => { setTentativa(0); }, [revista.id, revista.cover]);

    const imgStyle = { transformOrigin:'center center' };
    const imgClass = 'w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out';

    if (tentativa < candidatas.length) {
        return (
            <img
                key={candidatas[tentativa]}
                src={candidatas[tentativa]}
                referrerPolicy="no-referrer"
                onError={() => setTentativa(t => t + 1)}
                loading="lazy"
                decoding="async"
                alt={`Capa ${revista.title}`}
                className={imgClass}
                style={imgStyle}
            />
        );
    }

    const logoKey = REVISTA_LOGO_MAP[revista.id];
    const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null;
    const isDirLocal = revista.brand === 'Direcional';
    return (
        <div className={imgClass} style={{ ...imgStyle, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, padding:16, textAlign:'center', background: isDirLocal ? 'linear-gradient(135deg,#2563eb 0%,#0f2a5c 100%)' : 'linear-gradient(135deg,#007aff 0%,#0a173b 100%)' }}>
            {logoSrc && (<img src={logoSrc} alt="" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{ maxHeight:56, maxWidth:'60%', objectFit:'contain', filter:'brightness(0) invert(1)' }}/>)}
            <span style={{ color:'#fff', fontWeight:800, fontSize:16, lineHeight:1.2 }}>{revista.title}</span>
        </div>
    );
}

// ── CardRevista ──────────────────────────────────────────────────
export function CardRevista({ revista, cardIdx, modoNoturno, haptic, setPdfLeitor, setSelectedPois, setPdfLeitorLogoAnim, onVerOnibus, captureZoomOrigin }) {
    const DELAY = 15000;
    const [expanded, setExpanded] = useState(false);
    const [showObraModal, setShowObraModal] = useState(false);
    const timerRef = useRef(null);
    // Destaque "NOVO": ativo até a data em revista.destaqueAte (7 dias); depois o card volta ao normal
    const isNovo = !!revista.destaqueAte && Date.now() < new Date(revista.destaqueAte).getTime();
    const accentObra = '#ff7a18';
    const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const startHover = () => {
        // Modal automático após 15s de hover removido
        return;
    };
    const stopHover = () => { clearTimeout(timerRef.current); };
    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleVerRevista = (e) => {
        haptic('medium');
        captureZoomOrigin?.(e);
        const previewUrl = revista.link.replace(/\/view(\?.*)?$/, '/preview');
        const logoKey = REVISTA_LOGO_MAP[revista.id];
        const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null;
        if (logoSrc && setPdfLeitorLogoAnim) {
            setPdfLeitorLogoAnim({ logoSrc, brand: revista.brand, title: revista.title });
            setTimeout(() => { setPdfLeitorLogoAnim(null); setPdfLeitor({ title: revista.title, url: previewUrl, brand: revista.brand }); }, 2200);
        } else {
            setPdfLeitor({ title: revista.title, url: previewUrl, brand: revista.brand });
        }
    };
    const handleVerPois = (e) => { haptic(); captureZoomOrigin?.(e); setSelectedPois(revista); };

    const handleDownload = (e) => {
        e.preventDefault();
        haptic();
        // Extrai o file ID do link do Google Drive e monta URL de download direto
        const match = revista.link.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
            const fileId = match[1];
            window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
        } else {
            window.open(revista.link, '_blank');
        }
    };

    const FOTO_H = 205;
    const temObra = typeof revista.obraPercent === 'number'; // sem taxa de obra (ex.: Riva) o card é mais baixo
    const ETAPAS_OBRA = ['Fundação', 'Estrutura', 'Acabam.', 'Entrega'];
    const obraConcluida = typeof revista.obraPercent === 'number' && revista.obraPercent >= 100;
    const etapaAtual = typeof revista.obraPercent !== 'number' ? -1 : obraConcluida ? 3 : revista.obraPercent <= 0 ? -1 : revista.obraPercent < 25 ? 0 : revista.obraPercent < 60 ? 1 : 2;
    const quartosCurto = (revista.bedrooms || '').replace(/\s*(quartos?|dormit[óo]rios?)/i, '').trim() || revista.bedrooms;
    const entregaHover = !revista.entrega ? null : (() => { const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']; if(revista.entrega==='Entregue') return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:24,fontWeight:900,color:'#fff',lineHeight:1.1}}>Entregue!</span><span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.85)',letterSpacing:'0.15em',textTransform:'uppercase'}}>pronto pra morar</span></div>); const pp=revista.entrega.split('/'); const mes=meses[parseInt(pp[0])-1]||''; const ano=pp[1]||pp[0]; const hoje=new Date(); const diff=(parseInt(pp[1])-hoje.getFullYear())*12+(parseInt(pp[0])-(hoje.getMonth()+1)); const restante=diff>0?`faltam ${diff} ${diff===1?'mês':'meses'}`:'chegando!'; return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1}}><span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.8)',letterSpacing:'0.3em',textTransform:'uppercase'}}>entrega</span><span style={{fontSize:40,fontWeight:900,color:'#fff',letterSpacing:'-0.04em',lineHeight:0.95}}>{ano}</span><span style={{fontSize:14,fontWeight:800,color:'rgba(255,255,255,0.9)',letterSpacing:'0.08em',textTransform:'uppercase'}}>{mes}</span><div style={{marginTop:10,padding:'4px 12px',borderRadius:999,background:'rgba(255,255,255,0.22)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.3)'}}><span style={{fontSize:11,fontWeight:800,color:'#fff'}}>{restante}</span></div></div>); })();

    return (
        <>
            {expanded && (<BannerExpandido revista={revista} onClose={() => setExpanded(false)} modoNoturno={modoNoturno} onVerRevista={handleVerRevista} onVerPois={handleVerPois} onVerOnibus={()=>onVerOnibus && onVerOnibus(revista)}/>)}
            <style>{`.rev-act{position:relative;transition:color .3s ease} .rev-act svg{transition:transform .4s cubic-bezier(.22,1,.36,1)} .rev-act:hover svg{transform:translateY(-2px)} .rev-act::after{content:'';position:absolute;left:24%;right:24%;bottom:5px;height:1.5px;border-radius:2px;background:rgba(255,255,255,0.32);transform:scaleX(0);transform-origin:center;transition:transform .4s cubic-bezier(.22,1,.36,1)} .rev-act:hover::after{transform:scaleX(1)} .rev-sw{position:relative;overflow:hidden;padding:0;border:none;color:#fff;background:linear-gradient(135deg,#ff7a18 0%,#ff9440 100%);-webkit-tap-highlight-color:transparent} .rev-sw .rev-t{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font-size:15px;font-weight:600;white-space:nowrap;transition:transform .45s cubic-bezier(.34,1.3,.64,1),opacity .35s} .rev-sw .rev-t2{opacity:0;transform:translateY(10px)} .rev-sw .rev-t3{display:none} .rev-sw .rev-k{position:absolute;top:5px;left:5px;width:44px;height:44px;border-radius:50%;background:#fff;color:#ff7a18;display:flex;align-items:center;justify-content:center;pointer-events:none;transition:left .55s cubic-bezier(.34,1.3,.64,1)} .rev-sw:hover .rev-k,.rev-sw:active .rev-k{left:calc(100% - 49px)} .rev-sw .rev-k svg{position:absolute;top:50%;left:50%;margin:-10.5px 0 0 -10.5px;transition:opacity .35s ease,transform .5s cubic-bezier(.34,1.3,.64,1)} .rev-sw .rev-ko{opacity:0;transform:scale(.55) rotate(-14deg)} .rev-sw .rev-k .rev-ko,.rev-sw .rev-k .rev-ke{margin:-12px 0 0 -12px} .rev-sw:hover .rev-ke,.rev-sw:active .rev-ke{opacity:0;transform:scale(1.3)} .rev-sw:hover .rev-ko,.rev-sw:active .rev-ko{opacity:1;transform:none} .rev-sw:hover .rev-t1,.rev-sw:active .rev-t1{opacity:0;transform:translateY(-10px)} .rev-sw:hover .rev-t2,.rev-sw:active .rev-t2{opacity:1;transform:none} @media (hover:none){.rev-sw .rev-k{left:calc(100% - 49px)} .rev-sw .rev-ke{opacity:0} .rev-sw .rev-ko{opacity:1;transform:none} .rev-sw .rev-t1,.rev-sw .rev-t2{display:none} .rev-sw .rev-t3{display:flex}} .rev-hover-hide{transition:opacity .4s ease} .group:hover .rev-hover-hide{opacity:0;pointer-events:none} .rev-blur-hover{transition:filter .5s ease} .group:hover .rev-blur-hover{filter:blur(20px) brightness(0.85) !important}`}</style>
            {showObraModal && (<ObraTaxaModal revista={revista} onClose={() => setShowObraModal(false)} modoNoturno={modoNoturno}/>)}
            {isNovo && (<style>{`
                @keyframes novoShine{0%{transform:translateX(-150%) skewX(-20deg);opacity:0}15%{opacity:1}45%{transform:translateX(350%) skewX(-20deg);opacity:1}55%,100%{transform:translateX(350%) skewX(-20deg);opacity:0}}
            `}</style>)}
            <div className="card-entry overflow-hidden group" style={{ animationDelay:`${cardIdx*90}ms`, position:'relative', height: temObra ? 500 : 440, borderRadius:'24px' }}
                onMouseEnter={() => { if (isTouchDevice()) return; startHover(); }}
                onMouseLeave={() => { if (isTouchDevice()) return; stopHover(); }}>
                {/* Foto de capa horizontal no topo, continuando abaixo como reflexo desfocado (igual à "foto do dia") */}
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius:'24px', zIndex:0, isolation:'isolate' }}>
                    <div style={{ position:'absolute', inset:0, filter:'blur(28px) brightness(0.85)', transform:'scale(1.2)' }}><CapaRevista revista={revista}/></div>
                    {/* Foto + reflexo espelhado num bloco só, desfocado de uma vez (sem emenda entre camadas) */}
                    <div className={entregaHover ? 'rev-blur-hover' : undefined} style={{ position:'absolute', left:0, right:0, top:0, height:FOTO_H * 2, filter:'blur(14px) brightness(0.85)', WebkitMaskImage:'linear-gradient(to bottom, #000 0, #000 62%, transparent 100%)', maskImage:'linear-gradient(to bottom, #000 0, #000 62%, transparent 100%)' }}>
                        <div style={{ position:'absolute', left:0, right:0, top:0, height:FOTO_H, overflow:'hidden' }}><CapaRevista revista={revista}/></div>
                        <div style={{ position:'absolute', left:0, right:0, top:FOTO_H, height:FOTO_H, overflow:'hidden', transform:'scaleY(-1)' }}><CapaRevista revista={revista}/></div>
                    </div>
                    <div className={entregaHover ? 'rev-blur-hover' : undefined} style={{ position:'absolute', left:0, right:0, top:0, height:FOTO_H, filter:'blur(6px) brightness(0.85)', WebkitMaskImage:'linear-gradient(to bottom, transparent 12%, #000 38%, #000 58%, transparent 88%)', maskImage:'linear-gradient(to bottom, transparent 12%, #000 38%, #000 58%, transparent 88%)' }}><CapaRevista revista={revista}/></div>
                    <div className={entregaHover ? 'rev-blur-hover' : undefined} style={{ position:'absolute', left:0, right:0, top:0, height:FOTO_H, WebkitMaskImage:'linear-gradient(to bottom, #000 0, #000 40%, transparent 85%)', maskImage:'linear-gradient(to bottom, #000 0, #000 40%, transparent 85%)' }}><CapaRevista revista={revista}/></div>
                    {/* Escurecimento suave na parte inferior (curva suave, começa bem abaixo da emenda da foto) */}
                    <div className="pointer-events-none" style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(14,15,36,0) 52%, rgba(14,15,36,0.047) 61.6%, rgba(14,15,36,0.158) 71.2%, rgba(14,15,36,0.29) 80.8%, rgba(14,15,36,0.40) 90.4%, rgba(14,15,36,0.45) 100%)' }}/>
                    <div className="absolute left-0 right-0 top-0 pointer-events-none z-10 overflow-hidden" style={{ height:FOTO_H, WebkitMaskImage:'linear-gradient(to bottom, #000 0, #000 55%, transparent 100%)', maskImage:'linear-gradient(to bottom, #000 0, #000 55%, transparent 100%)' }}><div className="card-shimmer-sweep" style={{ position:'absolute', top:0, left:0, width:'55%', height:'100%', background:'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.38) 50%, transparent 100%)', transform:'translateX(-150%) skewX(-18deg)' }}/></div>
                    {entregaHover && (
                        <div className="absolute left-0 right-0 top-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-center justify-center" style={{ height:FOTO_H - 34 }}>
                            <div style={{ position:'relative' }}>{entregaHover}</div>
                        </div>
                    )}
                </div>

                {isNovo && (
                    <div style={{ position:'absolute', top:12, right:12, zIndex:32, padding:'4px 11px', borderRadius:999, overflow:'hidden', background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', fontSize:11, fontWeight:900, letterSpacing:'0.12em', }}>
                        NOVO
                        <span style={{ position:'absolute', top:0, left:0, width:'40%', height:'100%', background:'rgba(255,255,255,0.4)', animation:'novoShine 5s ease-in-out infinite' }}/>
                    </div>
                )}

                {/* Selo do empreendimento — canto superior esquerdo */}
                <div className={entregaHover ? 'rev-hover-hide' : undefined} style={{ position:'absolute', top:10, left:10, zIndex:40, width:110, height:70, display:'flex', alignItems:'flex-start', justifyContent:'flex-start', pointerEvents:'none' }}>
                    {(() => { const logoKey = REVISTA_LOGO_MAP[revista.id]; const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null; if (!logoSrc) return null; return (<img src={logoSrc} alt={revista.title} style={{ maxHeight: logoKey === 'brisas' ? 62 : 68, maxWidth: logoKey === 'brisas' ? 108 : 105, width:'auto', height:'auto', objectFit:'contain', objectPosition:'top left', filter:'drop-shadow(0 0 8px rgba(0,0,0,0.9)) drop-shadow(0 2px 12px rgba(0,0,0,0.7)) drop-shadow(0 0 3px rgba(255,255,255,0.25))' }}/>); })()}
                </div>

                {/* Informações direto sobre o desfoque */}
                <div style={{ position:'absolute', left:16, right:16, bottom:16, zIndex:30, color:'#fff' }}>
                    <h3 style={{ margin:0, fontSize:19, fontWeight:800, lineHeight:1.25, color:'#fff' }}>{revista.title}</h3>
                    <div className="flex items-center gap-1.5" style={{ marginTop:4, fontSize:12, color:'#C6C8E4' }}><MapPin size={13}/><span className="line-clamp-1">{revista.region}</span></div>

                    <div style={{ display:'flex', borderRadius:999, overflow:'hidden', marginTop:10, background:'rgba(255,255,255,0.12)', backdropFilter:'blur(14px) saturate(140%)', WebkitBackdropFilter:'blur(14px) saturate(140%)' }}>
                        {[
                            { k:'dl',  label:'Baixar', title:'Baixar revista', mx:'0px', my:'2px', icon:<Download size={15}/>, fn:handleDownload },
                            { k:'poi', label:'Pontos', title:'Pontos de referência clicáveis', mx:'2px', my:'-2px', icon:<MapPin size={15}/>, fn:handleVerPois },
                            { k:'bus', label:'Ônibus', title:'Linhas de ônibus próximas', mx:'3px', my:'0px', icon:<Bus size={15}/>, fn:(e)=>{ captureZoomOrigin?.(e); onVerOnibus && onVerOnibus(revista); } },
                        ].map((b, i) => (
                            <button key={b.k} onClick={b.fn} title={b.title} aria-label={b.title} className="hw-card-icon rev-act" style={{ flex:1, background:'transparent', border:'none', borderLeft: i ? '1px solid rgba(255,255,255,0.22)' : 'none', borderRadius:0, color:'#fff', fontSize:12, fontWeight:600, padding:'11px 4px 13px', display:'flex', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', textShadow:'none' }}>{b.icon}{b.label}</button>
                        ))}
                    </div>

                    {typeof revista.obraPercent === 'number' && (
                        <div onClick={(e) => { e.stopPropagation(); haptic(); setShowObraModal(true); }} role="button" aria-label="Calcular Taxa de Obra" style={{ marginTop:12, cursor:'pointer' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
                                <span style={{ fontSize:11, color:'#C6C8E4' }}>Andamento da obra</span>
                                <span style={{ fontSize:12, fontWeight:800, color:'#fff', fontVariantNumeric:'tabular-nums' }}>{obraConcluida ? '100% · pronto' : `${Math.round(revista.obraPercent)}%`}</span>
                            </div>
                            <div style={{ display:'flex', alignItems:'center' }}>
                                {ETAPAS_OBRA.map((_, i) => {
                                    const on = obraConcluida || i < etapaAtual; const cur = !obraConcluida && i === etapaAtual;
                                    return (<React.Fragment key={i}>
                                        {i > 0 && <span style={{ flex:1, height:2, background: (obraConcluida || i <= etapaAtual) ? accentObra : 'rgba(255,255,255,0.22)' }}/>}
                                        <span style={{ width: cur ? 12 : 10, height: cur ? 12 : 10, borderRadius:'50%', flexShrink:0, background: (on || cur) ? accentObra : 'rgba(255,255,255,0.22)', boxShadow: cur ? '0 0 0 3px rgba(255,122,24,0.45)' : 'none' }}/>
                                    </React.Fragment>);
                                })}
                            </div>
                            <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                                {ETAPAS_OBRA.map((nome, i) => (<span key={nome} style={{ fontSize:10.5, color: (obraConcluida || i <= etapaAtual) ? '#fff' : '#C6C8E4' }}>{nome}</span>))}
                            </div>
                        </div>
                    )}

                    <div style={{ display:'flex', justifyContent:'space-between', gap:8, marginTop:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.18)' }}>
                        <div style={{ minWidth:0 }}><div style={{ fontSize:10.5, color:'#C6C8E4' }}>área</div><div style={{ fontSize:14, fontWeight:700, lineHeight:1.2 }}>{revista.size}</div></div>
                        <div><div style={{ fontSize:10.5, color:'#C6C8E4' }}>quartos</div><div style={{ fontSize:14, fontWeight:700, lineHeight:1.2 }}>{quartosCurto}</div></div>
                        {typeof revista.rendaMinima === 'number' && (
                            <div style={{ textAlign:'right' }}><div style={{ fontSize:10.5, color:'#C6C8E4' }}>renda média</div><div style={{ fontSize:14, fontWeight:700, lineHeight:1.2 }}>R$ {revista.rendaMinima.toLocaleString('pt-BR')}</div></div>
                        )}
                    </div>

                    <RippleButton onClick={handleVerRevista} className="rev-sw w-full" style={{ marginTop:12, height:54, borderRadius:999, textShadow:'none' }}><span className="rev-t rev-t1">Ver Revista</span><span className="rev-t rev-t2">Clique para abrir</span><span className="rev-t rev-t3">Toque para abrir</span><span className="rev-k" aria-hidden="true"><svg className="rev-ke" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.8" width="14" height="18.4" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="8" y="6" width="8" height="3" rx=".7" fill="currentColor"/><path d="M8 12.5h8M8 15.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><svg className="rev-ko" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2" fill="currentColor"/><path d="M14.5 2.5h3v8l-1.5-1.5-1.5 1.5z" fill="#fff"/><rect x="7.5" y="5" width="5" height="2.4" rx=".6" fill="#fff"/><path d="M8 14h8M8 17h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg></span></RippleButton>
                </div>
            </div>
        </>
    );
}

// ── CarrosselComFade ─────────────────────────────────────────────
// Carrossel horizontal com sombra em degradê + seta pulsando nas bordas,
// para indicar que dá para deslizar. As sombras aparecem/somem conforme o scroll.
export function CarrosselComFade({ children, modoNoturno }) {
    const ref = useRef(null);
    const [borda, setBorda] = useState({ esq: false, dir: false });

    const atualizar = () => {
        const el = ref.current;
        if (!el) return;
        const esq = el.scrollLeft > 8, dir = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;
        setBorda(p => (p.esq === esq && p.dir === dir ? p : { esq, dir }));
    };
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        atualizar();
        el.addEventListener('scroll', atualizar, { passive: true });
        window.addEventListener('resize', atualizar);
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(atualizar) : null;
        if (ro) { ro.observe(el); Array.from(el.children).forEach(c => ro.observe(c)); }
        return () => { el.removeEventListener('scroll', atualizar); window.removeEventListener('resize', atualizar); if (ro) ro.disconnect(); };
    }, []);

    const rolar = (dir) => { const el = ref.current; if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' }); };
    const sombra = modoNoturno ? 'rgba(8,9,24,0.78)' : 'rgba(15,23,42,0.45)';
    const lado = (esq) => ({ position:'absolute', top:8, bottom:14, [esq ? 'left' : 'right']:'calc(var(--gutter, 4px) * -1)', width:84, zIndex:40, display:'flex', alignItems:'center', justifyContent: esq ? 'flex-start' : 'flex-end', padding: esq ? '0 0 0 8px' : '0 8px 0 0', pointerEvents:'none', background:`linear-gradient(to ${esq ? 'right' : 'left'}, ${sombra}, rgba(0,0,0,0))`, opacity: (esq ? borda.esq : borda.dir) ? 1 : 0, transition:'opacity 0.25s ease' });
    const seta = (esq) => ({ pointerEvents: (esq ? borda.esq : borda.dir) ? 'auto' : 'none', width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer', background:'rgba(255,255,255,0.16)', border:'1px solid rgba(255,255,255,0.35)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', animation:`${esq ? 'setaNudgeEsq' : 'setaNudgeDir'} 1.4s ease-in-out infinite` });

    return (
        <div style={{ position:'relative', isolation:'isolate', zIndex:0 }}>
            <style>{`@keyframes setaNudgeDir{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}} @keyframes setaNudgeEsq{0%,100%{transform:translateX(0)}50%{transform:translateX(-6px)}}`}</style>
            <div ref={ref} className="cat-scroller">{children}</div>
            <div style={lado(true)}><button type="button" aria-label="Voltar" onClick={() => rolar(-1)} style={seta(true)}><ChevronLeft size={20}/></button></div>
            <div style={lado(false)}><button type="button" aria-label="Ver mais revistas" onClick={() => rolar(1)} style={seta(false)}><ChevronRight size={20}/></button></div>
        </div>
    );
}

// ── RevistaCloseButton ───────────────────────────────────────────
export function RevistaCloseButton({ onClose }) {
    useEffect(() => {
        const blockZoom = (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); e.stopPropagation(); } };
        const blockGesture = (e) => { e.preventDefault(); };
        document.addEventListener('wheel', blockZoom, { passive: false, capture: true });
        document.addEventListener('gesturestart', blockGesture, { passive: false, capture: true });
        document.addEventListener('gesturechange', blockGesture, { passive: false, capture: true });
        document.addEventListener('gestureend', blockGesture, { passive: false, capture: true });
        return () => {
            document.removeEventListener('wheel', blockZoom, { capture: true });
            document.removeEventListener('gesturestart', blockGesture, { capture: true });
            document.removeEventListener('gesturechange', blockGesture, { capture: true });
            document.removeEventListener('gestureend', blockGesture, { capture: true });
        };
    }, []);
    return (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', pointerEvents:'none', zIndex:99999 }}>
            <button onClick={onClose} style={{ pointerEvents:'all', position:'absolute', top:'max(14px, env(safe-area-inset-top, 14px))', left:'14px', width:48, height:48, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.30)', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', boxShadow:'0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'background 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(30,30,30,0.75)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.55)';}} onMouseDown={e=>{e.currentTarget.style.transform='scale(0.90)';}} onMouseUp={e=>{e.currentTarget.style.transform='scale(1)';}} onTouchStart={e=>{e.currentTarget.style.transform='scale(0.90)';}} onTouchEnd={e=>{e.currentTarget.style.transform='scale(1)';}}>
                <X size={22} strokeWidth={2.5}/>
            </button>
        </div>
    );
}
