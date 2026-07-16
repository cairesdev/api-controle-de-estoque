/**
 * Gera uma string contendo números aleatórios, com comprimento mínimo e máximo especificados.
 *
 * @param {number} [minLength=10] - Comprimento mínimo da string.
 * @param {number} [maxLength=25] - Comprimento máximo da string.
 * @returns {string} Uma string de números aleatórios com comprimento entre `minLength` e `maxLength`.
 */
function randomizeNumber(minLength = 10, maxLength = 25) {
  const digits = "0123456789";
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let randomNumberString = "";

  for (let i = 0; i < length; i++) {
    randomNumberString += digits.charAt(
      Math.floor(Math.random() * digits.length),
    );
  }

  return randomNumberString;
}

function dateISO() {
  return (
    new Date()
      .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
      .replace(" ", "T") + "-03:00"
  );
}

module.exports = {
  randomizeNumber,
  dateISO,
};
