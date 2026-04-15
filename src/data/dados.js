// === LOGOS DOS EMPREENDIMENTOS ===
export const LOGOS_EMPREENDIMENTO = {
  brisas: "https://i.postimg.cc/CxkWjBFf/Copia-de-LOGO-COLORIDO-PREFERENCIAL.png",
  orquidea: "https://i.postimg.cc/nhbz1mt3/Copia-de-DIR-Orquidea-Logo-FINAL.png",
  village_torres: "https://i.postimg.cc/fyVL8jL3/Logo-Village-Torres.png",
  conquista_jb: "https://i.postimg.cc/7h56KM6G/Ativo-1.png",
  viva_coral: "https://i.postimg.cc/3RSNjbKh/Copia-de-Logo-Viva-Vida-Coral.png",
  jardim_norte: "https://i.postimg.cc/zv4f6bbp/Copia-de-DIR-Jd-Norte-Logo-FINAL-Prancheta-1.png",
  rio_amazonas: "https://i.postimg.cc/D0SZxdZP/DIR-Rio-AM-logo-AZUL.png",
  bosque_torres: "https://i.postimg.cc/Kj1z0rzs/Copia-de-Logo-Bosque-das-Torres-Prancheta-1.png",
  lirio_azul: "https://i.postimg.cc/Wzd3563y/Copia-de-DIR-PVLirio-Azul-Logo.png",
  boulevard_classic: "https://i.postimg.cc/6qbHXwBJ/Logo-AMAZOM-BOULEVARD-CLASSIC.png",
  boulevard_prime: "https://i.postimg.cc/PJV6jhdG/Copia-de-LOGO-AMAZON-BOULEVARD-PRIME-OK-01.png",
  oasis_azzure: "https://i.postimg.cc/bJCr0Fzk/Copia-de-LOGO-OASIS-AZZURE-BRANCA.png",
  zenith: "https://i.postimg.cc/gjtMWdGb/ZENITH-LOGO-ORIGINAL.png",
  topazio: "https://i.postimg.cc/qqNR1XRR/DIR-CTopazio-Logo-Prancheta-1.png",
  rio_negro: "https://i.postimg.cc/NFKMd7M6/DIR-Conquista-Rio-Negro-Logo.png",
  rio_tapajos: "https://i.postimg.cc/xCx8GF0c/Copia-de-DIR-Rio-Tapajos-logo.png",
  moratta: "https://i.postimg.cc/bvTVQqdd/248-3-LOGO-MORATTA-FIORE-PRETO-V1F.png",
};

export const REVISTA_LOGO_MAP = {
  1: 'brisas', 2: 'orquidea', 3: 'village_torres', 4: 'conquista_jb',
  5: 'viva_coral', 6: 'jardim_norte', 7: 'rio_amazonas', 8: 'bosque_torres',
  9: 'lirio_azul', 10: 'boulevard_classic', 11: 'boulevard_prime',
  12: 'oasis_azzure', 13: 'zenith', 14: 'topazio', 16: 'rio_negro', 17: 'rio_tapajos', 18: 'moratta',
};

const D = 'https://www.direcional.com.br/wp-content/uploads';
const R = 'https://www.rivaincorporadora.com.br/wp-content/uploads';

export const revistasDataLocal = [
  { id: 1, title: "Brisas do Horizonte", brand: "Direcional", region: "Coroado - Zona Leste", size: "43m² a 45m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "08/2028",
    cover: `${D}/2025/06/Perspectiva-Guarita-BrisasdoHorizonte.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-2.webp`,`https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-3.webp`,`https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-4.webp`,`https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-5.webp`,`https://api.apto.vc/images/realties/9440/brisas-do-horizonte-condominio-6.webp`],
    link: "https://drive.google.com/file/d/18IXtAt9PLVjIsk2PkXIHXnVCaduVkGu2/view?usp=drive_link", aliases: ["brisas", "brisas do horizonte", "horizonte"], pois: ["Supermercado Vitória (1 min)", "Escola Mun. Profª Maria Rodrigues Tapajós (2 min)", "SPA Coroado (3 min)", "Estádio Carlos Zamith (5 min)", "Park Mall Ephigênio Salles (6 min)", "UFAM - Universidade Federal do Amazonas (7 min)", "Hospital Dr. João Lúcio (7 min)", "Samel São José Medical Center (7 min)", "Sesi Clube do Trabalhador (8 min)", "Manauara Shopping (14 min)"] },

  { id: 2, title: "Parque Ville Orquídea", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "04/2027",
    cover: `${D}/2024/05/Perspectiva_PARQUEVILLEORQUIDEA_GUARITA.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-2.webp`,`https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-3.webp`,`https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-4.webp`,`https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-5.webp`,`https://api.apto.vc/images/realties/7259/parque-ville-orquidea-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1F_BeT2jceDM8u4kCbSXN8kp2rk7boQTG/view?usp=drive_link", aliases: ["orquidea", "orquídea", "parque ville", "parque ville orquidea"], pois: ["Escola Mun. Viviane Estrela (1-2 min)", "Clínica da Família C. Nicolau (1-2 min)", "Veneza Express (3-4 min)", "Nova Era Supermercado (3-4 min)", "Terminal 6 (3-4 min)", "Colégio Militar da PM VI (3-4 min)", "Shopping Via Norte (7 min)", "Hospital Delphina Aziz (10 min)", "Sumaúma Park Shopping (12 min)"] },

  { id: 3, title: "Village Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "04/2027",
    cover: `${D}/2024/09/Perspectiva-Guarita-VillageTorres.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/7672/village-torres-condominio-2.webp`,`https://api.apto.vc/images/realties/7672/village-torres-condominio-3.webp`,`https://api.apto.vc/images/realties/7672/village-torres-condominio-4.webp`,`https://api.apto.vc/images/realties/7672/village-torres-condominio-5.webp`,`https://api.apto.vc/images/realties/7672/village-torres-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1blVconA5fjODxvXB7s8KT6dSlX8KpLLv/view?usp=drive_link", aliases: ["village", "village torres", "torres"], pois: ["Supermercado Nova Era", "Shopping Via Norte", "Sumaúma Park Shopping", "Atacadão"] },

  { id: 4, title: "Conquista Jardim Botânico", brand: "Direcional", region: "Nova Cidade - Zona Norte", size: "40m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "11/2026",
    cover: `${D}/2024/03/Conquista-Jardim-Botanico-Guarita.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-2.webp`,`https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-3.webp`,`https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-4.webp`,`https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-5.webp`,`https://api.apto.vc/images/realties/7260/conquista-jardim-botanico-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1TYzIq8RuGORXfxQpH8CGZejTjF_GlUz0/view?usp=drive_link", aliases: ["botanico", "botânico", "jardim botanico", "conquista jardim"], pois: ["MUSA (Museu da Amazônia / Jardim Botânico)", "Shopping Via Norte", "Supermercado DB Nova Cidade", "SPA Galiléia"] },

  { id: 5, title: "Viva Vida Coral", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "03/2028",
    cover: `${D}/2025/05/Perspectiva-Guarita-VivaVidaCoral.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-2.webp`,`https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-3.webp`,`https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-4.webp`,`https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-5.webp`,`https://api.apto.vc/images/realties/8667/viva-vida-coral-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1lYo3otquzwdnD0r5f6JobBbW-6KmGOF4/view?usp=drive_link", aliases: ["coral", "viva vida coral", "viva vida"], pois: ["Shopping Via Norte", "Loja Havan", "Atacadão", "Hospital Delphina Aziz", "Posto Atem (famoso na entrada do bairro)"] },

  { id: 6, title: "Conquista Jardim Norte", brand: "Direcional", region: "Santa Etelvina - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "06/2027",
    cover: `${D}/2024/12/Perspectiva-Guarita-ConquistaJardimNorte.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-2.webp`,`https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-3.webp`,`https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-4.webp`,`https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-5.webp`,`https://api.apto.vc/images/realties/8191/conquista-jardim-norte-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1_Hyb72NWl1HjEiabKLL9m5ZMutHExesY/view?usp=drive_link", aliases: ["jardim norte", "santa etelvina", "conquista norte"], pois: ["Shopping Via Norte (1 min)", "Havan (1 min)", "Fun Park (1 min)", "Nova Era Supermercado (1 min)", "UBS Sálvio Belota (2 min)", "Feira do Santa Etelvina (2 min)", "Terminal 06 (5 min)", "15º Distrito Policial (5-7 min)", "Hiper DB (5-7 min)", "Hospital Delphina Aziz", "Escola Dra. Viviane Estrela"] },

  { id: 7, title: "Viva Vida Rio Amazonas", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "03/2026",
    cover: `${D}/2023/07/Guarita-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,
    fotosExtras: [`${D}/2023/07/Fachada-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,`${D}/2023/07/Lazer-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,`${D}/2023/07/Piscina-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,`${D}/2023/07/Fitness-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`,`${D}/2023/07/Playground-Viva-Vida-Rio-Amazonas-Direcional.jpg.webp`],
    link: "https://drive.google.com/", aliases: ["amazonas", "rio amazonas", "viva vida rio amazonas"], pois: ["Aeroporto Internacional Eduardo Gomes", "Orla da Ponta Negra", "Sivam (Sistema de Vigilância da Amazônia)", "Sipam", "Supermercado Veneza"] },

  { id: 8, title: "Bosque das Torres", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "06/2028",
    cover: `${D}/2025/10/portaria-bosque-das-torres.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-2.webp`,`https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-3.webp`,`https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-4.webp`,`https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-5.webp`,`https://api.apto.vc/images/realties/11153/bosque-das-torres-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1lPnNQuxlPkKOcW2JqOB7KEWsaQVpZzcU/view?usp=drive_link", aliases: ["bosque", "bosque das torres"], pois: ["Supermercado Nova Era (Torres)", "Sumaúma Park Shopping", "Parque do Mindu", "Faculdade Estácio (polo próximo)"] },

  { id: 9, title: "Parque Ville Lírio Azul", brand: "Direcional", region: "Lago Azul - Zona Norte", size: "41m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "11/2028",
    cover: `${D}/2025/11/fachada-noturna-parque-ville-lirio-azul.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-2.webp`,`https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-3.webp`,`https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-4.webp`,`https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-5.webp`,`https://api.apto.vc/images/realties/12749/parque-ville-lirio-azul-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1fc7AXap6nhkpTlxONsm46WJCKxIWIhwe/view?usp=drive_link", aliases: ["lirio", "lírio", "lirio azul", "parque ville lirio"], pois: ["Escola Integral João S. Braga (1 min)", "Colégio Militar da PM VI (2 min)", "Escola Est. Eliana Braga (2 min)", "Nova Era Supermercado (2 min)", "Clínica da Família C. Gracie (2 min)", "UBS José Fligliuolo (4 min)", "Clínica da Família C. Nicolau (4 min)", "Terminal 6 e 7 (4 min)", "Shopping Via Norte / Havan / Fun Park (7 min)", "Hospital Delphina Aziz (8 min)"] },

  { id: 10, title: "Amazon Boulevard Classic", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "44m² a 69,78m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "12/2026",
    cover: `${R}/2023/11/fachada-noturna_amazon-boulevard-classic.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-2.webp`,`https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-3.webp`,`https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-4.webp`,`https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-5.webp`,`https://api.apto.vc/images/realties/6845/amazon-boulevard-classic-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1ZX37T2S8FlHnSiO-yeAjlFyqq_5-dVzx/view?usp=drive_link", aliases: ["classic", "amazon boulevard", "boulevard", "boulevard classic"], pois: ["Arena da Amazônia", "Amazonas Shopping", "Carrefour Hipermercado", "UNIP (Universidade Paulista)", "Terminal Rodoviário de Manaus", "Hospital Tropical (Fundação de Medicina Tropical)"] },

  { id: 11, title: "Amazon Boulevard Prime", brand: "Riva", region: "Bairro da Paz - Zona Centro-Oeste", size: "51m² a 90,39m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", entrega: "06/2028",
    cover: `${R}/2025/06/guarita-Amazon-prime-boulevard-riva.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-2.webp`,`https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-3.webp`,`https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-4.webp`,`https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-5.webp`,`https://api.apto.vc/images/realties/9089/amazon-boulevard-prime-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1aIuBlwLYGStUm7DNE3gCbfu3Ty2JmkGM/view?usp=drive_link", aliases: ["prime", "amazon prime", "boulevard prime"], pois: ["Arena da Amazônia", "Sambódromo", "Hipermercado Carrefour", "La Parilla Restaurante", "Aeroclub", "Petz", "Clube Municipal (ao lado)", "Vila Olímpica", "Drogaria Bom Preço", "Drogaria Santo Remédio"] },

  { id: 12, title: "Città Oasis Azzure", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "48m² a 75m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", entrega: "11/2028",
    cover: `${R}/2025/08/citta-azzure_GUARITA.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-2.webp`,`https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-3.webp`,`https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-4.webp`,`https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-5.webp`,`https://api.apto.vc/images/realties/10744/citta-oasis-azzure-home-riva-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1Y-fT6UbQ-OopqVaV0POgHRIdlayMXMOB/view?usp=sharing", aliases: ["citta", "città", "azzure", "oasis", "oasis azzure"], pois: ["Universidade Nilton Lins", "Laranjeiras Restaurante (polo gastronômico)", "Sushi Ponta Negra", "Domes Burgers", "Di Fiori - Casa de Massas e Pizzas", "Na Lenha Pizzaria", "Drogaria Santo Remédio", "Supermercado Atack (Laranjeiras)", "Sollarium Mall"] },

  { id: 13, title: "Zenith Condomínio Clube", brand: "Riva", region: "São Francisco - Zona Sul", size: "48m² a 49m²", bedrooms: "2 e 3 quartos", flooring: "Todo o apê", entrega: "03/2028",
    cover: `${R}/2024/08/Perspectiva-Guarita-ZenithCondominioClube.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-2.webp`,`https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-3.webp`,`https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-4.webp`,`https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-5.webp`,`https://api.apto.vc/images/realties/7605/zenith-condominio-clube-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1wv_v56T2ACEHtPZF-iRBvEWY2VVdUXxu/view?usp=drive_link", aliases: ["zenith", "zenith condominio"], pois: ["Manauara Shopping", "Fórum Ministro Henoch Reis", "Tribunal de Justiça (TJ-AM)", "Hospital Check Up", "Colégio Martha Falcão", "Faculdade Martha Falcão", "Faculdade Estácio"] },

  { id: 14, title: "Conquista Topázio", brand: "Direcional", region: "Colônia Terra Nova - Zona Norte", size: "41m² a 51m²", bedrooms: "1 e 2 quartos", flooring: "Todo o apê", entrega: "Entregue",
    cover: `${D}/2023/04/Guarita-Conquista-Topazio-Direcional.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-2.webp`,`https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-3.webp`,`https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-4.webp`,`https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-5.webp`,`https://api.apto.vc/images/realties/6507/conquista-topazio-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1SMIfr9HbfLd06UaDLKbMUxxtuh4cPPEM/view?usp=drive_link", aliases: ["topazio", "topázio", "conquista topazio"], pois: ["Allegro Mall (vizinho)", "Shopping Via Norte", "Atacadão", "Loja Havan", "SPA da Colônia Terra Nova"] },

  { id: 16, title: "Conquista Rio Negro", brand: "Direcional", region: "Ponta Negra - Zona Oeste", size: "41m²", bedrooms: "2 quartos", flooring: "Todo o apê", entrega: "Entregue",
    cover: `${D}/2022/11/Guarita-Conquista-Rio-Negro-Direcional.jpg.webp`,
    fotosExtras: [`https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-2.webp`,`https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-3.webp`,`https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-4.webp`,`https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-5.webp`,`https://api.apto.vc/images/realties/6070/conquista-rio-negro-condominio-6.webp`],
    link: "https://drive.google.com/file/d/1pHLQwUSn6BDMfLo7fFGonyyWlgtXwNmy/view?usp=drive_link", aliases: ["negro", "rio negro", "conquista rio negro"], pois: ["Shopping Ponta Negra", "DB Ponta Negra", "Orla 92 Mall", "Supermercado Veneza", "Orla da Ponta Negra", "Praia Dourada", "Marina Tauá", "Balneário do SESC", "Aeroporto Eduardo Gomes", "Policlínica José Lins", "Colégio Século"] },

  { id: 17, title: "Viva Vida Rio Tapajós", brand: "Direcional", region: "Tarumã - Zona Oeste", size: "36m²", bedrooms: "2 quartos", flooring: "Cozinha, banheiro e lavatório", entrega: "08/2027",
    cover: `${D}/2025/02/Perspectiva-Guarita-VivaVidaRioTapajos.jpg.webp`,
    fotosExtras: [`${D}/2025/02/Perspectiva-Fachada-VivaVidaRioTapajos.jpg.webp`,`${D}/2025/02/Perspectiva-Lazer-VivaVidaRioTapajos.jpg.webp`,`${D}/2025/02/Perspectiva-Piscina-VivaVidaRioTapajos.jpg.webp`,`${D}/2025/02/Perspectiva-Fitness-VivaVidaRioTapajos.jpg.webp`,`${D}/2025/02/Perspectiva-Playground-VivaVidaRioTapajos.jpg.webp`],
    link: "https://drive.google.com/file/d/1k3TOypf5bm_zXPfc-ulb7vY9e7MKxmlk/view?usp=drive_link", aliases: ["tapajos", "tapajós", "rio tapajos", "viva vida rio tapajos"], pois: ["Aeroporto Internacional de Manaus", "Tarumã (área de balneários famosos)", "Sivam", "proximidade com a entrada da Ponta Negra"] },

  { id: 18, title: "Moratta Home Riva", brand: "Riva", region: "Flores - Zona Centro-Sul", size: "43,41m² a 59,35m²", bedrooms: "2 dormitórios", flooring: "Todo o apê", entrega: "03/2029", pinned: true, lat: -3.077466, lng: -60.020464,
    cover: `https://i.postimg.cc/vmFwP8QX/IMG-1577.png`,
    fotosExtras: [
      `https://i.postimg.cc/Wzn0y4L5/DIRECIONAL-CARREFOUR-TORRE-DETALHE-FINAL.jpg`,
      `https://i.postimg.cc/ryCGsf0r/DIRECIONAL-CARREFOUR-TORRE-DIURNA-FINAL.jpg`,
      `https://i.postimg.cc/x8tbRFMb/DIRECIONAL-CARREFOUR-ACADEMIA-FINAL.jpg`,
      `https://i.postimg.cc/5N2z0bWR/DIRECIONAL-CARREFOUR-INTERNA-SALA-FINAL.jpg`,
      `https://i.postimg.cc/jdSf5tY9/DIRECIONAL-CARREFOUR-LAVANDERIA-FINAL.jpg`,
    ],
    link: "https://drive.google.com/file/d/1qCCNbu_w4zzzSS9eAi-vTCS8YpW6AZvY/view?usp=sharing", aliases: ["moratta", "moratta home", "moratta riva"], pois: ["Carrefour Flores (ao lado - 24h)", "Amazonas Shopping (5 min)", "Manaus Plaza Shopping (5 min)", "Millennium Shopping (8 min)", "UEA - Universidade Estadual do Amazonas (5 min)", "UniNorte Campus Djalma Batista (5 min)", "Samel Centro Médico Djalma Batista (10 min)", "Sushi Ponta Negra - Djalma Batista (8 min)", "Garrafeira 351 - Restaurante (5 min)", "Gendai Restaurante Japonês - Amazonas Shopping (5 min)"] },
];

export const utilitariosData = [
  { title: "RESERVA DE UNIDADE DE LANÇAMENTO", link: "https://docs.google.com/document/d/17QoIEhahikPda2zjSQ3esclqu-YS9j81/edit?usp=sharing&ouid=115657243229938792991&rtpof=true&sd=true" },
  { title: "CARTA DE CANCELAMENTO", link: "https://drive.google.com/file/d/1tlibpT-9XGQIDGTrvp3Zcb9sDep1CldF/view?usp=sharing" },
  { title: "M.O", link: "https://drive.google.com/file/d/1exQM1G9KFAHfRgOMIlZwc1rnsAFYRrZd/view?usp=sharing" },
  { title: "MONTAR PLANO", link: "https://drive.google.com/file/d/1nLpqHMlmSwx7h9azIGW4JbWwDdNrFvsg/view?usp=sharing" },
  { title: "ANALISE INTERNA", link: "https://drive.google.com/file/d/1shaF3OEZnX0y4M9OhSCWZMXAXb9CbAVf/view?usp=sharing" },
  { title: "DECLARAÇÃO DE ESCLARECIMENTO", link: "https://docs.google.com/document/d/1tBS_JyaYVJtLP4uZil7hrKQIbO8t6YUo/edit?usp=sharing&ouid=115657243229938792991&rtpof=true&sd=true" },
  { title: "DECLARAÇÃO DEPENDENTE - SOLTEIRO/DIVORCIADO", link: "https://docs.google.com/document/d/1ZvZGt5G9aV-WwG7HH3H55RZVGlNqUP-q/edit?usp=sharing" },
  { title: "DECLARAÇÃO DEPENDENTE - CASADO", link: "https://docs.google.com/document/d/19VBTkk3Z4E2elG3LXvUZVoSOiAVNpBiW/edit?usp=sharing" },
  { title: "AMML - DECLA. PROPRIETÁRIO DE RESIDÊNCIA", link: "https://drive.google.com/file/d/1Qp19k2BaqiR6kuWqmju3qd_GMlUYuxrX/view?usp=sharing" },
  { title: "AMML- DECLA. TEMPO DE RESIDÊNCIA", link: "https://drive.google.com/file/d/1sJdAyDwVBvOauW9EK0XBJIHoIHL6nhAX/view?usp=sharing" },
  { title: "AMML - DECLA. ESTADO CIVIL", link: "https://drive.google.com/file/d/1f5aC4XStNfCKuu6NK2_EetP2DHpbF_0p/view?usp=sharing" },
  { title: "FICHA CADASTRO PF - CLIENTE INFORMAL", link: "https://drive.google.com/file/d/1Y5h9B3oe8HdoU7EGJwkcEerQACIaGAAG/view?usp=drive_link" },
];

export const frasesMotivacionais = [
  { texto: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", autor: "Robert Collier" },
  { texto: "Não vendemos apenas imóveis, nós entregamos as chaves para novos sonhos e recomeços.", autor: "Equipe Destemidos" },
  { texto: "A oportunidade não bate à porta, ela se apresenta quando você a constrói com muito trabalho.", autor: "Chris Grosser" },
  { texto: "Seu limite não é o mercado, é a sua própria mente. Voe alto!", autor: "Motivação Destemidos" },
  { texto: "Um cliente satisfeito é a melhor estratégia de negócios que existe.", autor: "Michael LeBoeuf" },
  { texto: "Não espere por condições perfeitas. O momento de fazer acontecer é agora.", autor: "George Bernard Shaw" },
  { texto: "O 'não' você já tem. O 'sim' está na próxima ligação, na próxima visita, no próximo cliente.", autor: "Sabedoria de Vendas" },
  { texto: "Vender é construir uma ponte de confiança entre a necessidade do cliente e a solução que você oferece.", autor: "Equipe Destemidos" },
  { texto: "A sorte acompanha quem trabalha duro. Que hoje seja um dia de muitos fechamentos!", autor: "Motivação Destemidos" },
  { texto: "Corretor de sucesso é aquele que escuta mais do que fala e resolve mais do que promete.", autor: "Anônimo" },
  { texto: "Cada 'não' recebido é um degrau a mais na escada que leva ao seu próximo 'sim'.", autor: "Sabedoria de Vendas" },
  { texto: "Não se trata apenas de vender uma casa, mas de apresentar o palco onde a vida do cliente vai acontecer.", autor: "Equipe Destemidos" },
  { texto: "O melhor corretor não é aquele que mais fala, mas aquele que faz as melhores perguntas.", autor: "Jeffrey Gitomer" },
  { texto: "A excelência em vendas não é um ato isolado, é um hábito construído a cada novo atendimento.", autor: "Aristóteles (Adaptado)" },
  { texto: "Transformar dúvidas em certezas é a verdadeira arte de quem vende com propósito.", autor: "Motivação Destemidos" },
  { texto: "As pessoas compram confiança antes de comprarem tijolos e cimento.", autor: "Anônimo" },
  { texto: "A sua energia de hoje determina a sua comissão de amanhã. Vá com tudo!", autor: "Motivação Destemidos" },
  { texto: "Nenhum obstáculo é grande demais quando a vontade de bater a meta é inabalável.", autor: "Equipe Destemidos" },
  { texto: "Foque em ajudar o seu cliente a realizar um sonho, e a venda será a consequência natural.", autor: "Sabedoria de Vendas" },
  { texto: "Grandes resultados exigem grandes dedicações. Dê o seu melhor em cada visita de hoje.", autor: "Motivação Destemidos" },
  { texto: "Para ser um corretor de sucesso, apaixone-se por resolver o problema do seu cliente.", autor: "Equipe Destemidos" },
  { texto: "A motivação nos faz começar o mês, mas é a disciplina nos atendimentos que nos faz fechar contratos.", autor: "Jim Rohn (Adaptado)" },
  { texto: "Todo campeão de vendas começou apenas com a coragem de pegar o telefone e tentar.", autor: "Anônimo" },
  { texto: "Mostre o valor antes de falar o preço, e veja a mágica da negociação acontecer.", autor: "Sabedoria de Vendas" },
  { texto: "O seu entusiasmo é contagiante. Vista o seu melhor sorriso e vá fechar negócios!", autor: "Motivação Destemidos" },
  { texto: "Não existe cliente impossível, existe cliente que ainda não compreendeu o valor da sua oferta.", autor: "Equipe Destemidos" },
  { texto: "Acredite no projeto que você está apresentando e o cliente acreditará em você.", autor: "Sabedoria de Vendas" },
  { texto: "Comemore cada pequeno avanço. Uma assinatura de contrato sempre começa com um bom 'bom dia'.", autor: "Motivação Destemidos" },
  { texto: "A diferença entre o corretor mediano e o de excelência está na atenção aos detalhes e ao cliente.", autor: "Equipe Destemidos" },
  { texto: "Nosso trabalho é transformar alicerces e plantas arquitetônicas em lares inesquecíveis.", autor: "Anônimo" },
  { texto: "Faça de cada atendimento uma obra-prima. O seu sucesso é a sua principal assinatura.", autor: "Motivação Destemidos" },
];

export const imagensEquipeDiarias = [
  "https://i.postimg.cc/QCxjYhBj/Copia-de-IMG-9585.jpg",
  "https://i.postimg.cc/2SJ3qb1V/Copia-de-IMG-5622-(1).jpg",
  "https://i.postimg.cc/mgqhczP5/Copia-de-IMG-3054.jpg",
  "https://i.postimg.cc/YSW0QrF3/Copia-de-IMG-3049.jpg",
  "https://i.postimg.cc/1zqXDmFK/Copia-de-IMG-3048.jpg",
  "https://i.postimg.cc/bvtr1yb8/Copia-de-IMG-2830.jpg",
  "https://i.postimg.cc/P57qzz1h/IMG-1875.png",
  "https://i.postimg.cc/Rqr3R7kM/IMG_1876.jpg",
  "https://i.postimg.cc/2j4HswYG/Whats-App-Image-2026-04-14-at-15-01-00.jpg",
  "https://i.postimg.cc/VL86Lg4H/Copia-de-IMG-9690.jpg",
  "https://i.postimg.cc/tCc9D09Q/Copia-de-IMG-0779-(1).jpg",
  "https://i.postimg.cc/sXP20TwK/Copia-de-IMG-1504.jpg",
  "https://i.postimg.cc/4xMnK7YP/Copia-de-IMG-3117.jpg",
  "https://i.postimg.cc/hGT4fCWS/Copia-de-IMG-2336.jpg",
  "https://i.postimg.cc/fWKLcg3X/Copia-de-IMG-9919.avif",
];

const today = new Date();
export const dayIndex = Math.floor((today.getTime() - today.getTimezoneOffset() * 60000) / (1000 * 60 * 60 * 24));
