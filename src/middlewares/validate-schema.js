const { ValidationError } = require("yup");
const HttpStatus = require("../lib/http-status");

class Validator {
  constructor(schema) {
    this.schema = schema;
  }

  async validate(req, res, next) {
    try {
      await this.schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        console.error("Erro de validação: ", err);
        return res.status(HttpStatus.NOT_ACEPTABLE).json({
          message: "Falha na validação",
          res: this.formatErrors(err),
        });
      }
      next(err);
    }
  }

  formatErrors(validationError) {
    return validationError.inner.reduce((errors, error) => {
      errors[error.path] = error.message;
      return errors;
    }, {});
  }
}

module.exports = Validator;
