import React, { useState, useEffect, useRef } from 'react';
import { MapPin, BookOpen, Maximize, Bed, LayoutGrid, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
        <button ref={btnRef} className={className} style={{ ...style, position: 'relative', overflow: 'hidden' }} onClick={handleClick}>
            {children}
        </button>
    );
}

// ── BannerExpandido ──────────────────────────────────────────────
export function BannerExpandido({ revista, onClose, modoNoturno, onVerRevista, onVerPois }) {
    const [phase, setPhase] = useState('entering');
    const [fotos, setFotos] = useState([revista.cover]);
    const checkedRef = useRef(false);
    useEffect(() => {
        if (checkedRef.current) return;
        checkedRef.current = true;
        (revista.fotosExtras || []).forEach(url => {
            const img = new Image();
            img.onload = () => setFotos(prev => prev.includes(url) ? prev : [...prev, url]);
            img.src = url;
        });
    }, []);

    const [idx, setIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState(null);
    const [dir, setDir] = useState(null);
    const sliding = useRef(false);

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
    const accent     = isDir ? '#f97316' : '#2563eb';
    const accentDark = isDir ? '#c2410c' : '#1d4ed8';
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
                <div onMouseLeave={triggerClose} onClick={e => e.stopPropagation()} style={{ pointerEvents:'auto', width:'100%', maxWidth:1160, height:'min(90vh, 720px)', borderRadius:26, overflow:'hidden', display:'flex', background:bg, boxShadow:'0 32px 100px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.20)', opacity: phase === 'in' ? 1 : 0, transform: phase === 'in' ? 'scale(1) translateY(0)' : 'scale(0.93) translateY(28px)', transition: phase === 'entering' ? 'none' : `opacity 0.32s cubic-bezier(0.22,1,0.36,1), transform 0.32s cubic-bezier(0.22,1,0.36,1)` }}>
                    <div style={{ flex:'0 0 58%', position:'relative', overflow:'hidden' }}>
                        {dir && prevIdx !== null && (<img key={`out-${prevIdx}`} src={fotos[prevIdx]} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform:`translateX(${outX})`, transition:`transform ${DUR} ${EASE}`, zIndex:1 }}/>)}
                        <img key={`in-${idx}`} src={fotos[idx]} alt={revista.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', animation: dir ? `slideIn-${dir} ${DUR} ${EASE} forwards` : 'none', zIndex:2 }}/>
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
                            <button onClick={()=>{triggerClose();setTimeout(onVerRevista,300);}} style={{ width:'100%', padding:'13px 0', borderRadius:16, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:accent, color:'#fff', fontSize:14, fontWeight:800, boxShadow:`0 4px 16px ${accent}44`, transition:'background 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.background=accentDark;e.currentTarget.style.transform='scale(1.01)';}} onMouseLeave={e=>{e.currentTarget.style.background=accent;e.currentTarget.style.transform='scale(1)';}}>
                                <BookOpen size={16}/> Ver Revista Digital
                            </button>
                            <button onClick={()=>{triggerClose();setTimeout(onVerPois,300);}} style={{ width:'100%', padding:'11px 0', borderRadius:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'transparent', border:`1.5px solid ${divider}`, color:sub, fontSize:13, fontWeight:700, transition:'border-color 0.15s, color 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.color=accent;e.currentTarget.style.transform='scale(1.01)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor=divider;e.currentTarget.style.color=sub;e.currentTarget.style.transform='scale(1)';}}>
                                <MapPin size={14} color="#f43f5e"/> Ver pontos de referência
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`@keyframes slideIn-left{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes slideIn-right{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
        </>
    );
}

// ── CardRevista ──────────────────────────────────────────────────
export function CardRevista({ revista, cardIdx, modoNoturno, haptic, setPdfLeitor, setSelectedPois, setPdfLeitorLogoAnim }) {
    const DELAY = 1700;
    const [expanded, setExpanded] = useState(false);
    const timerRef = useRef(null);
    const isDir = revista.brand === 'Direcional';
    const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const startHover = () => {
        if (isTouchDevice()) return;
        timerRef.current = setTimeout(() => { haptic('medium'); setExpanded(true); }, DELAY);
    };
    const stopHover = () => { clearTimeout(timerRef.current); };
    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleVerRevista = () => {
        haptic('medium');
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
    const handleVerPois = () => { haptic(); setSelectedPois(revista); };

    return (
        <>
            {expanded && (<BannerExpandido revista={revista} onClose={() => setExpanded(false)} modoNoturno={modoNoturno} onVerRevista={handleVerRevista} onVerPois={handleVerPois}/>)}
            <div className="card-entry overflow-hidden flex flex-col group" style={{ animationDelay:`${cardIdx*90}ms`, position:'relative', borderRadius:'24px', background: modoNoturno ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)', backdropFilter:'blur(28px) saturate(200%) brightness(1.02)', WebkitBackdropFilter:'blur(28px) saturate(200%) brightness(1.02)', border: modoNoturno ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.90)', boxShadow: modoNoturno ? '0 2px 8px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)' : '0 2px 6px rgba(100,130,200,0.10), 0 8px 28px rgba(100,130,200,0.14), inset 0 1.5px 0 rgba(255,255,255,1)', transition:'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s ease' }}
                onMouseEnter={e => { if (isTouchDevice()) return; e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = modoNoturno ? '0 8px 24px rgba(0,0,0,0.40), 0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)' : '0 8px 24px rgba(100,130,200,0.18), 0 24px 64px rgba(100,130,200,0.22), inset 0 1.5px 0 rgba(255,255,255,1)'; startHover(); }}
                onMouseLeave={e => { if (isTouchDevice()) return; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = modoNoturno ? '0 2px 8px rgba(0,0,0,0.30), 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)' : '0 2px 6px rgba(100,130,200,0.10), 0 8px 28px rgba(100,130,200,0.14), inset 0 1.5px 0 rgba(255,255,255,1)'; stopHover(); }}>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={revista.cover} onError={(e)=>{e.target.onerror=null;e.target.src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400';}} alt={`Capa ${revista.title}`} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out" style={{ transformOrigin:'center center', willChange:'transform' }}/>
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden"><div className="card-shimmer-sweep" style={{ position:'absolute', top:0, left:0, width:'55%', height:'100%', background:'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.38) 50%, transparent 100%)', transform:'translateX(-150%) skewX(-18deg)' }}/></div>
                    <div style={{ position:'absolute', top:10, left:10, zIndex:10, width:110, height:70, display:'flex', alignItems:'flex-start', justifyContent:'flex-start' }}>
                        {(() => { const logoKey = REVISTA_LOGO_MAP[revista.id]; const logoSrc = logoKey ? LOGOS_EMPREENDIMENTO[logoKey] : null; if (!logoSrc) return null; return (<img src={logoSrc} alt={revista.title} style={{ maxHeight: logoKey === 'brisas' ? 62 : 68, maxWidth: logoKey === 'brisas' ? 108 : 105, width:'auto', height:'auto', objectFit:'contain', objectPosition:'top left', filter:'drop-shadow(0 0 8px rgba(0,0,0,0.9)) drop-shadow(0 2px 12px rgba(0,0,0,0.7)) drop-shadow(0 0 3px rgba(255,255,255,0.25))' }}/>); })()}
                    </div>
                    {revista.entrega && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(18px) saturate(180%)', WebkitBackdropFilter:'blur(18px) saturate(180%)' }}>
                            {(()=>{ const meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']; if(revista.entrega==='Entregue') return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:24,fontWeight:900,color:'#fff',textShadow:'0 2px 16px rgba(0,0,0,0.6)',lineHeight:1.1}}>Entregue!</span><span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.8)',letterSpacing:'0.15em',textTransform:'uppercase'}}>pronto pra morar</span></div>); const p=revista.entrega.split('/'); const mes=meses[parseInt(p[0])-1]||''; const ano=p[1]||p[0]; const hoje=new Date(); const diff=(parseInt(p[1])-hoje.getFullYear())*12+(parseInt(p[0])-(hoje.getMonth()+1)); const restante=diff>0?`faltam ${diff} ${diff===1?'mês':'meses'}`:'chegando!'; return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1}}><span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.55)',letterSpacing:'0.3em',textTransform:'uppercase'}}>entrega</span><span style={{fontSize:46,fontWeight:900,color:'#fff',letterSpacing:'-0.04em',textShadow:'0 4px 24px rgba(0,0,0,0.5)',lineHeight:0.95}}>{ano}</span><span style={{fontSize:14,fontWeight:800,color:'rgba(255,255,255,0.9)',letterSpacing:'0.08em',textTransform:'uppercase'}}>{mes}</span><div style={{marginTop:10,padding:'4px 12px',borderRadius:999,background:'rgba(255,255,255,0.22)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.3)'}}><span style={{fontSize:11,fontWeight:800,color:'#fff'}}>{restante}</span></div></div>); })()}
                        </div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`text-xl font-bold mb-2 ${modoNoturno?'text-white':'text-slate-800'}`}>{revista.title}</h3>
                    <div className="flex flex-col gap-2 mb-6">
                        <div className="flex items-center text-slate-500 text-sm gap-2"><MapPin size={16} className="text-slate-400 shrink-0"/><span className={`line-clamp-1 ${modoNoturno?'text-slate-400':''}`}>{revista.region}</span></div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><Maximize size={16} className="text-slate-400 shrink-0"/><span className={modoNoturno?'text-slate-400':''}>{revista.size}</span></div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><Bed size={16} className="text-slate-400 shrink-0"/><span className={modoNoturno?'text-slate-400':''}>{revista.bedrooms}</span></div>
                            <div className="flex items-center text-slate-500 text-sm gap-1.5"><LayoutGrid size={16} className="text-slate-400 shrink-0"/><span className={modoNoturno?'text-slate-400':''}>{revista.flooring}</span></div>
                        </div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                        <RippleButton onClick={handleVerRevista} className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isDir?'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:to-red-600 shadow-orange-300/30 text-white':'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-blue-300/30 text-white'}`}><BookOpen size={18}/> Ver Revista</RippleButton>
                        <RippleButton onClick={handleVerPois} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold transition-colors duration-200 border text-sm ${modoNoturno?'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600':'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}><MapPin size={16} className="text-rose-500"/> Ver Pontos de Referência</RippleButton>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── HintPills ────────────────────────────────────────────────────
const HINT_PILLS_DATA = [
    { label: 'Pasta', color: 'linear-gradient(135deg,#6366f1,#4f46e5)', glow: 'rgba(99,102,241,0.7)', icon: <path d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.707 6.7A1 1 0 0011.414 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="white"/> },
    { label: 'Pasta Rápida IA', color: 'linear-gradient(135deg,#f97316,#ef4444)', glow: 'rgba(249,115,22,0.7)', icon: <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="white"/> },
    { label: 'Taxas Docs', color: 'linear-gradient(135deg,#0ea5e9,#0369a1)', glow: 'rgba(14,165,233,0.7)', icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="white"/><polyline points="14,2 14,8 20,8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/></> },
];

export function HintPills({ onPhaseChange }) {
    const [phase, setPhase] = useState('idle');
    useEffect(() => {
        if (sessionStorage.getItem('dst_hint_done')) return;
        const t1 = setTimeout(() => { setPhase('show'); onPhaseChange?.('show'); }, 5800);
        const t2 = setTimeout(() => { setPhase('fly');  onPhaseChange?.('fly');  }, 8500);
        const t3 = setTimeout(() => { setPhase('gone'); onPhaseChange?.('gone'); sessionStorage.setItem('dst_hint_done', '1'); }, 9400);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);
    if (phase === 'idle' || phase === 'gone') return null;
    const pillAnims = HINT_PILLS_DATA.map((_, i) => ({ enter: `hint-enter-${i}`, delay: `${i * 0.18}s` }));
    return (
        <>
            <style>{`
                @keyframes hint-enter-0{0%{opacity:0;transform:translateX(120px) translateY(-30px) rotate(12deg) scale(0.4)}55%{opacity:1;transform:translateX(-8px) translateY(4px) rotate(-2deg) scale(1.08)}75%{transform:translateX(4px) translateY(-2px) rotate(1deg) scale(0.97)}100%{opacity:1;transform:translateX(0) translateY(0) rotate(0deg) scale(1)}}
                @keyframes hint-enter-1{0%{opacity:0;transform:translateX(140px) translateY(-20px) rotate(8deg) scale(0.35)}55%{opacity:1;transform:translateX(-6px) translateY(3px) rotate(-2deg) scale(1.06)}75%{transform:translateX(3px) translateY(-1px) rotate(1deg) scale(0.98)}100%{opacity:1;transform:translateX(0) translateY(0) rotate(0deg) scale(1)}}
                @keyframes hint-enter-2{0%{opacity:0;transform:translateX(160px) translateY(-10px) rotate(5deg) scale(0.3)}55%{opacity:1;transform:translateX(-5px) translateY(2px) rotate(-1deg) scale(1.05)}75%{transform:translateX(2px) translateY(-1px) rotate(0deg) scale(0.98)}100%{opacity:1;transform:translateX(0) translateY(0) rotate(0deg) scale(1)}}
                @keyframes hint-fly-0{0%{opacity:1;transform:translateX(0) translateY(0) scale(1)}30%{transform:translateX(10px) translateY(-8px) scale(1.1)}100%{opacity:0;transform:translateX(60px) translateY(90px) scale(0.05)}}
                @keyframes hint-fly-1{0%{opacity:1;transform:translateX(0) translateY(0) scale(1)}30%{transform:translateX(8px) translateY(-5px) scale(1.08)}100%{opacity:0;transform:translateX(55px) translateY(75px) scale(0.05)}}
                @keyframes hint-fly-2{0%{opacity:1;transform:translateX(0) translateY(0) scale(1)}30%{transform:translateX(6px) translateY(-4px) scale(1.06)}100%{opacity:0;transform:translateX(50px) translateY(60px) scale(0.05)}}
                @keyframes hint-shine{0%{left:-80%}100%{left:160%}}
            `}</style>
            <div style={{ position:'fixed', bottom:108, right:36, zIndex:44, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, pointerEvents:'none' }}>
                {HINT_PILLS_DATA.map((p, i) => (
                    <div key={i} style={{ position:'relative', display:'flex', alignItems:'center', gap:8, padding:'9px 16px 9px 10px', borderRadius:99, background:p.color, color:'#fff', fontSize:11.5, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', boxShadow:`0 0 0 1.5px rgba(255,255,255,0.15), 0 4px 20px ${p.glow}, 0 2px 6px rgba(0,0,0,0.3)`, whiteSpace:'nowrap', overflow:'hidden', animation: phase === 'show' ? `hint-enter-${i} 0.65s cubic-bezier(0.22,1,0.36,1) ${pillAnims[i].delay} both` : `hint-fly-${i} 0.65s cubic-bezier(0.55,0,1,0.45) ${i*0.07}s both` }}>
                        <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><svg width="11" height="11" viewBox="0 0 24 24">{p.icon}</svg></div>
                        {p.label}
                        <div style={{ position:'absolute', top:0, width:'45%', height:'100%', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)', transform:'skewX(-18deg)', animation:`hint-shine 2.2s ease-in-out ${0.8+i*0.4}s infinite`, pointerEvents:'none' }}/>
                    </div>
                ))}
            </div>
        </>
    );
}

// ── CountdownLancamento ──────────────────────────────────────────
export function CountdownLancamento({ modoNoturno }) {
    const [tempo, setTempo] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0, passado: false });

    useEffect(() => {
        // Data alvo do lançamento: ajuste aqui quando souber a data real
        const alvo = new Date('2025-08-01T09:00:00');

        const calcular = () => {
            const agora = new Date();
            const diff = alvo - agora;
            if (diff <= 0) {
                setTempo({ dias: 0, horas: 0, minutos: 0, segundos: 0, passado: true });
                return;
            }
            const dias     = Math.floor(diff / (1000 * 60 * 60 * 24));
            const horas    = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);
            setTempo({ dias, horas, minutos, segundos, passado: false });
        };

        calcular();
        const id = setInterval(calcular, 1000);
        return () => clearInterval(id);
    }, []);

    const bg      = modoNoturno ? 'rgba(30,41,59,0.9)' : 'rgba(241,245,249,0.95)';
    const borda   = modoNoturno ? 'rgba(99,102,241,0.35)' : 'rgba(99,102,241,0.2)';
    const textSub = modoNoturno ? '#94a3b8' : '#64748b';

    if (tempo.passado) {
        return (
            <div style={{ padding:'10px 14px', borderRadius:14, background: bg, border:`1px solid ${borda}`, textAlign:'center' }}>
                <span style={{ fontSize:13, fontWeight:800, color:'#6366f1', letterSpacing:'0.05em' }}>🚀 Lançamento já aconteceu!</span>
            </div>
        );
    }

    const Bloco = ({ valor, label }) => (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:44 }}>
            <span style={{ fontSize:22, fontWeight:900, color:'#6366f1', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                {String(valor).padStart(2, '0')}
            </span>
            <span style={{ fontSize:9, fontWeight:700, color: textSub, letterSpacing:'0.15em', textTransform:'uppercase', marginTop:2 }}>{label}</span>
        </div>
    );

    return (
        <div style={{ padding:'10px 14px', borderRadius:14, background: bg, border:`1px solid ${borda}` }}>
            <div style={{ fontSize:9, fontWeight:700, color: textSub, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8, textAlign:'center' }}>
                ⏳ Contagem para o lançamento
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                <Bloco valor={tempo.dias}     label="dias"  />
                <span style={{ fontSize:18, fontWeight:900, color:'#6366f1', marginBottom:10, opacity:0.6 }}>:</span>
                <Bloco valor={tempo.horas}    label="hrs"   />
                <span style={{ fontSize:18, fontWeight:900, color:'#6366f1', marginBottom:10, opacity:0.6 }}>:</span>
                <Bloco valor={tempo.minutos}  label="min"   />
                <span style={{ fontSize:18, fontWeight:900, color:'#6366f1', marginBottom:10, opacity:0.6 }}>:</span>
                <Bloco valor={tempo.segundos} label="seg"   />
            </div>
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
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'0', pointerEvents:'none', zIndex:99999 }}>
            <button onClick={onClose} style={{ pointerEvents:'all', position:'absolute', top:'calc(env(safe-area-inset-top, 0px) + 14px)', left:'14px', width:48, height:48, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.30)', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(20px) saturate(180%)', WebkitBackdropFilter:'blur(20px) saturate(180%)', boxShadow:'0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', transition:'background 0.15s, transform 0.12s' }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(30,30,30,0.75)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,0,0,0.55)';}} onMouseDown={e=>{e.currentTarget.style.transform='scale(0.90)';}} onMouseUp={e=>{e.currentTarget.style.transform='scale(1)';}}>
                <X size={22} strokeWidth={2.5}/>
            </button>
        </div>
    );
}