module.exports = {
  getAll: `SELECT v.id, v.nome, v.marca, v.modelo, v.placa, s.nome as status 
  FROM VEICULOS v
  JOIN status_veiculo s on v.status = s.id 
  WHERE ORGAO = $1 ORDER BY NOME ASC;`,

  createVeiculo: `
  INSERT INTO VEICULO (ID, NOME, MARCA, MODELO, PLACA, STATUS, ORGAO) VALUES ($1, $2, $3, $4, $5, $6, $7);
  `,
};
