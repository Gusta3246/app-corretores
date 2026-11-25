// Menus agrupados da dock. "acao" aponta para uma função interna do App; "url" abre em nova aba.
export const GRUPOS_MENU = {
  Calcular: {
    title: 'Calcular',
    sections: [{
      items: [
        { id: 'itbi',         label: 'Calcular ITBI',   icon: 'calc',  acao: 'itbi' },
        { id: 'tabelaDireta', label: 'Tabela direta',   icon: 'table', acao: 'tabelaDireta' },
        { id: 'planilhaTD',   label: 'Planilha TD',     icon: 'sheet', url: 'https://docs.google.com/spreadsheets/d/1dHU0XB_GuGE-APGPvqQ6IONnw6iMmzo6z5GrrnRCiRc/edit?usp=sharing' },
        { id: 'simulador',    label: 'Simulador Caixa', icon: 'bank',  url: 'https://simuladorhabitacao.caixa.gov.br/home' },
      ],
    }],
  },
  Documentos: {
    title: 'Documentos',
    sections: [{
      items: [
        { id: 'utilitarios', label: 'Utilitários', icon: 'book',  acao: 'utilitarios' },
        { id: 'cpf',         label: 'Gerar CPF',  icon: 'id',    acao: 'cpf' },
      ],
    }],
  },
};
