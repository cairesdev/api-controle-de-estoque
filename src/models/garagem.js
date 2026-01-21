module.exports = {
  getAll: `SELECT v.id, v.cor, v.nome, v.marca, v.modelo, v.placa, s.nome as status 
  FROM VEICULOS v
  JOIN status_veiculo s on v.status = s.id 
  WHERE ORGAO = $1 ORDER BY NOME ASC;`,

  createVeiculo: `
  INSERT INTO VEICULOS (ID, NOME, MARCA, MODELO, PLACA, STATUS, ORGAO, COR) VALUES ($1, $2, $3, $4, $5, $6, $7,$8);
  `,

  getAllViagens: `
  SELECT uv.id, v.nome, v.placa, u.nome as unidade, uv.saida, uv.chegada, uv.motivo, uv.motorista, uv.responsavel, uv.km_inicial, uv.km_final
  from utilizacao_veicular uv
  join veiculos v on uv.id_veiculo = v.id
  join unidade u on uv.unidade = u.id
  where v.orgao = $1
  order by uv.saida, uv.chegada asc;
  `,
};
