import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import eduBotLogo from '@/assets/img/logo.png';

const funcionalidadesUtilizadasReport = (data) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const horaAtual = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const dataAtual = new Date().toLocaleDateString();

  const header = [
    {
      columns: [
        {
          width: '20%',
          image: eduBotLogo,
          fit: [140, 70],
        },
        {
          width: '60%',
          alignment: 'center',
          margin: [0, 15, 0, 0],
          text: [
            { text: 'RELATÓRIO DE FUNCIONALIDADES UTILIZADAS', bold: true },
          ],
        },
        {
          width: '20%',
          margin: [0, 20, 0, 0],
          alignment: 'center',
          text: [
            { text: 'Data: ', fontSize: 9, bold: true },
            {
              text: `${dataAtual}\n`,
              fontSize: 9,
              bold: true,
            },
            { text: 'Hora: ', fontSize: 9, bold: true },
            {
              text: `${horaAtual}`,
              fontSize: 9,
              bold: true,
            },
          ],
        },
      ],
    }
  ];

  const dados = data.items.map((data) => {
    return [
      {
        text: data.funcionalidade,
        fontSize: 9,
        margin: [5, 5, 5, 5],
        alignment: 'center',
      },
      {
        text: data.total,
        fontSize: 9,
        margin: [5, 5, 5, 5],
        alignment: 'center',
      },
    ];
  });

  const corpoDocumento = [
    {
      table: {
        headerRows: 1,
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'Funcionalidade',
              style: 'tableHeader',
              fontSize: 12,
              alignment: 'center',
              bold: true,
            },
            {
              text: 'Total',
              style: 'tableHeader',
              fontSize: 12,
              alignment: 'center',
              bold: true,
            },
          ],
          ...dados,
        ],
      },
      layout: 'headerLineOnly',
      margin: [0, 20, 0, 0],
    }
  ];

  const footer = (currentPage, pageCount) => {
    return {
      layout: 'noBorders',
      margin: [14, 0, 14, 22],
      table: {
        widths: ['auto'],
        body: [
          [
            {
              text: '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
              alignment: 'center',
              fontSize: 5,
            },
          ],
          [
            [
              {
                text: `Página ${currentPage.toString()} de ${pageCount}`,
                fontSize: 7,
                alignment: 'right',
                margin: [3, 0],
              },
            ],
          ],
        ],
      },
    };
  };

  const gerarDocumento = (corpoDocumento) => {
    const documento = {
      pageSize: 'A4',
      pageMargins: [15, 90, 15, 30],
      header,
      content: corpoDocumento,
      footer,
      styles: {
        reportName: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          margin: [0, 4, 0, 0],
        },
      },
    };
    return documento;
  };

  const documento = gerarDocumento(corpoDocumento);
  const pdfDoc = pdfMake.createPdf(documento);

  return pdfDoc;
};

export default funcionalidadesUtilizadasReport;