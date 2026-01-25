module.exports = {
  getAll: `SELECT v.id, v.cor, v.nome, v.marca, v.modelo, v.placa, s.nome as status 
  FROM VEICULOS v
  JOIN status_veiculo s on v.status = s.id 
  WHERE ORGAO = $1 ORDER BY NOME ASC;`,

  createVeiculo: `
  INSERT INTO VEICULOS (ID, NOME, MARCA, MODELO, PLACA, STATUS, ORGAO, COR) VALUES ($1, $2, $3, $4, $5, $6, $7,$8);
  `,

  getAllViagens: `
  SELECT uv.id, v.nome as veiculo, v.placa, u.nome as unidade, uv.saida, uv.chegada, uv.motivo, uv.motorista, uv.responsavel, uv.km_inicial, uv.km_final
  from utilizacao_veicular uv
  join veiculos v on uv.id_veiculo = v.id
  join unidade u on uv.unidade = u.id
  where v.orgao = $1
  order by uv.chegada desc;
  `,

  getAllViagensUnidade: `
  SELECT uv.id, uv.liberacao, v.nome as veiculo, v.placa, u.nome as unidade, uv.saida, uv.chegada, uv.motivo, uv.motorista, uv.responsavel, uv.km_inicial, uv.km_final
  from utilizacao_veicular uv
  join veiculos v on uv.id_veiculo = v.id
  join unidade u on uv.unidade = u.id
  where uv.unidade = $1
  order by uv.saida, uv.chegada asc;
  `,

  getViagemDetalhe: `
  SELECT uv.id, v.nome as veiculo, v.placa, u.nome as unidade, uv.saida, uv.chegada, uv.motivo, uv.motorista, uv.responsavel, uv.km_inicial, uv.km_final
  from utilizacao_veicular uv
  join veiculos v on uv.id_veiculo = v.id
  join unidade u on uv.unidade = u.id
  where uv.id = $1
  order by uv.saida, uv.chegada asc;
  `,

  createViagem: `INSERT INTO UTILIZACAO_VEICULAR (ID, ID_VEICULO, UNIDADE, ID_SOLICITACAO, MOTIVO, MOTORISTA, KM_INICIAL, RESPONSAVEL, LIBERACAO) VALUES ($1,$2,$3,$4,(select motivo from solicitacao_veicular where id = $5),$6,$7,(select responsavel from solicitacao_veicular where id = $8), $9);`,

  iniciarViagem: `UPDATE UTILIZACAO_VEICULAR SET MOTORISTA = $1, KM_INICIAL = $2, SAIDA = $3 WHERE ID = $4;`,

  getAllSolicitacoes: `
  SELECT sv.id, v.placa, v.nome as veiculo, sv.data_viagem, sv.responsavel, s.nome as status, sv.resumo
  FROM solicitacao_veicular sv
  join veiculos v on sv.id_veiculo = v.id
  join status_solicitacao s on sv.id_status = s.id
  where sv.id_orgao = $1
  order by sv.data_viagem asc;
  `,

  indisponibilizaVeiculo: `UPDATE VEICULOS SET STATUS = 2 WHERE ID = $1;`,
  disponibilizaVeiculo: `UPDATE VEICULOS SET STATUS = 1 WHERE ID = (select id_veiculo from utilizacao_veicular where id = $1);`,
  concluiSolicitacao: `UPDATE SOLICITACAO_VEICULAR SET ID_STATUS = 'd7e3227d-854b-41e5-a4db-94cadf994d78' WHERE ID = (SELECT ID_SOLICITACAO FROM UTILIZACAO_VEICULAR WHERE ID = $1);`,

  getSolicitacao: `
  SELECT sv.id, sv.id_unidade, sv.resumo, sv.telefone_responsavel, v.placa, v.nome as veiculo, sv.data_viagem, sv.responsavel, sv.motivo, s.nome as status
  FROM solicitacao_veicular sv
  join veiculos v on sv.id_veiculo = v.id
  join status_solicitacao s on sv.id_status = s.id
  where sv.id = $1;
  `,

  createSolicitacao: `
  INSERT INTO SOLICITACAO_VEICULAR (id, id_veiculo, data_viagem, responsavel, motivo, id_unidade, id_orgao, id_status,telefone_responsavel,resumo) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);
  `,

  concluirViagem: `UPDATE UTILIZACAO_VEICULAR SET CHEGADA = $1, KM_FINAL = $2 WHERE ID = $3;`,

  liberarSolicitacao: `UPDATE SOLICITACAO_VEICULAR SET ID_STATUS = 'd915a72e-09ae-49af-926d-a0c399fd1aba' where id =$1;`,
};
