export type Sample = {
  id: string;
  label: string;
  text: string;
};

export const SAMPLES: Sample[] = [
  {
    id: "tax",
    label: "Tax office: payment notice",
    text: `AUTORIDADE TRIBUTÁRIA E ADUANEIRA
Serviço de Finanças de Lisboa

Exmo(a). Senhor(a) Alex Demo
Rua das Flores, 12, 1200-195 Lisboa

Assunto: Nota de cobrança — Imposto Municipal sobre Imóveis (IMI) 2025

Informamos que se encontra por pagar a prestação do Imposto Municipal sobre Imóveis referente ao ano de 2025.

Valor a pagar: 248,60 €
Referência de pagamento: 214 377 905 118 262

O pagamento deve ser efetuado até 06/10/2026, através do Portal das Finanças, multibanco ou homebanking, utilizando a referência indicada.

A falta de pagamento dentro do prazo dá lugar à cobrança de juros de mora e à instauração de processo de execução fiscal.

Caso considere que a liquidação não está correta, poderá apresentar reclamação graciosa nos termos da lei.

Com os melhores cumprimentos,
O Chefe de Finanças`,
  },
  {
    id: "social",
    label: "Social security: documents requested",
    text: `SEGURANÇA SOCIAL
Instituto da Segurança Social, I.P. — Centro Distrital de Lisboa

Exmo(a). Senhor(a) Alex Demo
N.º de Identificação da Segurança Social: 12345678901

Assunto: Pedido de elementos — Processo de inscrição n.º 4821/2026

No âmbito da análise do seu pedido de inscrição como trabalhador independente, verificámos que o processo se encontra incompleto.

Solicitamos que envie os seguintes documentos:
- Comprovativo de morada atualizado;
- Cópia do documento de identificação válido;
- Declaração de início de atividade emitida pelas Finanças.

Os documentos devem ser entregues no prazo de 10 dias úteis a contar da data de receção deste ofício, através da Segurança Social Direta, por correio eletrónico para documentos.lisboa@seguranca-social.example ou presencialmente num balcão de atendimento.

Se os documentos não forem entregues dentro do prazo, o pedido será arquivado.

Com os melhores cumprimentos,
A Diretora de Unidade`,
  },
  {
    id: "info",
    label: "City hall: information only",
    text: `CÂMARA MUNICIPAL DE LISBOA
Direção Municipal de Higiene Urbana

Aviso aos moradores

Informamos que, a partir de 1 de novembro de 2026, a recolha de resíduos indiferenciados na sua rua passará a realizar-se às segundas, quartas e sextas-feiras, entre as 20h00 e as 23h00.

A recolha de embalagens e papel mantém-se inalterada.

Esta alteração não exige qualquer ação da sua parte. Agradecemos a colocação dos contentores na via pública apenas nos dias e horários indicados.

Para mais informações, contacte a linha municipal.

A Câmara Municipal agradece a sua colaboração.`,
  },
];
