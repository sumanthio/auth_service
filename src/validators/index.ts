import Joi from "@hapi/joi";

const registerValidator = (registerPayload: any) => {
  const schema = Joi.object({
    first_name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    last_name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    password: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
  });
  return schema.validate(registerPayload);
};

export default registerValidator;
