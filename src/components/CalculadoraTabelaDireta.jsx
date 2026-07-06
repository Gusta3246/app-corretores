import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

// ── CalculadoraTabelaDireta ──────────────────────────────────────
// Simulador de financiamento "Tabela Direta" (Direcional Engenharia).
// 10% à vista/cartão · 30% parcelado na obra (corrigido pelo INCC-M,
// crescente mês a mês) · 60% financiado pela Tabela Price (mostramos
// apenas a parcela mais alta e a mais baixa).
export default function CalculadoraTabelaDireta({ modoNoturno, onClose }) {
    const [valorImovelTexto, setValorImovelTexto] = useState('');
    const [parcelasObraTexto, setParcelasObraTexto] = useState('');
    const [parcelasFinanciamentoTexto, setParcelasFinanciamentoTexto] = useState('120');
    // INCC-M de junho/2026 (FGV): 0,85% a.m. — atualize aqui quando o índice mudar.
    const INCC_MENSAL = 0.0085;

    // Parâmetros fixos do simulador Direcional (planilha original)
    const PRAZO_MAXIMO = 120;
    const TAXA_JUROS_AA = 0.12;
    const TAXA_DFI = 0.00007;
    const TAXA_MIP = 0.00021;

    const parseValor = (str) => {
        if (!str) return 0;
        const cleaned = str.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
        const n = parseFloat(cleaned);
        return isNaN(n) ? 0 : n;
    };

    const parseInteiro = (str) => {
        const n = parseInt((str || '').replace(/[^\d]/g, ''), 10);
        return isNaN(n) ? 0 : n;
    };

    const fmtBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Máscara de moeda em tempo real: cada dígito digitado empurra os centavos,
    // já formatando com ponto de milhar e vírgula decimal (padrão BR).
    const maskMoeda = (raw) => {
        const digits = (raw || '').replace(/\D/g, '');
        if (!digits) return '';
        const cents = parseInt(digits, 10);
        return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const valorImovel = parseValor(valorImovelTexto);
    const nParcelasObra = parseInteiro(parcelasObraTexto);
    const prazoFinanciamento = Math.min(Math.max(parseInteiro(parcelasFinanciamentoTexto) || 0, 1), PRAZO_MAXIMO);

    const entrada10 = valorImovel * 0.10;
    const entrada10Cartao = entrada10 / 12;
    const obra30 = valorImovel * 0.30;
    const financiado60 = valorImovel * 0.60;

    // Parcelas de obra crescentes pelo INCC-M, mantendo a soma total = 30% do imóvel
    const { obraUltima } = useMemo(() => {
        if (nParcelasObra <= 0 || obra30 <= 0) return { obraBase: 0, obraUltima: 0 };
        const i = INCC_MENSAL;
        const base = i === 0
            ? obra30 / nParcelasObra
            : (obra30 * i) / (Math.pow(1 + i, nParcelasObra) - 1);
        const ultima = base * Math.pow(1 + i, nParcelasObra - 1);
        return { obraBase: base, obraUltima: ultima };
    }, [obra30, nParcelasObra]);

    const { maiorParcela, menorParcela } = useMemo(() => {
        if (financiado60 <= 0 || prazoFinanciamento <= 0) return { maiorParcela: 0, menorParcela: 0 };

        const taxaMes = Math.pow(1 + TAXA_JUROS_AA, 1 / 12) - 1;
        const pmtConst = (financiado60 * taxaMes) / (1 - Math.pow(1 + taxaMes, -prazoFinanciamento));

        let saldo = financiado60;
        let somaParcelasAnteriores = 0;
        let maior = 0;
        let menor = Infinity;

        for (let mes = 1; mes <= prazoFinanciamento; mes++) {
            const juros = saldo * taxaMes;
            const amortizacao = pmtConst - juros;
            const mip = saldo * TAXA_MIP;
            const dfi = (saldo + somaParcelasAnteriores) * TAXA_DFI;
            const parcela = pmtConst + mip + dfi;

            if (parcela > maior) maior = parcela;
            if (parcela < menor) menor = parcela;

            somaParcelasAnteriores += parcela;
            saldo -= amortizacao;
        }
        return { maiorParcela: maior, menorParcela: menor };
    }, [financiado60, prazoFinanciamento]);

    const bg = modoNoturno ? '#0f172a' : '#ffffff';
    const bgSub = modoNoturno ? '#1e293b' : '#f8fafc';
    const text = modoNoturno ? '#f1f5f9' : '#1e293b';
    const sub = modoNoturno ? '#94a3b8' : '#64748b';
    const divider = modoNoturno ? '#1e293b' : '#e2e8f0';
    const accent = '#f97316'; // laranja Direcional

    const handleSelectAll = (e) => e.target.select();

    const handlePaste = (setter) => (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        setter(pasted.trim());
    };

    const handlePasteMoeda = (setter) => (e) => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData).getData('text');
        setter(maskMoeda(pasted));
    };

    const inputStyle = {
        width: '100%', padding: '9px 11px', fontSize: 14, fontFamily: 'ui-monospace, monospace',
        border: `1px solid ${divider}`, borderRadius: 8, background: bgSub, color: text, outline: 'none',
    };
    const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 6, color: sub };

    return (
        <>
            <div
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            />
            <div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, pointerEvents: 'none' }}>
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ pointerEvents: 'auto', width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto', borderRadius: 26, overflow: 'hidden', background: bg, boxShadow: '0 32px 100px rgba(0,0,0,0.40), 0 8px 32px rgba(0,0,0,0.20)' }}
                >
                    {/* Header */}
                    <div style={{ padding: '22px 24px 16px', borderBottom: `1px solid ${divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent }}>
                                Simulação · Tabela Direta
                            </p>
                            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: text }}>Financiamento Direcional</h2>
                        </div>
                        <button onClick={onClose} style={{ background: bgSub, border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: sub, flexShrink: 0 }}>
                            <X size={16} />
                        </button>
                    </div>

                    {/* Inputs */}
                    <div style={{ padding: '18px 24px 4px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
                            <div>
                                <label style={labelStyle}>Valor do imóvel (R$)</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="R$ 0,00"
                                    value={valorImovelTexto}
                                    onChange={(e) => setValorImovelTexto(maskMoeda(e.target.value))}
                                    onFocus={handleSelectAll}
                                    onClick={handleSelectAll}
                                    onPaste={handlePasteMoeda(setValorImovelTexto)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Nº de parcelas período obra</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Ex: 24"
                                    value={parcelasObraTexto}
                                    onChange={(e) => setParcelasObraTexto(e.target.value)}
                                    onFocus={handleSelectAll}
                                    onClick={handleSelectAll}
                                    onPaste={handlePaste(setParcelasObraTexto)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Breakdown 10/30/60 */}
                    <div style={{ padding: '14px 24px 4px' }}>
                        <div style={{ borderRadius: 14, border: `1px solid ${divider}`, overflow: 'hidden' }}>
                            <div style={{ padding: '13px 16px', borderBottom: `1px solid ${divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>10% — à vista ou 12x sem juros no cartão</div>
                                    <div style={{ fontSize: 11.5, color: sub, marginTop: 2 }}>12x de {fmtBRL(entrada10Cartao)}</div>
                                </div>
                                <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: 15, color: text, whiteSpace: 'nowrap', marginLeft: 12 }}>
                                    {fmtBRL(entrada10)}
                                </div>
                            </div>

                            <div style={{ padding: '13px 16px', borderBottom: `1px solid ${divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>30% — parcelado durante a obra</div>
                                    <div style={{ fontSize: 11.5, color: sub, marginTop: 2 }}>corrigido pelo INCC-M</div>
                                </div>
                                <div style={{ textAlign: 'right', marginLeft: 12 }}>
                                    {nParcelasObra > 0 ? (
                                        <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: 15, color: text, whiteSpace: 'nowrap' }}>
                                            {nParcelasObra}x de {fmtBRL(obraUltima)}
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 12, color: sub }}>Informe as parcelas</div>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: bgSub }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>60% — financiado</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                                        <span style={{ fontSize: 11.5, color: sub }}>Parcelas:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={parcelasFinanciamentoTexto}
                                            onChange={(e) => setParcelasFinanciamentoTexto(e.target.value.replace(/\D/g, ''))}
                                            onFocus={handleSelectAll}
                                            onClick={handleSelectAll}
                                            onPaste={handlePaste(setParcelasFinanciamentoTexto)}
                                            onBlur={() => setParcelasFinanciamentoTexto(String(prazoFinanciamento))}
                                            style={{ width: 44, padding: '3px 6px', fontSize: 12.5, fontFamily: 'ui-monospace, monospace', border: `1px solid ${divider}`, borderRadius: 6, background: bg, color: text, outline: 'none', textAlign: 'center' }}
                                        />
                                        <span style={{ fontSize: 11.5, color: sub }}>de até 120x</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginLeft: 12 }}>
                                    <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: 15, color: accent, whiteSpace: 'nowrap' }}>
                                        {prazoFinanciamento}x de {fmtBRL(maiorParcela)}
                                    </div>
                                    <div style={{ fontSize: 11, color: sub, marginTop: 2, whiteSpace: 'nowrap' }}>
                                        até {fmtBRL(menorParcela === Infinity ? 0 : menorParcela)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p style={{ fontSize: 10.5, lineHeight: 1.6, color: sub, padding: '18px 24px 20px', margin: 0 }}>
                        60% do imóvel financiado em até {prazoFinanciamento} meses pela Tabela Price (juros de 12% a.a., seguros MIP 0,021% e DFI 0,007% sobre o saldo devedor). As parcelas de obra (30%) crescem mês a mês pelo INCC-M (0,85% a.m., referência junho/2026). Valores estimados, sujeitos a confirmação junto à incorporadora.
                    </p>
                </div>
            </div>
        </>
    );
}