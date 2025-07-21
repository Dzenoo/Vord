export type ValidatorPropertiesTypes = {
  type: string;
  val?: number;
};

export type InitialInputsTypes = {
  value: string;
  isValid: boolean;
};

export type ValidatorState = {
  inputs: { [key: string]: InitialInputsTypes };
  isValid: boolean;
};

// Enum for the different types of validators
enum ValidatorTypes {
  REQUIRE = "REQUIRE",
  MINLENGTH = "MINLENGTH",
  MAXLENGTH = "MAXLENGTH",
  MIN = "MIN",
  MAX = "MAX",
  EMAIL = "EMAIL",
  FILE = "FILE",
}

// Exporting different validator functions
export const VALIDATOR_REQUIRE = () => ({ type: ValidatorTypes.REQUIRE });
export const VALIDATOR_FILE = () => ({ type: ValidatorTypes.FILE });
export const VALIDATOR_MINLENGTH = (val: number) => ({
  type: ValidatorTypes.MINLENGTH,
  val: val,
});
export const VALIDATOR_MAXLENGTH = (val: number) => ({
  type: ValidatorTypes.MAXLENGTH,
  val: val,
});
export const VALIDATOR_MIN = (val: number) => ({
  type: ValidatorTypes.MIN,
  val: val,
});
export const VALIDATOR_MAX = (val: number) => ({
  type: ValidatorTypes.MAX,
  val: val,
});
export const VALIDATOR_EMAIL = () => ({ type: ValidatorTypes.EMAIL });

// Function to validate a given value based on the validators passed
export const validate = (
  value: string,
  validators: ValidatorPropertiesTypes[]
) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === ValidatorTypes.REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === ValidatorTypes.MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.val!;
    }
    if (validator.type === ValidatorTypes.MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.val!;
    }
    if (validator.type === ValidatorTypes.MIN) {
      isValid = isValid && +value >= validator.val!;
    }
    if (validator.type === ValidatorTypes.MAX) {
      isValid = isValid && +value <= validator.val!;
    }
    if (validator.type === ValidatorTypes.EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
  }
  return isValid;
};
