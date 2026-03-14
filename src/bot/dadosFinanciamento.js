// =========================================================================
// BANCO DE DADOS DO ROBÔ - DIRECIONAL E RIVA MANAUS
// Versão 3.0 — Perfis corrigidos tabela oficial Riva/Direcional Fev 2026 + Valores médios referência + Regras precisão todos empreendimentos
// =========================================================================

export const BaseConhecimento = {
  // ==========================================
  // 🤝 SAUDAÇÕES E EDUCAÇÃO (NATURALIDADE)
  // ==========================================
  "bom dia": "Bom dia! Tudo bem? Espero que seu dia esteja sendo ótimo! Sou o assistente virtual da equipe. Em que posso te ajudar hoje sobre os nossos empreendimentos ou financiamento?",
  "boa tarde": "Boa tarde! Tudo certinho por aí? Sou o seu assistente virtual. Como posso te ajudar a conquistar o seu novo lar hoje?",
  "boa noite": "Boa noite! Tudo bem? Estou aqui para facilitar o seu atendimento. Quer saber sobre algum empreendimento específico ou sobre como funciona o financiamento?",
  "ola": "Olá! Que bom falar com você! Sou o seu assistente virtual especialista nos imóveis Direcional e Riva aqui em Manaus. Como posso te ajudar hoje?",
  "oi": "Oi! Tudo bem? Sou o assistente virtual da equipe, pronto para tirar todas as suas dúvidas sobre nossos imóveis. O que você procura hoje?",
  "tudo bem": "Tudo rodando perfeitamente por aqui, obrigado por perguntar! 😊 Sou um assistente virtual e estou pronto para ajudar. Como posso facilitar a busca pelo seu novo imóvel hoje?",
  "obrigado": "Por nada! É um enorme prazer ajudar. Se tiver mais alguma dúvida ou quiser simular uma condição, é só chamar!",
  "obrigada": "Por nada! É um enorme prazer ajudar. Se tiver mais alguma dúvida ou quiser simular uma condição, é só chamar!",
  "valeu": "Imagina, eu que agradeço o contato! Qualquer outra dúvida, estou por aqui.",

  // ==========================================
  // 💡 CAPACIDADE DE COMPRA E REGRAS
  // ==========================================
  "regras mcmv": "Para o cliente se enquadrar no Minha Casa Minha Vida (MCMV), ele precisa cumprir estes requisitos básicos:\n1. Renda familiar bruta máxima de R$ 12.000,00.\n2. Não ter imóvel residencial registrado no próprio nome.\n3. Não ter recebido benefício de moradia do governo anteriormente.\n4. O imóvel deve ser utilizado para moradia própria.\nSe cumprir isso, tem direito a taxas menores e pode ganhar subsídio!",
  "requisitos mcmv": "Para o cliente se enquadrar no MCMV:\n1. Renda familiar bruta máxima de R$ 12.000,00.\n2. Não ter imóvel residencial no próprio nome.\n3. Não ter recebido benefício de moradia do governo antes.\n4. Imóvel para moradia própria.",
  "quem tem direito": "Para ter direito ao MCMV:\n1. Renda familiar bruta máxima de R$ 12.000,00.\n2. Não ter imóvel residencial no próprio nome.\n3. Não ter recebido benefício habitacional do governo antes.\n4. Usar o imóvel como moradia própria.",

  "capacidade de compra": "A capacidade de compra é calculada pela Caixa limitando a parcela a no máximo 30% da renda bruta familiar. O poder de compra final = Financiamento aprovado + Saldo do FGTS + Subsídio (se houver) + Entrada do cliente.",
  "comprometimento de renda": "A Caixa permite comprometer no máximo 30% da renda familiar bruta com a parcela do financiamento. Exemplo: Cliente com R$ 3.000 → parcela máxima de R$ 900.",
  "30%": "A regra dos 30%: a parcela do financiamento da Caixa não pode ultrapassar 30% da renda bruta do cliente. Isso define o teto de financiamento aprovado.",

  "renda de 2000": "Cliente com R$ 2.000 de renda → parcela máxima ~R$ 600 (30%). Faixa 1 do MCMV, maior subsídio possível!\n🎯 Indicar: linha de entrada Direcional (Viva Vida, Conquista).\n⚠️ Precisa de bom FGTS ou disposição para parcelar a entrada.",
  "ganha 2000": "Cliente com R$ 2.000 de renda → parcela máxima ~R$ 600 (30%). Faixa 1 do MCMV, maior subsídio possível!\n🎯 Indicar: linha de entrada Direcional (Viva Vida, Conquista).",
  "renda de 3000": "Cliente com R$ 3.000 de renda → parcela máxima R$ 900 (30%). Faixa 2 do MCMV (subsídio de até R$ 55 mil).\n🎯 Indicar: Village Torres, Conquista, Parque Ville.",
  "ganha 3000": "Cliente com R$ 3.000 de renda → parcela máxima R$ 900 (30%). Faixa 2 do MCMV (subsídio de até R$ 55 mil).",
  "renda de 4000": "Cliente com R$ 4.000 de renda → parcela máxima R$ 1.200 (30%). Final da Faixa 2.\n🎯 Indicar: Solar das Torres, Brisas do Horizonte.",
  "renda de 5000": "Cliente com R$ 5.000 de renda → parcela máxima R$ 1.500 (30%). Faixa 3 do MCMV (sem subsídio, juros reduzidos).\n🎯 Indicar: melhores Direcional ou primeiros da linha Riva.",
  "renda de 8000": "Cliente com R$ 8.000+ → parcela máxima a partir de R$ 2.400 (30%). Faixa 4 do MCMV.\n🎯 Indicar: linha RIVA — Amazon Boulevard, Zenith, Park Golf.",
  "renda de 10000": "Cliente com R$ 10.000+ → parcela a partir de R$ 3.000 (30%). Faixa 4 / SBPE.\n🎯 Indicar: alto padrão RIVA — Estilo Ponta Negra, Luar Ponta Negra, Zenith, Amazon Boulevard Prime.",
  "renda de 12000": "Cliente com R$ 12.000+ → acima do limite MCMV, financiamento via SBPE.\n🎯 Indicar: linha Premium RIVA — Estilo Ponta Negra, Luar Ponta Negra, Zenith.",

  // ==========================================
  // 🏡 MINHA CASA MINHA VIDA (MCMV 2026) E CAIXA
  // ==========================================
  "faixas de renda": "O MCMV 2026 está dividido em:\n\n🔵 *Faixa 1:* Até R$ 2.850,00 — maior subsídio.\n🟡 *Faixa 2:* R$ 2.850,01 a R$ 4.700,00 — subsídio de até R$ 55 mil.\n🟠 *Faixa 3:* R$ 4.700,01 a R$ 8.600,00 — juros reduzidos.\n🔴 *Faixa 4 (Nova):* R$ 8.600,01 a R$ 12.000,00.\n\nQual a renda familiar bruta do cliente?",
  "faixa 1": "Faixa 1 do MCMV: renda até R$ 2.850,00. Maior subsídio possível — pode chegar a 95% de desconto do governo!",
  "faixa 2": "Faixa 2 do MCMV: renda de R$ 2.850,01 a R$ 4.700,00. Subsídio de até R$ 55 mil na entrada!",
  "faixa 3": "Faixa 3 do MCMV: renda de R$ 4.700,01 a R$ 8.600,00. Sem subsídio, mas juros bem abaixo do mercado.",
  "faixa 4": "Faixa 4 (nova!): renda de R$ 8.600,01 a R$ 12.000,00. Permite financiar imóveis de até R$ 500 mil em até 420 meses.",

  "fgts": "Sim! É possível usar o FGTS para abater a entrada. Basta ter pelo menos 3 anos de trabalho com carteira assinada (somando todos os empregos) e não ter outro imóvel no nome na mesma localidade.",

  // ==========================================
  // 📄 MODALIDADES DE COMPRA — ANÁLISE INTERNA
  // ==========================================
  "modalidades": "Temos 3 modalidades de compra:\n\n1️⃣ *Venda à Vista* — sem análise de crédito, documentação simplificada.\n2️⃣ *Tabela Investidor* — parcelas lineares, sem análise bancária tradicional.\n3️⃣ *Financiamento Direto* — análise interna de crédito, até 120x após habite-se.\n\nQual modalidade você quer saber mais?",

  "venda a vista": "Na *Venda à Vista*, não há análise de crédito! Documentos necessários (PF):\n1. Ficha de Cadastro interna\n2. RG/CPF, CNH ou documento com foto\n3. Certidão de Estado Civil (nascimento/casamento)\n4. Comprovante de endereço (60 dias) — IR aceito nessa modalidade\n\n⚠️ União estável não substitui certidão de estado civil.",

  "venda a vista pj": "Na *Venda à Vista PJ*, sem análise de crédito! Documentos necessários:\n1. Ficha de Cadastro interna\n2. Cartão CNPJ\n3. Contrato Social / última alteração contratual\n4. Sócios: RG/CPF e CNH\n5. Certidão de Estado Civil dos sócios\n6. Comprovante de endereço (60 dias) — IR aceito",

  "tabela investidor": "Na *Tabela Investidor*, não há análise de crédito bancária! O fluxo é de acordo com a política do produto e as parcelas são SEMPRE lineares.\n\nDocumentos PF:\n1. Ficha de Cadastro interna\n2. RG/CPF, CNH ou documento com foto\n3. Certidão de Estado Civil\n4. Comprovante de endereço (60 dias) — IR aceito\n\n⚠️ União estável não substitui certidão de estado civil.",

  "tabela direta": "No *Financiamento Direto (Tabela Direta)*, fazemos análise de crédito interna!\n\n*Política vigente:*\n• ATO: 10% + Pré Obra (mensais + INCC): 30% + Pós Habite-se (IPCA + 1%): 60%\n• Restrições até R$ 3.000,00\n• Até 40% da renda para parcelas pós habite-se\n• Parcelamento em até 120x (pós obra)\n• Idade máxima: 79 anos, 11 meses e 29 dias\n\nDocumentos PF:\n1. Ficha de Cadastro com renda e despesas\n2. RG/CPF ou documento com foto\n3. Pesquisa SERASA (opcional)\n4. Certidão de Estado Civil\n5. Comprovante de endereço (60 dias)",

  "financiamento direto": "O *Financiamento Direto* é nossa modalidade com análise de crédito interna!\n\n*Condições:*\n• ATO: 10% | Pré Obra (INCC): 30% | Pós Habite-se (IPCA+1%): 60%\n• Parcelas pós obra: até 40% da renda validada\n• Até 120 parcelas após o habite-se\n• Restrições: aceitas até R$ 3.000 (acima é analisado pela gestão)\n• Idade máxima do participante: 79a 11m 29d\n\nQuer saber sobre documentos ou sobre como funciona a comprovação de renda?",

  "renda formal": "Para *Renda Formal* no Financiamento Direto:\n• 3 últimos contracheques ou benefícios\n• Pró-labore: 3 últimos + DARFs pagas\n• Imposto de Renda 2024\n• Cliente sem restrição: apresentar resposta de análise de crédito bancário\n\n⚠️ A resposta de crédito para o Associativo NÃO condiciona o resultado da análise interna.",

  "renda informal": "Para *Renda Informal* no Financiamento Direto:\n• Extratos bancários dos últimos 6 meses consecutivos\n\nO extrato válido deve ter:\n✅ Cabeçalho com logo do banco, nome do titular, período e agência/conta\n✅ Período fechado (30/31 dias por mês)\n❌ Movimentações entre cônjuges e parentes: desconsideradas\n❌ Entrada e saída simultâneas: descartadas\n❌ PIX/transferências do próprio titular: não aceitas\n❌ Extrato com saldo final negativo: anulado\n❌ Ganho de capital, resgate, venda de imóvel, doações, heranças: não valem",

  "financiamento direto pj": "Para *Financiamento Direto PJ*, a comprovação é por movimentação bancária:\n✅ Extratos bancários dos últimos 6 meses consecutivos em nome da Razão Social\n❌ Balanço patrimonial, declarações de faturamento e outros documentos NÃO são aceitos\n\nDocumentos necessários:\n1. Ficha de Cadastro interna\n2. Cartão CNPJ + Pesquisa Serasa (opcional)\n3. Contrato Social e última alteração\n4. Sócios: RG/CPF e CNH\n5. Certidão de Estado Civil\n6. Comprovante de endereço (60 dias) — IR aceito",

  "cliente exterior": "Para *Clientes do Exterior* no Financiamento Direto:\n• Documentos em português (como Portugal): sem necessidade de tradução\n• Renda formal: deve ser traduzida + ao menos 1 extrato bancário com valor líquido\n• Extratos: tradução de ao menos 1 documento\n⚠️ Documentos adicionais podem ser solicitados durante a análise.",

  "restricao": "Restrições são aceitas até R$ 3.000,00 no Financiamento Direto. Casos acima da política são analisados pela gestão de crédito, considerando o valor de ATO a ser pago e bloqueio de comissão.",

  // ==========================================
  // 📋 REGISTRO E ENTREGA DE CHAVES
  // ==========================================
  "registro": "Sobre o *Registro do imóvel*:\n• É o procedimento legal que publica a aquisição do imóvel\n• Só é realizado após a averbação do HABITE-SE (com individualização de matrícula e IPTU)\n• Prazo médio: 50 dias\n• O cliente pode usar despachante próprio ou nosso parceiro\n• Para Financiamento Direto: cliente deve estar ADIMPLENTE para iniciar o registro\n• Empreendimentos finalizados (ex: Eliza Mall, Allegro Mall) já têm os documentos prontos para escritura.",
  "habite-se": "O HABITE-SE é a certidão que comprova a conclusão da obra. Só após sua averbação é possível realizar o registro individual do apartamento e a emissão da escritura.",
  "chaves": "A *Entrega de Chaves* exige:\n1. Vistoria realizada e atestada pelo comprador\n2. Escritura registrada no Cartório de Registro de Imóveis",
  "entrega de chaves": "A *Entrega de Chaves* exige:\n1. Vistoria realizada e atestada pelo comprador\n2. Escritura registrada no Cartório de Registro de Imóveis",
  "cancelamento": "Para cancelar uma análise de crédito anterior, o cliente precisa preencher e assinar a 'Carta de Cancelamento' com CPF e data.",

  // ==========================================
  // 📄 DOCUMENTAÇÃO GERAL
  // ==========================================
  "documentos": "Para a análise de crédito, precisamos de:\n1. RG/CPF ou CNH\n2. Certidão de Estado Civil (nascimento ou casamento)\n3. Comprovante de endereço (máximo 60 dias)\n\n⚠️ Se for casado(a), os mesmos documentos do cônjuge são necessários. União estável não substitui certidão oficial.",
  "documentacao": "Para a análise de crédito, precisamos de:\n1. RG/CPF ou CNH\n2. Certidão de Estado Civil\n3. Comprovante de endereço (60 dias)\n\n⚠️ Casado(a)? Precisamos dos documentos do cônjuge também.",
  "analise": "Nossa análise de crédito é interna e rápida! Precisamos de: RG/CPF, Certidão de Estado Civil e Comprovante de Endereço atualizado. Se casado(a) no civil, documentos do cônjuge também.",
  "pj": "Para Pessoa Jurídica (PJ), além dos documentos pessoais:\n1. Cartão CNPJ\n2. Contrato Social ou última alteração contratual\n3. RG/CPF ou CNH dos sócios",
  "autonomo": "Para autônomos, além dos documentos pessoais:\n1. Cartão CNPJ (se houver)\n2. Contrato Social / última alteração\n3. Extratos bancários dos últimos 6 meses",
  "cnpj": "Para clientes com CNPJ:\n1. Cartão CNPJ\n2. Contrato Social / última alteração\n3. RG/CPF ou CNH dos sócios",

  // ==========================================
  // 🏢 EMPREENDIMENTOS DIRECIONAL (MCMV)
  // ==========================================
  // 🌿 BOSQUE DAS TORRES — DETALHES COMPLETOS
  "bosque das torres": "🏠 *Bosque das Torres* — Direcional (MCMV)\n\n📍 Av. das Torres — Lago Azul, Manaus/AM\n\n🏢 *Ficha Técnica:*\n• 26 blocos residenciais\n• Tipologia: 1 e 2 quartos | Área privativa: 36,24 m²\n• Garden (térreo, aptos 101-104): 36,24 m² + 14,35 m² = 50,59 m² total\n\n🛋️ *Acabamentos:*\n• Bancadas em mármore sintético com cuba integrada\n• Tanque em SMC (material compósito de alta resistência), sem coluna\n• Esquadrias em alumínio branco\n• Revestimento cerâmico até 1,50 m nas áreas molhadas\n• Previsão de split nas unidades\n• Bacias dual flush\n\n🎉 *22 itens de lazer (entregue mobiliado e equipado):*\nPiscinas adulto e infantil, Multi Wash (lavagem compartilhada), Espaço Food Truck fixo, Playbaby, Playground, Churrasqueira, Salão de festas, Quadra esportiva, Redário, Pet place, Bicicletário, Guarita com espaço delivery, Controle de acesso automatizado em todos os blocos\n\n🌱 *Sustentabilidade:* Medição individualizada de água e gás, paisagismo com espécies nativas amazônicas\n\n📍 Pertinho do Shopping Via Norte!",

  "bosque": "🏠 *Bosque das Torres* — Av. das Torres, Lago Azul | MCMV\n26 blocos | 1 e 2 quartos | 36,24 m² | Garden +14,35 m².\n22 itens de lazer: piscinas, Multi Wash, food truck, playbaby, quadra, pet place e mais!\nMedição individual de água. Perto do Shopping Via Norte.",

  // ==========================================
  // 🌳 BOSQUE DAS TORRES — CONHECIMENTO COMPLETO PARA CORRETORES
  // ==========================================

  "bosque ficha tecnica": "📋 *Ficha Técnica — Bosque das Torres:*\n\n📍 Rua Dona Debla Henriques, nº 450 — Lago Azul, Manaus/AM\n🏗️ Sistema construtivo: Parede de Concreto\n🏢 26 Blocos | 5 Pavimentos (Térreo + 4)\n🏠 4 unidades por andar\n🔢 520 unidades totais (16 adaptadas a PCD)\n🌿 104 apartamentos com garden (térreo)\n🅿️ 529 vagas: 174 carros moradores + 313 motos moradores + 29 carros visitantes + 4 motos visitantes + 8 extras salão + 1 carga/descarga\n📐 Área privativa: 36,24 m²\n📏 Área total do terreno: 25.304,24 m²",

  "endereco bosque": "📍 *Endereço — Bosque das Torres:*\nRua Dona Debla Henriques, nº 450 — Lago Azul, Manaus/AM\n(Acesso principal pela Avenida das Torres, Zona Norte)",

  "quantas unidades bosque": "O Bosque das Torres tem *520 unidades* no total:\n• 16 unidades adaptadas a PCD\n• 104 apartamentos no térreo com garden privativo\n• 26 blocos | 5 pavimentos (térreo + 4) | 4 aptos por andar",

  "quantos blocos bosque": "O Bosque das Torres tem *26 blocos residenciais*, cada um com 5 pavimentos (térreo + 4 andares) e 4 apartamentos por andar.",

  "vagas bosque": "🅿️ *Vagas — Bosque das Torres:*\n\n529 vagas no total:\n• 174 vagas para carros (moradores)\n• 313 vagas para motos (moradores)\n• 29 vagas para carros (visitantes)\n• 4 vagas para motos (visitantes)\n• 8 vagas extras para salão de festas\n• 1 vaga para carga/descarga de caminhão\n\n⚠️ Tem vaga para moto! Ótimo diferencial.",

  "vaga moto bosque": "✅ Sim! O Bosque das Torres tem *313 vagas para motos* destinadas a moradores — um diferencial importante para quem usa moto no dia a dia.",

  "tipologia bosque": "🏠 *Tipologias disponíveis — Bosque das Torres:*\n\n1️⃣ *Apartamento Tipo* — 1 quarto | 36,24 m² | Blocos 01 a 26\n2️⃣ *Apartamento Térreo Garden* — 2 quartos | 36,24 m² + 14,35 m² garden | Blocos 01/02, 05 a 14 e 21 a 26 (aptos 101 e 104) e todos os blocos (aptos 102 e 103)\n3️⃣ *Apartamento Adaptável Garden (PCD)* — 1 quarto | 36,24 m² + 14,35 m² | Blocos 03, 04 e 15 a 20 (aptos 101 e 104)\n4️⃣ *Apartamento Studio Garden* — 1 quarto | 36,24 m² + 14,35 m² | Blocos 03, 04 e 15 a 20 (aptos 101 e 104)\n\n⚠️ Todos os apartamentos têm 36,24 m² de área privativa. O garden acrescenta 14,35 m².",

  "metragem bosque": "📐 *Metragens — Bosque das Torres:*\n\n• Área privativa (todos os aptos): *36,24 m²*\n• Área garden (térreo): *+ 14,35 m²*\n• Total garden: *50,59 m²*\n\n⚠️ Sala e quartos NÃO têm piso — entregues com laje de concreto sem acabamento. O cliente coloca o piso.",

  "piso bosque": "⚠️ *Atenção ao piso — Bosque das Torres:*\n\n• Sala, jantar e circulação: laje em concreto *SEM acabamento* (cliente coloca)\n• Quartos: laje em concreto *SEM acabamento* (cliente coloca)\n• Banheiro: cerâmica ✅\n• Cozinha e área de serviço: cerâmica ✅\n\nIsso é importante informar ao cliente antes da compra!",

  "acabamento bosque": "✨ *Acabamentos — Bosque das Torres:*\n\n🛋️ *Sala/Jantar/Circulação:*\n• Piso: laje SEM acabamento\n• Paredes e teto: pintura rolada\n\n🛏️ *Quartos:*\n• Piso: laje SEM acabamento\n• Paredes e teto: pintura rolada\n\n🚿 *Banheiro:*\n• Piso e rodapé: cerâmica\n• Box: cerâmica do piso ao teto\n• Parede lavatório: cerâmica até ~1,00 m\n• Demais paredes: pintura rolada\n• Teto: forro de gesso (ou laje no último pav.) com pintura\n• Louças: bacia com caixa acoplada | lavatório sem coluna\n• Metais: torneira e registros cromados\n\n🍳 *Cozinha/Área de Serviço:*\n• Piso e rodapé: cerâmica\n• Parede hidráulica: cerâmica até ~1,50 m\n• Bancada: mármore sintético com cuba integrada\n• Teto: laje com pintura rolada\n• Metais: torneiras cromadas\n• Tanque: SMC (Sheet Molding Compounds) sem coluna",

  "memorial descritivo bosque": "📋 *Memorial Descritivo — Bosque das Torres:*\n\n🛋️ Sala/circulação: Piso SEM acabamento | Pintura rolada\n🛏️ Quartos: Piso SEM acabamento | Pintura rolada\n🚿 Banheiro: Cerâmica piso e box ao teto | Lavatório sem coluna | Bacia c/ caixa acoplada\n🍳 Cozinha/ÁS: Cerâmica | Bancada mármore sintético c/ cuba integrada | Tanque SMC sem coluna\n🪟 Esquadrias: Alumínio branco\n💧 Previsão split | Dual flush | Medição individual de água | LED áreas comuns | Sensor de presença no hall",

  "banheiro bosque": "🚿 *Banheiro — Bosque das Torres:*\n• Piso: cerâmica\n• Rodapé: cerâmica do piso cortada\n• Box: cerâmica do piso ao teto\n• Parede lavatório: revestimento cerâmico ~1,00 m\n• Louças: bacia com caixa acoplada, lavatório sem coluna\n• Metais: torneira e registros cromados\n• Teto: forro de gesso (ou laje no último pavimento)",

  "cozinha bosque": "🍳 *Cozinha/Área de Serviço — Bosque das Torres:*\n• Piso: cerâmica\n• Parede hidráulica: cerâmica até ~1,50 m\n• Bancada: mármore sintético com cuba integrada\n• Metais: torneiras cromadas\n• Tanque: SMC sem coluna (material resistente)\n• Teto: laje com pintura rolada",

  "garden bosque": "🌿 *Garden — Bosque das Torres:*\n\nApartamentos do térreo têm área garden privativa de *14,35 m²* (descoberta).\nTotal do garden: 36,24 m² + 14,35 m² = *50,59 m²*.\n\n• 104 unidades com garden no total\n• Garden é da unidade — uso exclusivo do morador\n• Aptos 101, 102, 103 e 104 de todos os blocos são garden\n• Blocos 03/04 e 15-20: garden PCD (adaptável) ou Studio\n\n⚠️ Unidades garden são as mais procuradas — sinal ágil!",

  "garden bosque bloco": "📌 *Quais blocos têm garden — Bosque das Torres:*\n\n*Térreo garden (aptos 101 e 104):*\n• Blocos 01, 02, 05 a 14 e 21 a 26 → Apartamento 2Q Garden\n• Blocos 03, 04, 15 a 20 → Adaptável PCD ou Studio 1Q Garden\n\n*Térreo garden (aptos 102 e 103):*\n• Todos os blocos 01 a 26 → Garden\n\n✅ Praticamente todo térreo tem garden!",

  "pcd bosque": "♿ *Unidades PCD — Bosque das Torres:*\n\n• 16 unidades adaptadas a PCD no total\n• Ficam nos blocos 03, 04, 15 a 20 (aptos 101 e 104)\n• São 1 quarto | 36,24 m² + 14,35 m² garden\n• Planta adaptável: espaço de manobra para cadeirante, barras de apoio\n\nÓtimo para clientes com necessidades especiais ou família com PCD.",

  "lazer bosque": "🎉 *22 itens de lazer — Bosque das Torres (entregue mobiliado e equipado!):*\n\n🏊 Piscina Adulto\n🏊 Piscina Infantil\n☀️ Solarium\n🍖 Churrasqueira com apoio\n🍽️ Espaço Gourmet + Apoio Gourmet\n🏋️ Fitness Externo\n🛝 Playground\n👶 Playbaby\n🎮 Praça de Jogos\n😴 Redário\n🐾 Pet Place\n🚲 Bicicletário\n🚗 Multi Wash (lavagem de carro compartilhada)\n🚚 Espaço Food Truck\n⛹️ Quadra Esportiva\n🚚 Guarita + Espaço Delivery\n🔒 Controle de acesso automatizado em todos os blocos\n🗑️ Lixeira e ETE\n💼 Apoio Funcionários\n🛒 Reservatórios\n\n⭐ Tudo ENTREGUE mobiliado e equipado!",

  "multi wash bosque": "🚗 *Multi Wash — Bosque das Torres:*\nÉ o espaço compartilhado para *lavagem de veículos* dentro do condomínio!\nO morador usa a área equipada (mangueira, água pressurizada) para lavar o carro ou moto sem sair do condomínio. Um super diferencial!",

  "food truck bosque": "🚚 *Espaço Food Truck — Bosque das Torres:*\nÁrea coberta e aberta com mesas para receber food trucks fixos ou rotativos. Ideal para lanches no final de semana sem sair de casa. Diferencial muito bem recebido pelos clientes!",

  "delivery bosque": "📦 *Espaço Delivery — Bosque das Torres:*\nGuarita com espaço dedicado para recebimento e armazenamento de encomendas. O morador pode receber pacotes, roupas e mantimentos com segurança mesmo quando não está em casa.",

  "quadra bosque": "⛹️ *Quadra Esportiva — Bosque das Torres:*\nQuadra poliesportiva com marcações para futsal, basquete e vôlei. Entregue equipada.",

  "piscina bosque": "🏊 *Piscinas — Bosque das Torres:*\n• Piscina adulto (espaçosa, com solarium e espreguiçadeiras)\n• Piscina infantil\n• Solarium com espreguiçadeiras e guarda-sóis\n\nTudo entregue mobilado e equipado!",

  "vizinhanca bosque": "📍 *Vizinhança — Bosque das Torres (Av. das Torres, Lago Azul):*\n\n🎓 *Educação:*\n• 1 min: E. E. Eliana Braga\n• 2 min: Colégio Militar da P.M. VI\n• 3 min: Escola Mun. Viviane Estrela\n• 4 min: Escola Integral João S. Braga\n• 8 min: E. E. Prof. Sebastião A. L. Filho / E. E. Prof. Samuel Benchimol\n\n🏥 *Saúde:*\n• 2 min: UBS José Figliuolo\n• 4 min: Clínica da Família C. Nicolau\n• 9 min: Clínica da Família C. Gracie\n• 8 min: USF Sálvio Belota\n• 11 min: Hospital Delphina Aziz\n\n🛒 *Compras:*\n• 2 min: Nova Era Av. das Torres\n• 7 min: Hiper DB Nova Cidade\n• 8 min: Shopping Via Norte | Havan | Nova Era Via Norte\n• 13 min: Sumaúma Park Shopping\n\n🚌 *Transporte:*\n• 5 min: Terminal 6 e Terminal 7\n• Linhas 041, 354 e 357",

  "transporte bosque": "🚌 *Transporte — Bosque das Torres:*\n\n• 5 min: Terminal 6\n• 5 min: Terminal 7\n\nLinhas de ônibus:\n• 041 — Viver Melhor / Nova Cidade / Terminal 4\n• 354 — Viver Melhor / Av. Turismo / Ponta Negra\n• 357 — Viver Melhor / Av. das Flores / T3 / T1 / Centro",

  "saude bosque": "🏥 *Saúde próxima ao Bosque das Torres:*\n• 2 min: UBS José Figliuolo\n• 4 min: Clínica da Família C. Nicolau\n• 8 min: USF Sálvio Belota\n• 9 min: Clínica da Família C. Gracie\n• 11 min: Hospital Delphina Aziz",

  "escola bosque": "🎓 *Escolas próximas ao Bosque das Torres:*\n• 1 min: E. E. Eliana Braga\n• 2 min: Colégio Militar da P.M. VI\n• 3 min: Escola Mun. Viviane Estrela\n• 4 min: Escola Integral João S. Braga\n• 8 min: E. E. Prof. Sebastião A. L. Filho\n• 8 min: E. E. Prof. Samuel Benchimol",

  "shopping bosque": "🛍️ *Shoppings próximos ao Bosque das Torres:*\n• 8 min: Shopping Via Norte\n• 8 min: Havan\n• 13 min: Sumaúma Park Shopping",

  "diferenciais bosque": "🌟 *Diferenciais — Bosque das Torres:*\n\n✅ Lazer entregue MOBILIADO e EQUIPADO\n✅ 22 itens de lazer\n✅ Controle de acesso automatizado em todos os blocos\n✅ Portão automático de veículos\n✅ Multi Wash (lavagem de carro no condomínio)\n✅ Espaço Food Truck\n✅ Espaço Delivery na guarita\n✅ Previsão de split nas unidades\n✅ Medição individual de água\n✅ Piscinas adulto e infantil com solarium\n✅ Esquadrias em alumínio branco\n✅ Paisagismo com espécies nativas amazônicas\n✅ LED e sensor de presença nas áreas comuns\n✅ Torneiras com arejadores (economia de água)",

  "sustentabilidade bosque": "🌱 *Sustentabilidade — Bosque das Torres:*\n• Previsão de medição de água individualizada\n• Torneiras com arejadores (aptos e áreas comuns)\n• Coleta seletiva de lixo\n• Iluminação LED nas áreas comuns\n• Luminárias com sensor de presença nos halls\n• Paisagismo com espécies nativas amazônicas\n• Dual flush nas bacias (economia de até 40% de água)",

  "quantos andares bosque": "O Bosque das Torres tem *5 pavimentos* por bloco: térreo + 4 andares.\n\nOs apartamentos são numerados:\n• Térreo: 101, 102, 103, 104\n• 2º andar: 201, 202, 203, 204\n• 3º andar: 301, 302, 303, 304\n• 4º andar: 401, 402, 403, 404\n• 5º andar: 501, 502, 503, 504\n\nTodos com 36,24 m² de área privativa.",

  "apartamento tipo bosque": "🏠 *Apartamento Tipo — Bosque das Torres:*\n• 1 quarto\n• Área privativa: 36,24 m²\n• Sem garden\n• Disponível em todos os blocos (01 a 26)\n• Andares: 201 a 504 (2º ao 5º pavimento)\n• Piso: SEM acabamento em sala e quarto | cerâmica em banheiro e cozinha",

  "apartamento garden bosque": "🌿 *Apartamento Garden — Bosque das Torres:*\n• 2 quartos (aptos 101/104 nos blocos 01/02 e 05-14 e 21-26)\n• 1 quarto adaptável/studio (aptos 101/104 nos blocos 03/04 e 15-20)\n• Todos os aptos 102 e 103 do térreo: garden em todos os 26 blocos\n• Área privativa: 36,24 m²\n• Área garden: + 14,35 m² (descoberta, uso exclusivo)\n• Total: 50,59 m²",

  "1 quarto bosque": "🏠 O Bosque das Torres tem apartamentos de *1 quarto*!\n\nSão os apartamentos Tipo (andares superiores) e alguns do térreo:\n• Apartamento Tipo: 1Q | 36,24 m² | sem garden | blocos 01 a 26\n• Apartamento Studio Garden: 1Q | 36,24 m² + 14,35 m² garden | blocos 03, 04 e 15-20\n• Apartamento Adaptável Garden (PCD): 1Q | 36,24 m² + 14,35 m² garden | blocos 03, 04 e 15-20\n\n⚠️ Renda mínima para 1Q no MCMV: ~R$ 2.401.",

  "2 quartos bosque": "🏠 O Bosque das Torres tem apartamentos de *2 quartos*!\n\nSão os apartamentos do térreo com garden:\n• Aptos 101 e 104 (blocos 01/02 e 05-14 e 21-26): 2Q | 36,24 m² + 14,35 m² garden\n• Aptos 102 e 103 (todos os blocos): 2Q | 36,24 m² + 14,35 m² garden\n\n⚠️ Os 2 quartos estão APENAS no térreo com garden. Andares superiores são todos 1 quarto.",

  "studio bosque": "🏠 *Apartamento Studio Garden — Bosque das Torres:*\n\n• 1 quarto (layout aberto, sem divisória fixa quarto/sala)\n• Área privativa: 36,24 m²\n• Garden: + 14,35 m²\n• Blocos: 03, 04, 15 a 20 | Aptos 101 e 104 (térreo)\n\nIdeal para quem mora sozinho ou casal sem filhos que quer garden!",

  "renda bosque 1q": "Para um apartamento de *1 quarto no Bosque das Torres*:\n• Renda mínima: ~R$ 2.401 (regra MCMV para apto 1Q)\n• Parcela máxima: 30% da renda\n• Faixa recomendada: F1 ou F2 do MCMV\n\n🎯 Cliente com renda de R$ 2.500 a R$ 4.700 se encaixa bem!",

  "qual andar bosque": "No Bosque das Torres, os andares são organizados assim:\n\n• Térreo (101-104): garden privativos\n• 2º ao 5º andar (201-504): apartamentos tipo sem garden\n\nTodos têm 36,24 m². A diferença está em ter ou não garden e se são 1 ou 2 quartos.\n\n💡 Andar mais alto = mais ventilação, mas sem garden. Térreo = garden privativo.",

  "vizinho bosque": "📍 O Bosque das Torres fica na *Av. das Torres, Lago Azul*. Nas proximidades há outros empreendimentos Direcional:\n• Village Torres (ao lado)\n• Solar das Torres (próximo)\n• Vista das Torres (próximo)\n\nToda a região da Av. das Torres está em grande crescimento na Zona Norte!",
  "village torres": "🏠 *Village Torres* — Direcional (MCMV)\n\n📍 Av. das Torres — Lago Azul, Zona Norte\n\n• Tipologia: APENAS 2 quartos | Área: 36m²\n• Piso: cerâmica apenas em cozinha, banheiro e lavatório (sala e quartos SEM piso — por conta do cliente)\n• Lazer: piscinas, espaço fitness, Connect Garden\n\n⚠️ Este empreendimento tem somente 2 quartos. Não tem 1 nem 3 quartos.",
  "village": "🏠 *Village Torres* — Lago Azul | MCMV | 2 quartos | 36m² | Piso só em cozinha/banheiro.\nLazer: piscinas, fitness, Connect Garden.\n⚠️ Somente 2 quartos.",
  "solar das torres": "O *Solar das Torres* está na Avenida das Torres! Lazer completo entregue equipado, piscinas, churrasqueira e guarita de segurança.",
  // 🌿 BRISAS DO HORIZONTE — DETALHES COMPLETOS
  "brisas do horizonte": "🏠 *Brisas do Horizonte* — Direcional (MCMV)\n\n📍 Rua Ivailândia, nº 485 — Coroado, Manaus/AM (Zona Leste)\n\n🏢 *Ficha Técnica:*\n• Torres de 19 pavimentos (térreo + 18)\n• Sistema construtivo: parede de concreto\n• Tipologias: 2 quartos | Tipo: 43,41 a 45,67 m² | Garden térreo: 53,87 a 59,19 m²\n• Esquadrias em alumínio branco\n\n🎉 *Lazer completo:*\nPiscina, Coworking, Espaço Beauty, Sport Bar, Game Station, Espaço Gourmet, Churrasqueira com apoio, Redário, Praça de Jogos, Playground, Playbaby, Bicicletário, Mini mercado (operado pelo condomínio)\n\n🌱 *Sustentabilidade:* Dual flush, LED áreas comuns, sensor de presença, previsão split, FGTS permitido\n\n📍 *Vizinhança:*\n• 1 min: Supermercado Vitória\n• 2 min: Escola Mun. Profª Maria Rodrigues Tapajós\n• 3 min: SPA Coroado\n• 5 min: Estádio Carlos Zamith\n• 6 min: Park Mall Ephigênio Salles\n• 7 min: UFAM (Setor Sul), Hospital Dr. João Lúcio, Samel São José\n• 8 min: Sesi Clube do Trabalhador\n• 14 min: Manauara Shopping\n\n🚌 *Transporte:* Linhas 542, 541, 540 | Terminais T1 e interbairros 001 e 002\nRegistro: R-13-693 (4º CRI Manaus) | IMPLURB nº 6305/2024",

  "brisas": "🏠 *Brisas do Horizonte* — Riva/Direcional | Coroado, Zona Leste\nTorres de 19 pavimentos | 2 quartos | Tipo: 43,41-45,67 m² | Garden: 53,87-59,19 m².\nLazer: piscina, coworking, espaço beauty, sport bar, gourmet, playground, playbaby.\nPróximo UFAM, Park Mall, Hospital João Lúcio e Carlos Zamith.",
  // 🌿 PARQUE VILLE LÍRIO AZUL — DETALHES COMPLETOS
  "parque ville lirio azul": "🏠 *Parque Ville Lírio Azul* — Direcional (MCMV)\n\n📍 Av. Santa Tereza D'Avila, 1096 — Lago Azul, Manaus/AM\nConceito 'bairro das flores' | Acesso fácil pela Av. das Torres e Av. Torquato Tapajós\n\n🏢 *Ficha Técnica:*\n• 30 torres | 5 pavimentos (térreo + 4) | 4 aptos/andar\n• 600 unidades (18 adaptadas a PCD | 102 com garden privativo)\n• Tipologia: 2 quartos | Área privativa: 40,67 m²\n• Garden tipo A (aptos 101/104): + 10,51 m² | Tipo B (aptos 102/103): + 17,17 m²\n• Terreno: 44.027,31 m² | Sistema construtivo: parede de concreto\n• Vagas: 600 (188 carros + 356 motos + 18 PCD + 38 visitantes)\n\n🎉 *Lazer completo:*\nPiscina adulto + infantil + solarium, Espaço gourmet, Churrasqueira, Espaço Yoga, Quadra esportiva, Fitness externo, Playground, Playbaby, Praça de jogos, Redário, Pet place, Piquenique, Bicicletário, Guarita, Área de Preservação Permanente (APP)\n\n🌱 *Sustentabilidade:* Dual flush, torneiras com arejador, previsão split, LED e sensor de presença\n\n📍 *Vizinhança:*\n• 1 min: Escola Integral João S. Braga\n• 2 min: Colégio Militar da PM VI, Escola Est. Eliana Braga, Nova Era, Clínica da Família C. Gracie\n• 4 min: UBS José Fligliuolo, Clínica da Família C. Nicolau, Terminal 6 e 7\n• 7 min: Shopping Via Norte, Havan, Fun Park\n• 8 min: Hospital Delphina Aziz",

  "lirio azul": "🏠 *Parque Ville Lírio Azul* — Av. Sta. Tereza D'Avila, 1096 | Lago Azul | MCMV\n30 torres | 600 unidades | 2 quartos | 40,67 m² | Garden: +10,51 a 17,17 m².\n102 unidades garden | 18 PCD | Espaço yoga, salão festas, car wash, bicicletário.\n1 min escola | 2 min Nova Era | 7 min Via Norte.",
  // 🌿 PARQUE VILLE ORQUÍDEA — DETALHES COMPLETOS
  "parque ville orquidea": "🏠 *Parque Ville Orquídea* — Direcional (MCMV)\n\n📍 Jardim Manaus — 1º bairro planejado da Direcional em Manaus!\nConectado pela Av. das Torres | Conceito clube exclusivo\n\n🛋️ *Tipologias — 2 quartos:*\n• Tipo Meio: 41,36 a 41,57 m² | Tipo Ponta: 41,37 m²\n• Garden Meio: 41,36-41,57 m² + 15,80-15,90 m² garden\n• Garden Ponta: 41,37 m² + 14,25 m² garden\n• Garden Studio (1Q): 41,57 m² + 15,80 m² garden\n• Garden PCD (1Q adaptado): 41,57 m² + 15,80 m² garden\n\n✨ *Acabamentos:* Piso cerâmico (laminado nos quartos; cerâmica no térreo), bancada mármore sintético c/ cuba integrada, torneiras cromadas, dual flush, arejador, previsão split, esquadrias alumínio branco\n\n🎉 *Lazer — conceito clube exclusivo:*\nPiscina adulto + infantil + solarium, Salão de festas, Churrasqueira, Quadra esportiva, Fitness, Fitwall, Playground, Praça de Jogos, Pet place, Food truck, Car wash, Bicicletário, Guarita\n\n🌱 *Sustentabilidade:* Dual flush, arejador, previsão split, LED, sensor de presença\n\n📍 *Vizinhança:*\n• 1-2 min: Escola Mun. Viviane Estrela, Clínica da Família C. Nicolau\n• 3-4 min: Veneza Express, Nova Era, Terminal 6, Colégio Militar PM VI\n• 7 min: Shopping Via Norte\n• 10 min: Hospital Delphina Aziz\n• 12 min: Sumaúma Park Shopping",

  "orquidea": "🏠 *Parque Ville Orquídea* — Jardim Manaus | MCMV\n2 quartos | Tipo: 41,36-41,57 m² | Garden disponível.\nConceito clube exclusivo: piscinas, food truck, car wash, fitness, fitwall.\n7 min Via Norte | 10 min Hospital Delphina Aziz.",
  // 🌿 CONQUISTA TOPÁZIO — DETALHES COMPLETOS
  "conquista topazio": "🏠 *Conquista Topázio* — Direcional (MCMV)\n\n📍 Av. Torquato Tapajós — acesso rápido aos polos industriais\n\n🏗️ *Construção:* Paredes estruturais em concreto moldado in loco — maior velocidade de obra e desempenho estrutural.\n\n🛋️ *Acabamentos:*\n• Portas internas em madeira (verniz ou pintura branca)\n• Portas externas com ferragens cromadas de alta durabilidade contra umidade\n• Previsão de split com área técnica integrada à fachada\n• Bacias dual flush\n\n🎉 *Lazer completo:*\nPiscina adulto e infantil, Churrasqueiras independentes (sem conflito de ruídos), Playground com piso emborrachado, Quadra esportiva, Salão de festas\n\n📍 *Vizinhança:* Vizinho ao Allegro Mall e próximo ao Shopping Via Norte.",

  "topazio": "🏠 *Conquista Topázio* — Av. Torquato Tapajós | MCMV\nParedes em concreto moldado, previsão split, churrasqueiras independentes, playground com piso emborrachado.\nVizinho ao Allegro Mall e próximo ao Shopping Via Norte.",
  // 🌿 CONQUISTA JARDIM BOTÂNICO — DETALHES COMPLETOS
  "conquista jardim botanico": "🏠 *Conquista Jardim Botânico* — Direcional (MCMV)\n\n📍 Bairro Nova Cidade — próximo à Av. 7 de Maio e ao Shopping Via Norte\n\n🛋️ *Tipologia:* 2 quartos | Planta integrada (sala de estar + jantar) para ampliar sensação de espaço\n\n🏗️ *Infraestrutura:*\n• Ruas internas pavimentadas (asfalto ou bloco intertravado) para melhor drenagem\n• Reservatório dimensionado para autonomia em manutenção da rede pública\n• Bacias dual flush (economia de até 40% no consumo de água)\n\n🎉 *Lazer:* Churrasqueira, Playground, Quadra esportiva — todos entregues equipados\n\n✅ Entregue com piso em todos os ambientes!\n📍 Perto da Av. 7 de Maio e do Shopping Via Norte.",

  "jardim botanico": "🏠 *Conquista Jardim Botânico* — Nova Cidade | MCMV\n2 quartos | Planta integrada sala+jantar. Entregue com piso em todos os ambientes!\nRuas internas pavimentadas, reservatório autônomo, dual flush. Perto do Via Norte.",
  // 🌿 CONQUISTA JARDIM NORTE — DETALHES COMPLETOS
  "conquista jardim norte": "🏠 *Conquista Jardim Norte* — Direcional (MCMV)\n\n📍 Rua Vicente Martins, nº 900 — Santa Etelvina, Manaus/AM\n\n🏢 *Ficha Técnica:*\n• 26 blocos | 5 pavimentos (térreo + 4) | 4 aptos/andar\n• 520 unidades (16 adaptadas a PCD | 36 com garden privativo)\n• Tipologia: 2 quartos | Área privativa: 36,24 m²\n• Garden: área extra privativa no térreo\n• Terreno: 21.760,46 m² | Sistema: parede de concreto\n• Vagas: 520 (179 carros + 308 motos + 33 visitantes)\n\n✨ *Acabamentos:* Bancada mármore sintético c/ cuba integrada, laje sem acabamento sala/quartos (piso a cargo do cliente), cerâmica banheiro + gesso, dual flush, torneiras arejador, previsão split, esquadrias alumínio branco, paisagismo nativo\n\n🎉 *Lazer (entregue mobiliado e equipado):*\nPiscina adulto + infantil + solarium, Salão de festas com apoio, Churrasqueiras, Food Truck Plaza, Fitness externo, CrossFit, Quadra esportiva, Playground, Playbaby, Redário, Pet place, Piquenique, Bicicletário, Guarita, Controle de acesso automatizado\n\n🌱 *Sustentabilidade:* LED, sensor de presença, dual flush, arejador, medição individual de água, portão automático, paisagismo nativo\n\n📍 *Vizinhança:*\n• 1 min: Shopping Via Norte, Havan, Fun Park, Nova Era\n• 2 min: UBS Sálvio Belota, Feira do Santa Etelvina\n• 5-7 min: Terminal 06, 15º Distrito Policial, Hiper DB\n• Próximo: Hospital Delphina Aziz, Escola Dr. Viviane Estrela, Escola Lecita Ramos",

  "jardim norte": "🏠 *Conquista Jardim Norte* — Rua Vicente Martins, 900 | Santa Etelvina | MCMV\n26 blocos | 520 unidades | 2 quartos | 36,24 m² | 36 unidades garden.\n179 vagas carro + 308 motos. Lazer: piscinas, food truck, crossfit, playbaby, redário.\n1 min do Via Norte e Havan!",

  "jardim norte lazer": "🎉 *Lazer — Conquista Jardim Norte:*\nPiscina adulto + infantil + solarium, Salão de festas + apoio, Churrasqueiras, Food Truck Plaza, Fitness externo, CrossFit, Quadra esportiva, Playground, Playbaby, Redário, Pet place, Piquenique, Bicicletário.\nTudo entregue mobiliado e equipado! Controle de acesso automatizado.",

  // 💎 LUAR PONTA NEGRA — DETALHES COMPLETOS
  "luar ponta negra": "🏠 *Luar Ponta Negra* — Riva | Ponta Negra, Manaus/AM\n\n✨ Um dos empreendimentos mais privilegiados de Manaus — na região da Marina e Orla da Ponta Negra!\n\n🛋️ *Tipologias:* 2 e 3 quartos com suíte e varanda gourmet\n\n🎉 *Lazer completo:* Brinquedoteca, games, academia, piscina, churrasqueira, playground, salão de festas, controle de acesso automatizado\n\n📍 *Vizinhança:*\n• 2 min: Orla 92, Supermercado Veneza\n• 3 min: Orla da Ponta Negra\n• 7 min: Centro Educacional Século, Colégio Lato Sensu\n• 9 min: Shopping Ponta Negra\n\nRegião em expansão comercial: Food Park Orla 92 e Centro Comercial Carmel (45 lojas) em desenvolvimento.",

  "luar": "🏠 *Luar Ponta Negra* — Riva | Ponta Negra\n2 e 3 quartos com suíte e varanda gourmet. Lazer completo: academia, games, brinquedoteca.\n2 min da Orla 92 | 3 min da Orla | 9 min Shopping Ponta Negra.",
  // 🌿 CONQUISTA RIO NEGRO — DETALHES COMPLETOS
  "conquista rio negro": "🏠 *Conquista Rio Negro* — Direcional (MCMV)\n\n📍 Av. Frederico Baird, nº 2990 — Ponta Negra, próximo à Av. do Turismo e à Orla\n\n🛋️ *Tipologia:* 2 quartos com opção garden no térreo\n• Piso cerâmico em todo o apartamento\n• Rodapé cerâmico nas áreas molhadas\n• Janelas em alumínio com vidros para isolamento acústico\n• Bacias dual flush\n\n🌿 *Garden:* Unidades garden simulam a experiência de casa em área de floresta preservada — muito procuradas!\n\n🌱 *Paisagismo:* Projeto com vegetação nativa que atingirá porte adulto após entrega, criando microclima privativo.\n\n📍 Próximo à Orla da Ponta Negra e Avenida do Turismo. Stand de vendas no local para suporte.",

  "rio negro": "🏠 *Conquista Rio Negro* — Av. Frederico Baird, 2990 | Ponta Negra | MCMV\n2 quartos | Garden disponível (muito procurado!). Piso cerâmico, vidros com isolamento acústico.\nPróximo à Orla da Ponta Negra e Av. do Turismo.",
  "conquista via norte": "O *Conquista Via Norte* fica praticamente ao lado do Shopping Via Norte! Supermercados e lojas a poucos passos.",
  "via norte": "O *Conquista Via Norte* fica praticamente ao lado do Shopping Via Norte!",
  "viva vida rio amazonas": "O *Viva Vida Rio Amazonas* fica na região do Tarumã. Infraestrutura completa e lazer para a família.",
  "viva vida rio tapajos": "O *Viva Vida Rio Tapajós* é um grande sucesso na região do Tarumã. Áreas de lazer equipadas no padrão Direcional.",
  "viva vida coral": "O *Viva Vida Coral* está no Parque Pedras Raras. Lazer completo, ideal para o primeiro imóvel com subsídios do MCMV.",
  "coral": "O *Viva Vida Coral* está no Parque Pedras Raras. Perfeito para o primeiro imóvel com subsídios do MCMV.",

  // ==========================================
  // 💎 EMPREENDIMENTOS RIVA (MÉDIO E ALTO PADRÃO)
  // ==========================================
  "zenith": "O *Zenith Condomínio Clube* é um projeto espetacular Riva no Bairro São Francisco. Apartamentos de 2 quartos com suíte, varanda gourmet e unidades com garden. Mais de 25 itens de lazer e conceito Eco Zen!",
  "zenit": "O *Zenith Condomínio Clube* é um projeto espetacular Riva no Bairro São Francisco. 2 quartos com suíte, varanda gourmet, garden e mais de 25 itens de lazer.",
  "park golf": "O *Park Golf* fica na Av. das Torres, ao lado do campo de golfe! Área verde, conveniências urbanas (Assaí) e acabamento premium em granito.",
  "oasis": "O *Città Oasis Azzure* é um oásis urbano no coração de Manaus! Conceito de clube completo, arquitetura contemporânea e lazer paradisíaco.",
  "azzure": "O *Città Oasis Azzure* é um oásis urbano no coração de Manaus! Conceito de clube completo e lazer paradisíaco.",
  "estilo ponta negra": "O *Estilo Ponta Negra* fica no bairro mais nobre de Manaus, ao lado do Shopping Ponta Negra. Infraestrutura de resort e sofisticação.",

  // ==========================================
  // 🌿 AMAZON BOULEVARD — VISÃO GERAL
  // ==========================================
  "amazon boulevard": "O *Amazon Boulevard* (Classic e Prime) fica na Av. Torquato Tapajós, pertinho da Arena da Amazônia e do Hipermercado Carrefour. É padrão Riva com 1, 2 e 3 quartos com suíte, varanda e ponto grill!\n\nQuer saber sobre o *Classic* ou o *Prime*?",
  "amazon": "O *Amazon Boulevard* (Classic e Prime) fica na Av. Torquato Tapajós, pertinho da Arena da Amazônia e do Carrefour. Padrão Riva com 1, 2 e 3 quartos.",
  "boulevard": "O *Amazon Boulevard* (Classic e Prime) fica na Torquato Tapajós, perto da Arena da Amazônia. Padrão Riva com suíte, varanda e ponto grill.",

  // ==========================================
  // 🌿 AMAZON BOULEVARD PRIME — DETALHES COMPLETOS
  // ==========================================
  "amazon boulevard prime": "🏠 *Amazon Boulevard Prime* — Padrão Riva\n\n📍 Localização: Av. Torquato Tapajós, Bairro da Paz — Manaus/AM\n\nProximidades: Arena da Amazônia, Sambódromo, Hipermercado Carrefour, La Parilla, Aeroclub, Petz, Clube Municipal, Academia, Stand Municipal, Drogaria Bom Preço, Drogaria Santo Remédio.\n\n🏢 5 blocos | 1, 2 e 3 quartos com suíte, varanda e lazer completo\n\n🎯 *Tipologias disponíveis:*\n• 1 Quarto Garden: 51,94m² + 20,47m² garden\n• 2 Quartos Garden Meio: 60,14m² + 29,49m² garden\n• 2 Quartos Tipo Meio: 60,14m²\n• 3 Quartos Garden Ponta: 69,94m² + 13,91 a 20,04m² garden\n• 3 Quartos Tipo Ponta: 69,94m²\n\nQuer saber sobre o lazer, plantas ou formas de pagamento?",

  "prime": "🏠 *Amazon Boulevard Prime* — Padrão Riva!\n\n📍 Av. Torquato Tapajós, Bairro da Paz — perto da Arena da Amazônia, Carrefour, La Parilla e Sambódromo.\n\n🏢 5 blocos | 1, 2 e 3 quartos com suíte, varanda e lazer completo.\n\nDiferenciais: piscina adulto, piscina infantil, piscina no topo do bloco, quadra esportiva, crossfit, churrasqueira, salão de festas, apoio gourmet, playground, futmesa, bicicletário, hall sofisticado e garden privativo em apartamentos do térreo!\n\nQuer ver tipologias de plantas ou formas de pagamento?",

  "lazer prime": "🎉 *Área de Lazer — Amazon Boulevard Prime:*\n\n🏊 Piscina adulto\n🏊 Piscina infantil (com chafariz cogumelo)\n🏊 Piscina no topo do bloco\n🏀 Quadra esportiva poliesportiva\n💪 Crossfit ao ar livre\n🍖 Churrasqueira com geladeira e TV\n🍽️ Apoio gourmet coberto\n🎉 Salão de festas completo\n🛝 Playground colorido\n🏓 Futmesa\n🚲 Bicicletário\n🌿 Hall de entrada sofisticado com marcenaria\n🏡 Garden privativo (aptos do térreo — até 29m²)\n\nTudo isso no padrão Riva com acabamento premium!",

  "piscina prime": "O Amazon Boulevard Prime tem *3 piscinas*:\n1. Piscina adulto — espaçosa, com espreguiçadeiras e guarda-sóis\n2. Piscina infantil — com chafariz cogumelo\n3. Piscina no topo do bloco — vista privilegiada\n\nTudo cercado de jardim e vegetação tropical!",

  "garden prime": "Os apartamentos *garden* do Amazon Boulevard Prime ficam no térreo dos blocos e têm um jardim privativo:\n\n• 1 Quarto Garden Meio: +20,47m² de garden\n• 2 Quartos Garden Meio (Bl. 1 a 5): +29,49m² de garden\n• 3 Quartos Garden Ponta (Bl. 1,2,4,5 — apto 106/107): +20,04m² de garden\n• 3 Quartos Garden Ponta (Bl. 1,2,4,5 — apto 103): +20,04m² de garden\n• 3 Quartos Garden Ponta (Bl. 3): +13,91m² de garden\n• 3 Quartos Garden Ponta apto 102: +20,13m² de garden\n\nSão unidades exclusivas com espaço externo privativo!",

  "plantas prime": "🏠 *Tipologias do Amazon Boulevard Prime — Blocos 1 a 5:*\n\n1️⃣ *Apartamento Garden Meio — 1 Quarto*\n   51,94m² + 20,47m² garden\n   Cozinha integrada, varanda, bancada granito, bacia dual flush\n\n2️⃣ *Apartamento Garden Meio — 2 Quartos*\n   60,14m² + 29,49m² garden\n   2 quartos, varanda com ponto grill, cozinha integrada\n\n3️⃣ *Apartamento Tipo Meio — 2 Quartos*\n   60,14m² (sem garden)\n   Varanda com ponto grill, cozinha integrada\n\n4️⃣ *Apartamento Tipo Ponta — 3 Quartos*\n   69,94m² (sem garden)\n   3 quartos c/ suíte, varanda, cozinha integrada\n\n5️⃣ *Apartamento Garden Ponta — 3 Quartos*\n   69,94m² + garden (varia por bloco e unidade)\n   3 quartos c/ suíte, varanda, garden privativo",

  "tipologia prime": "🏠 *Tipologias Amazon Boulevard Prime:*\n\n• 1 Quarto Garden: 51,94m² + garden 20,47m²\n• 2 Quartos Garden: 60,14m² + garden 29,49m²\n• 2 Quartos Tipo: 60,14m²\n• 3 Quartos Tipo: 69,94m²\n• 3 Quartos Garden: 69,94m² + garden (13,91 a 20,13m² conforme bloco)\n\nTodos com varanda, bancada granito, torneira com arejador, esquadria preta e bacia dual flush.",

  "metragem prime": "📐 *Metragens — Amazon Boulevard Prime:*\n\n• 1 Quarto: 51,94m² (+ 20,47m² garden no térreo)\n• 2 Quartos: 60,14m² (+ 29,49m² garden no térreo)\n• 3 Quartos Ponta: 69,94m² (+ garden no térreo, varia por bloco)\n\nTodos com varanda integrada e ponto grill.",

  "acabamentos prime": "✨ *Acabamentos — Amazon Boulevard Prime:*\n\n• Esquadrias na cor preta\n• Torneira com arejador (economia de água)\n• Bancadas em granito\n• Cozinha integrada com a sala\n• Acesso à varanda pela área de serviço e pela sala\n• Bacia dual flush\n• Ponto grill na varanda\n• Hall sofisticado com marcenaria e iluminação embutida",

  "blocos prime": "O Amazon Boulevard Prime tem *5 blocos* (Blocos 1 a 5), cada um com distribuição de apartamentos nos formatos:\n• Aptos 01, 02 (ponta) — 3 quartos\n• Aptos 03, 04, 05, 06 (meio) — 2 quartos\n• Aptos 07, 08 (ponta) — 3 quartos\n\nO Bloco 3 tem uma configuração de garden ligeiramente diferente dos demais.",

  "localizacao prime": "📍 *Amazon Boulevard Prime*\nAv. Torquato Tapajós — Bairro da Paz, Manaus/AM\n\n🔵 Próximo a:\n• Arena da Amazônia\n• Sambódromo\n• Hipermercado Carrefour\n• La Parilla\n• Aeroclub\n• Petz\n• Clube Municipal\n• Academia\n• Stand Municipal\n• Drogaria Bom Preço e Santo Remédio\n\nÉ vizinho ao Amazon Boulevard Classic!",

  "diferenciais prime": "🌟 *Diferenciais Amazon Boulevard Prime:*\n\n✅ Padrão Riva de acabamento\n✅ 1, 2 e 3 quartos com suíte\n✅ Varanda com ponto grill em todos os aptos\n✅ 3 piscinas (adulto, infantil e topo)\n✅ Quadra, crossfit, churrasqueira, salão de festas\n✅ Garden privativo nos aptos do térreo\n✅ Hall de entrada sofisticado\n✅ Vizinho do Amazon Boulevard Classic\n✅ Localização privilegiada na Torquato Tapajós\n✅ Próximo à Arena da Amazônia e Carrefour",

  // ==========================================
  // 🧮 NEGOCIAÇÃO DIRECIONAL — PRÓ-SOLUTO, REGRAS E CÁLCULOS
  // ==========================================
  "pro soluto": "O Pró-Soluto (PS) é a diferença entre o valor do imóvel e o que o banco financia. Ele é parcelado em até 84x com correção de 0,5%/mês durante a obra e 1,5%/mês após a entrega. O limite depende do perfil do cliente (12% a 25% do valor do imóvel).",
  "pro-soluto": "O Pró-Soluto (PS) parcela a entrada em até 84x. Correção: 0,5%/mês na obra e 1,5%/mês após entrega. O perfil do cliente define o limite máximo (12% Aço até 25% Diamante).",
  "pró-soluto": "O Pró-Soluto (PS) parcela a entrada em até 84x. Correção: 0,5%/mês na obra e 1,5%/mês após entrega. O perfil do cliente define o limite máximo (12% Aço até 25% Diamante).",
  "regras de aprovacao": "São 3 regras simultâneas:\n1️⃣ PS ≤ limite % do perfil sobre o valor do imóvel\n2️⃣ (Parcela financiamento + Maior valor PS) ≤ % condição da renda do perfil\n3️⃣ Maior valor PS ≤ % comprometimento da renda\n⚠️ Todas precisam ser aprovadas ao mesmo tempo!",
  "regras aprovacao": "São 3 regras simultâneas:\n1️⃣ PS ≤ limite % do perfil sobre o valor do imóvel\n2️⃣ (Parcela financiamento + Maior valor PS) ≤ % condição da renda do perfil\n3️⃣ Maior valor PS ≤ % comprometimento da renda\n⚠️ Todas precisam ser aprovadas ao mesmo tempo!",
  "calculo ps": "Para calcular o PS máximo:\n1. Regra 3: (% comprometimento × renda) ÷ fator × 84\n2. Regra 2: (% condição × renda − parcela financiamento) ÷ fator × 84\n3. Usar o menor dos dois como PS máximo real\n4. Ato = Valor imóvel − Financiamento − Subsídio − PS máximo",
  "cálculo ps": "Para calcular o PS máximo:\n1. Regra 3: (% comprometimento × renda) ÷ fator × 84\n2. Regra 2: (% condição × renda − parcela financiamento) ÷ fator × 84\n3. Usar o menor dos dois como PS máximo real\n4. Ato = Valor imóvel − Financiamento − Subsídio − PS máximo",
  "fator correcao": "O fator de correção varia por empreendimento conforme o prazo de entrega:\n• Mais meses de obra restantes → fator menor (mais meses a 0,5%)\n• Mais próximo da entrega → fator maior (mais meses a 1,5%)\nExemplos: Bosque das Torres ~1,4579 | Village Torres ~1,6033",
  "fator de correção": "O fator de correção varia por empreendimento conforme o prazo de entrega:\n• Mais meses de obra restantes → fator menor\n• Mais próximo da entrega → fator maior\nExemplos: Bosque das Torres ~1,4579 | Village Torres ~1,6033",
  "anual negociacao": "A anual cai todo dezembro até a entrega do apartamento.\nValor = 50% da renda do cliente (fixo).\nAbate o saldo do PS, reduzindo a parcela mensal.\n⚠️ Usar apenas quando a negociação está apertada — é a 'carta na manga'.",
  "ato negociacao": "O ato é o que sobra após: Financiamento + Subsídio + PS = 100% do imóvel.\nNormalmente o cliente entra com R$ 1.000 de ato + até 3 sinais mensais.\nSe houver margem nas 3 regras, o restante do ato vai para o PS (reduz parcela).",
  "sinais": "Os sinais são parcelas mensais do ato, sem juros, pagas mês a mês após o ato.\nSão permitidos até 3 sinais (1 por mês).\nVantagem: não colidem com outras parcelas, diferente da anual.",
  "100 por cento imovel": "100% do imóvel = Financiamento banco + Subsídio + Pró-Soluto (PS) + Ato.\nO subsídio é desconto do governo — não é parcela do cliente, mas entra na conta.\nO FGTS soma ao financiamento do banco.",
  "como funciona negociacao": "A negociação Direcional funciona assim:\n1. Banco financia ~80% + Subsídio do governo\n2. PS parcela a entrada em até 84x\n3. Ato = o restante (cliente paga entrada)\nTudo precisa passar pelas 3 regras de aprovação do perfil do cliente.",


  "cliente aco": "⚙️ *Cliente Aço* (nível de entrada)\n• Benefício Pró-Soluto (PS) na entrada: 12%\n• Parcelamento pós habite-se: 84x de 40% da renda\n• Comprometimento de renda: até 10%\n\nPerfil: cliente sem histórico diferenciado, sem score elevado. É o nível base da análise interna.",

  "cliente bronze": "🥉 *Cliente Bronze*\n• Benefício Pró-Soluto (PS) na entrada: 15%\n• Parcelamento pós habite-se: 84x de 45% da renda\n• Comprometimento de renda: até 15%\n\nPerfil: histórico simples com algum diferencial, análise padrão no Financiamento Direto.",

  "cliente prata": "🥈 *Cliente Prata*\n• Benefício Pró-Soluto (PS) na entrada: 18%\n• Parcelamento pós habite-se: 84x de 48% da renda\n• Comprometimento de renda: até 18%\n\nPerfil: boa renda comprovada (formal ou bancária), sem restrições relevantes.",

  "cliente ouro": "🥇 *Cliente Ouro*\n• Benefício Pró-Soluto (PS) na entrada: 20%\n• Parcelamento pós habite-se: 84x de 50% da renda\n• Comprometimento de renda: até 20%\n\nPerfil: excelente histórico de crédito, renda bem comprovada, sem restrições.\n⚠️ O parcelamento pós obra é calculado sobre 50% da renda validada, em até 84x.",

  "cliente diamante": "💎 *Cliente Diamante* (nível máximo)\n• Benefício Pró-Soluto (PS) na entrada: 25%\n• Parcelamento pós habite-se: 84x de 50% da renda\n• Comprometimento de renda: até 20%\n\nPerfil: alto padrão financeiro, excelente score. Indicado para linha Riva ou Direcional premium.\n⚠️ Mesmo parcelamento do Ouro (84x/50%), mas com benefício PS maior na entrada.",

  "perfil aco": "⚙️ *Cliente Aço*: 12% PS | 84x de 40% da renda | 10% comprometimento",

  "perfil ouro": "🥇 *Cliente Ouro*: 20% PS | 84x de 50% da renda | 20% comprometimento",

  "perfil prata": "🥈 *Cliente Prata*: 18% PS | 84x de 48% da renda | 18% comprometimento",

  "perfil bronze": "🥉 *Cliente Bronze*: 15% PS | 84x de 45% da renda | 15% comprometimento",

  "perfil diamante": "💎 *Cliente Diamante*: 25% PS | 84x de 50% da renda | 20% comprometimento",

  "perfis": "Perfis de cliente — tabela oficial Direcional/Riva (Análise Interna):\n⚙️ Aço: 12% PS | 84x de 40% da renda | 10% comprometimento\n🥉 Bronze: 15% PS | 84x de 45% da renda | 15% comprometimento\n🥈 Prata: 18% PS | 84x de 48% da renda | 18% comprometimento\n🥇 Ouro: 20% PS | 84x de 50% da renda | 20% comprometimento\n💎 Diamante: 25% PS | 84x de 50% da renda | 20% comprometimento\n\n⚠️ PS = Pró-Soluto (benefício aplicado na entrada). O % de parcelamento é sobre a renda validada do cliente.\n\nQuer detalhe de algum perfil?",

  "ranking": "Ranking de clientes — tabela oficial (Análise Interna):\n⚙️ Aço: 12% PS | 84x de 40% | 10%\n🥉 Bronze: 15% PS | 84x de 45% | 15%\n🥈 Prata: 18% PS | 84x de 48% | 18%\n🥇 Ouro: 20% PS | 84x de 50% | 20%\n💎 Diamante: 25% PS | 84x de 50% | 20%",

  // ==========================================
  // 💳 TAXAS E JUROS (TABELA CAIXA)
  // ==========================================
  "juros mcmv": "As taxas de juros do MCMV variam conforme a faixa e a região:\n\n*Faixa 1:*\n• Até R$2.160: NO/NE/CO=4% | SUL/SE=4,25%\n• R$2.160 a R$2.850: NO/NE/CO=4,25% | SUL/SE=4,50%\n\n*Faixa 2:*\n• Até R$3.500: 4,75% (NO/NE/CO) | 5% (SUL/SE)\n• R$3.500 a R$4.000: 5,5%\n• R$4.000 a R$4.700: 6,5%\n\n*Faixa 3:* 7,66%\n*Faixa 4 (Classe Média):* 10%\n*Pró-Cotista:* 8,66%\n*SBPE:* 11,49%",

  "limite financiamento": "Limites do MCMV:\n• MCMV (Faixas 1-4): imóvel de até R$ 500 mil (renda até R$ 12 mil)\n• Pró-Cotista: apenas imóveis novos, até R$ 500 mil\n• SBPE: imóveis sem limite de renda, até R$ 2.250.000\n\nFinanciamento máximo: 80% do valor do imóvel (60% para SUL/SE no SBPE usado).",

  "pro cotista": "O *Pró-Cotista* é uma linha especial para quem tem FGTS:\n• Sem limite de renda\n• Taxa de juros: 8,66%\n• Apenas imóveis *novos*\n• Valor máximo do imóvel: R$ 500 mil\n• Financiamento de até 80% (somente imóveis novos)",

  "sbpe": "O *SBPE* é para quem passa do limite do MCMV (acima de R$ 12 mil de renda ou imóveis acima de R$ 500 mil):\n• Sem limite de renda\n• Taxa de juros: 11,49%\n• Valor máximo do imóvel: R$ 2.250.000\n• NO/NE/CO novo: 90% SAC / 80% PRICE\n• SUL/SE usado: 70% PRICE"
};

// =========================================================================
// FUNÇÃO INTELIGENTE DE BUSCA DE PALAVRAS-CHAVE
// =========================================================================

export function buscarRespostaDoRobo(mensagemDoUsuario) {
  if (!mensagemDoUsuario) return "Olá! Como posso te ajudar hoje?";

  const mensagem = mensagemDoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const palavrasChave = Object.keys(BaseConhecimento).sort((a, b) => b.length - a.length);

  let respostaEncontrada = null;

  for (let chave of palavrasChave) {
    const chaveNormalizada = chave.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (mensagem.includes(chaveNormalizada)) {
      respostaEncontrada = BaseConhecimento[chave];
      break;
    }
  }

  return respostaEncontrada || "Não tenho certeza se entendi. 😅 Você pode perguntar sobre: empreendimentos (Zenith, Amazon Boulevard Prime, Village...), financiamento MCMV, documentação, análise de crédito interna, ou simular por renda (ex: 'cliente tem renda de 5000').";
}

// =========================================================================
// CONTEXTO PARA A IA — VERSÃO 3.1 (otimizado para limites de token da Groq)
// =========================================================================

// CONTEXTO BASE — sempre enviado (~800 tokens)
const CONTEXTO_BASE = `Você é a IA da equipe Destemidos, Manaus. Especialista em empreendimentos Direcional e Riva e financiamento imobiliário MCMV/Caixa.

REGRAS:
1. NUNCA invente dados. Se não souber, diga "não tenho essa informação".
2. NUNCA afirme tipologia/metragem/piso que não esteja nos dados.
3. Use o histórico da conversa para entender o contexto (empreendimento, cliente).
4. Respostas curtas (máx 3-4 linhas). 1 emoji por resposta.
5. Valores mudam a cada ~10 dias — sempre avise para confirmar tabela atualizada.

PERFIS ANÁLISE INTERNA (PS = Pró-Soluto na entrada, 84x sobre renda validada):
⚙️ Aço: 12% PS | 84x de 40% renda | 10% comprometimento
🥉 Bronze: 15% PS | 84x de 45% renda | 15% comprometimento
🥈 Prata: 18% PS | 84x de 48% renda | 18% comprometimento
🥇 Ouro: 20% PS | 84x de 50% renda | 20% comprometimento
💎 Diamante: 25% PS | 84x de 50% renda | 20% comprometimento
⚠️ NÃO existe "Platina". Todos os perfis são 84x, não 96x ou 120x.

MCMV FAIXAS: F1≤R$2.850(juros 4%) | F2≤R$4.700(juros 6,5%) | F3≤R$8.600(juros 7,66%) | F4≤R$12.000(juros 10%)
Parcela máxima Caixa = 30% renda bruta (imutável).
Tabela Direta: renda ≤R$7k → parcela TD ≤30% | renda >R$7k → parcela TD ≤40%.

DIRECIONAL — empreendimentos e tipologias:
• Village Torres: 2Q 36m², piso só coz/bnh/lav
• Bosque das Torres: 1Q (tipo e studio) e 2Q (garden térreo) | 36,24m² | garden +14,35m²=50,59m² | 26 blocos | 520 unid | 104 garden | 16 PCD | SEM piso em sala/quartos | cerâmica banheiro+cozinha | 22 itens lazer equipados | Multi Wash | food truck | delivery | T6 e T7 a 5min | 8min Via Norte
• Lírio Azul: 2Q 40m², garden A(+10m²) ou B(+17m²)
• Orquídea: 2Q 41m², garden studio 1Q só PCD térreo
• Brisas: 2Q 43-45m², garden 53-59m², 19 pav, Zona Leste
• Jardim Norte: 2Q 36m², piso só bnh, Zona Norte
• Jardim Botânico: 2Q 40m², piso TODO o apê, Nova Cidade
• Topázio: 1Q e 2Q 41-51m², piso todo apê, Terra Nova
• Rio Negro: 2Q 41m², piso todo apê, Ponta Negra
• Coral: 2Q 41-51m², piso só coz/bnh/lav, Terra Nova
• Tapajós: 2Q 36m², piso só coz/bnh/lav, Tarumã
• Amazonas: 2Q 36m², Tarumã

RIVA — empreendimentos e tipologias:
• Classic: 2Q 44-69m², piso todo apê, Bairro da Paz
• Prime: 1Q/2Q/3Q 51-90m², varanda gourmet, Bairro da Paz
• Città Azzure: 2Q e 3Q 48-75m², Flores/Centro-Sul
• Zenith: 2Q e 3Q 48-49m², Zona Sul, >25 itens lazer

VALORES DE REFERÊNCIA (confirmar tabela vigente):
DIRECIONAL: Bosque/Village 2Q ~R$194-224k | Lírio Azul 2Q ~R$187-235k | Brisas 2Q ~R$296-350k | Jardim Norte ~R$214-227k | Botânico ~R$202-232k | Orquídea ~R$208-241k | Coral ~R$220-248k | Tapajós ~R$199-211k | Rio Negro ~R$224-240k | Topázio ~R$219-243k
RIVA: Classic ~R$301-397k | Prime ~R$341-583k | Azzure ~R$387-452k | Zenith ~R$367-443k`;

// DETALHES EXTRAS — carregados apenas quando pergunta é específica (~1200 tokens)
const DETALHES_EMPREENDIMENTOS = `
========================================
NEGOCIAÇÃO DIRECIONAL — REGRAS COMPLETAS
========================================

ESTRUTURA DO 100% DO IMÓVEL:
100% = Financiamento banco + Subsídio + Pró-Soluto (PS) + Ato
• Banco financia até ~80% (varia pelo score)
• Subsídio = desconto do governo, entra no 100% mas NÃO é parcela do cliente
• PS cobre a diferença até o limite do perfil (não precisa usar o máximo)
• Ato = o que sobra após Financiamento + Subsídio + PS
• FGTS soma ao financiamento do banco

AS 3 REGRAS DE APROVAÇÃO (todas precisam passar):
Regra 1 — PS: PS utilizado ≤ limite % do perfil sobre o valor do imóvel
Regra 2 — Condição Financiamento: (Parcela financiamento + Maior valor PS) ≤ % condição da renda
Regra 3 — Comprometimento: Maior valor PS ≤ % comprometimento da renda
⚠️ O sistema usa o "Maior valor pró-soluto" (parcela com correção de juros), NÃO o valor base ÷ 84.

CÁLCULO DO PS MÁXIMO (passo a passo):
1. Calcular pelo limite da Regra 3:
   Parcela base R3 = (% comprometimento × renda) ÷ fator do empreendimento
   PS máximo R3 = Parcela base R3 × 84
2. Calcular pelo limite da Regra 2:
   Parcela base R2 = (% condição × renda − parcela financiamento) ÷ fator do empreendimento
   PS máximo R2 = Parcela base R2 × 84
3. PS máximo real = min(PS máximo R3, PS máximo R2)  ← usar SEMPRE o menor dos dois
4. Ato = Valor imóvel − Financiamento − Subsídio − PS máximo real

PRÓ-SOLUTO — CORREÇÃO DE JUROS:
• Prazo máximo: 84x | Parcela mínima: R$ 200
• Correção durante obra: 0,5% ao mês
• Correção pós entrega: 1,5% ao mês
• Parcela real > valor base por causa da correção acumulada
• O sistema calcula automaticamente o "Maior valor pró-soluto"

FATOR DE CORREÇÃO POR EMPREENDIMENTO:
O fator depende de quantos meses restam de obra vs pós-obra (mais obra = fator menor):
• Conquista Topázio (entrega 30/04/2026): fator ~1,85
• Conquista Jardim Botânico (entrega 30/11/2026): fator ~1,72
• Village Torres (entrega 30/04/2027): fator ~1,6033
• Parque Ville Orquídea (entrega 30/04/2027): fator ~1,6033
• Conquista Jardim Norte (entrega 30/06/2027): fator ~1,58
• Viva Vida Rio Tapajós (entrega 31/08/2027): fator ~1,56
• Viva Vida Coral (entrega 31/03/2028): fator ~1,50
• Conquista Marinas (entrega 31/03/2028): fator ~1,50
• Bosque das Torres (entrega 30/06/2028): fator ~1,4579
• Brisas do Horizonte (entrega 31/08/2028): fator ~1,44
• Parque Ville Lírio Azul (entrega 30/11/2028): fator ~1,41
• Conquista Rio Negro II : fator ~1,25
⚠️ Fator é estimativa — valor exato sempre confirmar no sistema.

ANUAIS DISPONÍVEIS POR EMPREENDIMENTO (base março/2026):
• Conquista Topázio: 0 anuais
• Conquista Jardim Botânico: 1 anual (dez/2026)
• Village Torres: 1 anual (dez/2026)
• Parque Ville Orquídea: 1 anual (dez/2026)
• Conquista Jardim Norte: 1 anual (dez/2026)
• Viva Vida Rio Tapajós: 1 anual (dez/2026)
• Viva Vida Coral: 2 anuais (dez/2026 e dez/2027)
• Conquista Marinas: 2 anuais (dez/2026 e dez/2027)
• Bosque das Torres: 2 anuais (dez/2026 e dez/2027)
• Brisas do Horizonte: 2 anuais (dez/2026 e dez/2027)
• Parque Ville Lírio Azul: 2 anuais (dez/2026 e dez/2027)
• Conquista Rio Negro II: 4 anuais (dez/2026, 2027, 2028, 2029)

ATO E SINAIS:
• Cliente normalmente entra com R$ 1.000 (ato) + até 3 sinais mensais (1 por mês)
• Se as 3 regras tiverem margem: restante do ato vai para o PS (engorda parcela menor)
• Se apertado: manter saldo no ato/sinais
• Sinais não têm juros e não colidem com outras parcelas (vantagem sobre anual)

ANUAL (carta na manga — usar só quando negociação está apertada):
• Cai todo dezembro até a entrega do apartamento
• Valor fixo = 50% da renda do cliente
• Abate o saldo do PS → reduz parcela mensal → afrouxa a Regra 2
• É pagamento ADICIONAL à parcela mensal

ORDEM DE TENTATIVA NUMA NEGOCIAÇÃO APERTADA:
1. Encaixar nas 3 regras normalmente
2. Usar sinais para reduzir o PS
3. Usar anual (se houver dezembros disponíveis)
4. Aumentar o ato

ERROS A NUNCA COMETER:
❌ Usar fator fixo para todos os empreendimentos → cada um tem seu fator
❌ Calcular só a Regra 3 e ignorar a Regra 2 → SEMPRE calcular as duas e usar o menor PS
❌ Esquecer o subsídio no 100% → subsídio reduz o ato necessário
❌ Confundir % dos perfis (ex: usar 48% Prata para cliente Ouro)
❌ Usar "Maior valor PS" como valor base ÷ 84 → o sistema aplica correção de juros

CASO VALIDADO NO SISTEMA — Bosque das Torres | Perfil Ouro:
Imóvel R$200.000 | Renda R$3.000 | Financiamento R$160.000 (80%) | Parcela fin.: R$876,47
Fator: 1,4579
Regra 3: R$600 ÷ 1,4579 = R$411,55 × 84 = PS máx R$34.570
Regra 2: R$623,53 ÷ 1,4579 = R$427,70 × 84 = PS máx R$35.927
Regra 3 mais restritiva → PS = R$34.570 | Ato = R$5.430
Resultado aprovado: Ato R$5.430 + Mensal PS 84x R$411,55 ✅
========================================

LAZER/INFRAESTRUTURA DETALHADA:
Bosque Torres: 26 blocos 5 pav (T+4) | 520 unid (16 PCD, 104 garden) | 25.304m² terreno | Rua Dona Debla Henriques 450, Lago Azul | 1Q tipo (36,24m²) todos blocos andares sup | 2Q garden (36,24+14,35=50,59m²) térreo aptos 101/102/103/104 | SEM piso sala/quartos | cerâmica banheiro e cozinha | 22 itens lazer mobiliados: piscina adulto+infantil+solarium, churrasqueira, gourmet, fitness externo, playground, playbaby, praça jogos, redário, pet place, bicicletário, Multi Wash, food truck, quadra, guarita+delivery, controle acesso automatizado | 174 vagas carro+313 motos moradores | Terminal 6 e 7 a 5min | 8min Via Norte | 11min Delphina Aziz
Lírio Azul: 30 torres 600 unidades (18 PCD, 102 garden) | vagas 188 carros+356 motos | piscinas+solarium, yoga, gourmet, churrasqueira, quadra, fitness, playground, playbaby, jogos, redário, pet place, piquenique, bicicletário.
Brisas: coworking, espaço beauty, sport bar, game station, gourmet, churrasqueira, redário, playground, playbaby, bicicletário, mini mercado. Ônibus 542/541/540. Terminais T1.
Jardim Norte: lazer mobiliado — piscinas, salão festas, churrasqueiras, food truck plaza, fitness, crossfit, quadra, playground, playbaby, redário, pet place, piquenique, bicicletário, acesso automatizado. 26 blocos 5 pav 520 unid. 179 vagas carros+308 motos.
Prime Boulevard: 3 piscinas (adulto+infantil+topo bloco), quadra, crossfit, churrasqueira, salão, playground, futmesa, bicicletário. Esquadrias pretas, granito, cozinha integrada, varanda grill, dual flush.
Zenith: +25 itens lazer, conceito Eco Zen, varanda gourmet.

DOCUMENTAÇÃO:
PF básico: RG/CNH + Certidão Estado Civil + Comprovante endereço (60 dias)
Renda formal: 3 contracheques ou pró-labore+DARFs + IR 2024
Renda informal: extratos bancários 6 meses consecutivos
PJ: CNPJ + Contrato Social + extratos 6 meses
⚠️ União estável NÃO substitui certidão de estado civil.
Apartamento 1Q: renda mínima R$2.401.

MODALIDADES:
1. Vista: sem análise crédito, docs simplificados
2. Tabela Investidor: sem análise bancária, parcelas lineares
3. Financiamento Direto: ATO 10% + Pré Obra INCC 30% + Pós Habite-se IPCA+1% 60% | até 84x | restrições aceitas até R$3k | idade máx 79a11m29d`;

// Detecta se a pergunta pede detalhes específicos que precisam do contexto extra
const precisaDetalhes = (msg) => {
  return /lazer|infraestrutura|vaga|bloco|pavimento|torre|unidade|document|rg|cpf|renda|extrato|modalidade|vista|investidor|direto|financiamento|piso|acabamento|metragem|planta|pro.?soluto|ps |ato|sinal|anual|perfil|regra|fator|parcela|comprometimento|negoci|aprovacao|aprovação|calculo|cálculo|simul/i.test(msg);
};

// =========================================================================
// FUNÇÃO COM GROQ (IA REAL) + FALLBACK OFFLINE
// =========================================================================

// =========================================================================
// FUNÇÃO COM GROQ (IA REAL) + FALLBACK OFFLINE
// =========================================================================

const GROQ_API_KEY = process.env.REACT_APP_GROQ_KEY;

export async function buscarRespostaGemini(mensagemDoUsuario, historicoMensagens = []) {
  if (!GROQ_API_KEY) {
    return buscarRespostaDoRobo(mensagemDoUsuario);
  }

  try {
    // Contexto dinâmico: base sempre + detalhes só quando necessário
    const systemContent = precisaDetalhes(mensagemDoUsuario)
      ? CONTEXTO_BASE + DETALHES_EMPREENDIMENTOS
      : CONTEXTO_BASE;

    // Máximo 4 mensagens de histórico para não estourar o limite da Groq
    const historicoRecente = historicoMensagens.slice(-4);

    const messages = [
      { role: 'system', content: systemContent },
      ...historicoRecente.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        // Trunca mensagens longas do histórico para economizar tokens
        content: msg.content.length > 300 ? msg.content.substring(0, 300) + '…' : msg.content
      })),
      { role: 'user', content: mensagemDoUsuario }
    ];

    const pedindoDetalhes = /detalhe|explica|completo|tudo|lazer|documentos|como funciona/i.test(mensagemDoUsuario);
    const maxTokens = pedindoDetalhes ? 500 : 250;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`API Groq ${response.status}: ${errBody.substring(0, 100)}`);
    }

    const data = await response.json();
    const texto = data.choices?.[0]?.message?.content;

    if (!texto) throw new Error('Resposta vazia');

    return texto;

  } catch (error) {
    console.warn('Groq indisponível, usando robô offline:', error.message);
    return buscarRespostaDoRobo(mensagemDoUsuario);
  }
}
