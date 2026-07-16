module.exports = {
  getAllVeiculos: `
    SELECT v.id, v.cor, v.nome, v.marca, v.modelo, v.placa, s.nome AS status
    FROM veiculos v
    JOIN status_veiculo s ON v.status = s.id
    WHERE v.id_orgao = $1 AND v.deleted_at IS NULL
    ORDER BY v.nome ASC
  `,

  createVeiculo: `
    INSERT INTO veiculos (id, nome, marca, modelo, placa, status, id_orgao, cor)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `,

  getAllViagensOrgao: `
    SELECT
      uv.id,
      v.nome AS veiculo,
      v.placa,
      u.nome AS unidade,
      uv.saida,
      uv.chegada,
      uv.motivo,
      uv.motorista,
      uv.responsavel,
      uv.km_inicial,
      uv.km_final,
      uv.liberacao
    FROM utilizacao_veicular uv
    JOIN veiculos v ON uv.id_veiculo = v.id
    JOIN unidade u ON uv.id_unidade = u.id
    WHERE v.id_orgao = $1 AND uv.deleted_at IS NULL
    ORDER BY uv.chegada DESC
  `,

  getAllViagensUnidade: `
    SELECT
      uv.id,
      uv.liberacao,
      v.nome AS veiculo,
      v.placa,
      u.nome AS unidade,
      uv.saida,
      uv.chegada,
      uv.motivo,
      uv.motorista,
      uv.responsavel,
      uv.km_inicial,
      uv.km_final
    FROM utilizacao_veicular uv
    JOIN veiculos v ON uv.id_veiculo = v.id
    JOIN unidade u ON uv.id_unidade = u.id
    WHERE uv.id_unidade = $1 AND uv.deleted_at IS NULL
    ORDER BY uv.saida, uv.chegada ASC
  `,

  getViagemById: `
    SELECT
      uv.id,
      v.nome AS veiculo,
      v.placa,
      u.nome AS unidade,
      uv.saida,
      uv.chegada,
      uv.motivo,
      uv.motorista,
      uv.responsavel,
      uv.km_inicial,
      uv.km_final,
      uv.liberacao
    FROM utilizacao_veicular uv
    JOIN veiculos v ON uv.id_veiculo = v.id
    JOIN unidade u ON uv.id_unidade = u.id
    WHERE uv.id = $1
  `,

  createViagem: `
    INSERT INTO utilizacao_veicular (id, id_veiculo, id_unidade, id_solicitacao, motivo, motorista, km_inicial, responsavel, liberacao)
    VALUES (
      $1, $2, $3, $4,
      (SELECT motivo FROM solicitacao_veicular WHERE id = $5),
      $6, $7,
      (SELECT responsavel FROM solicitacao_veicular WHERE id = $8),
      $9
    )
  `,

  iniciarViagem: `
    UPDATE utilizacao_veicular SET motorista = $1, km_inicial = $2, saida = $3 WHERE id = $4
  `,

  concluirViagem: `
    UPDATE utilizacao_veicular SET chegada = $1, km_final = $2 WHERE id = $3
  `,

  getAllSolicitacoes: `
    SELECT
      sv.id,
      v.placa,
      v.nome AS veiculo,
      sv.data_viagem,
      sv.responsavel,
      s.nome AS status,
      sv.resumo
    FROM solicitacao_veicular sv
    JOIN veiculos v ON sv.id_veiculo = v.id
    JOIN status_solicitacao s ON sv.id_status = s.id
    WHERE sv.id_orgao = $1 AND sv.deleted_at IS NULL
    ORDER BY sv.data_viagem ASC
  `,

  getSolicitacaoById: `
    SELECT
      sv.id,
      sv.id_unidade,
      sv.resumo,
      sv.telefone_responsavel,
      v.placa,
      v.nome AS veiculo,
      sv.data_viagem,
      sv.responsavel,
      sv.motivo,
      s.nome AS status
    FROM solicitacao_veicular sv
    JOIN veiculos v ON sv.id_veiculo = v.id
    JOIN status_solicitacao s ON sv.id_status = s.id
    WHERE sv.id = $1
  `,

  createSolicitacao: `
    INSERT INTO solicitacao_veicular (id, id_veiculo, data_viagem, responsavel, motivo, id_unidade, id_orgao, id_status, telefone_responsavel, resumo)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `,

  liberarSolicitacao: `
    UPDATE solicitacao_veicular SET id_status = 'd915a72e-09ae-49af-926d-a0c399fd1aba' WHERE id = $1
  `,

  concluirSolicitacao: `
    UPDATE solicitacao_veicular SET id_status = 'd7e3227d-854b-41e5-a4db-94cadf994d78'
    WHERE id = (SELECT id_solicitacao FROM utilizacao_veicular WHERE id = $1)
  `,

  indisponibilizarVeiculo: `
    UPDATE veiculos SET status = 2 WHERE id = $1
  `,

  disponibilizarVeiculo: `
    UPDATE veiculos SET status = 1
    WHERE id = (SELECT id_veiculo FROM utilizacao_veicular WHERE id = $1)
  `,
};
