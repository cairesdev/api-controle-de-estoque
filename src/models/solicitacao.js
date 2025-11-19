module.exports = {
  createSolicitacao: `INSERT INTO solicitacao (id, id_unidade, id_orgao, id_status, data_solicitacao, id_solicitante, qnt_solicitada, nome) VALUES ($1,$2,(select id_orgao from unidade where id = $3),$4,$5,$6,$7,$8);`,
};
