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
  order by uv.saida, uv.chegada asc;
  `,

  getAllViagensUnidade: `
  SELECT uv.id, v.nome as veiculo, v.placa, u.nome as unidade, uv.saida, uv.chegada, uv.motivo, uv.motorista, uv.responsavel, uv.km_inicial, uv.km_final
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

  getAllSolicitacoes: `
  SELECT sv.id, v.placa, v.nome as veiculo, sv.data_viagem, sv.responsavel, sv.motivo, s.nome as status
  FROM solicitacao_veicular sv
  join veiculos v on sv.id_veiculo = v.id
  join status_solicitacao s on sv.id_status = s.id
  where sv.id_orgao = $1
  order by sv.data_viagem asc;
  `,

  createSolicitacao: `
  INSERT INTO SOLICITACAO_VEICULAR (id, id_veiculo, data_viagem, responsavel, motivo, id_unidade, id_orgao, id_status) values ($1,$2,$3,$4,$5,$6,$7,$8);
  `,
};
