// eslint-disable-next-line import/no-extraneous-dependencies
import Joi from "joi";

export const UserCredentials = {
    email: Joi.string().email().required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "Email cannot be empty";
            break;
          case "string.email":
            err.message = "Woah - that email is not in the correct format";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    password: Joi.string().required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "Password cannot be empty";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  };

export const UserSpec = {
  firstname: Joi.string().required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.empty":
          err.message = "First name cannot be empty";
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  lastname: Joi.string().required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.empty":
          err.message = "Last name cannot be empty";
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  email: Joi.string().email().required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.empty":
          err.message = "Email cannot be empty";
          break;
        case "string.email":
          err.message = "Woah - that email is not in the correct format";
          break;
        default:
          break;
      }
    });
    return errors;
  }),
  password: Joi.string().required().error(errors => {
    errors.forEach(err => {
      switch (err.code) {
        case "string.empty":
          err.message = "Password cannot be empty";
          break;
        default:
          break;
      }
    });
    return errors;
  }),
};

export const AddUserSpec = {
    firstname: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "User first name cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    lastname: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "User last name cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    email: Joi.string().email().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "User email cannot be empty";
              break;
            case "string.email":
              err.message = "Woah - that email is not in the correct format";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "User password cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    role: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "User must be assigned a role";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    admin: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "User Admin cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    teams: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "any.required":
              err.message = "User must be assigned at least 1 Team";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
  };

  export const FundSpec = {
    fundname: Joi.string().required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "Fund name cannot be empty";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
    financialyearend: Joi.string().required().required().error(errors => {
      errors.forEach(err => {
        switch (err.code) {
          case "string.empty":
            err.message = "Year end cannot be empty";
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  };

  export const TeamSpec = {
    name: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "Team name cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    location: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "Location cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    department: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "Department cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    funds: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "any.required":
              err.message = "Team must be assigned at least 1 Fund";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
  };

  export const ChecklistSpec = {
    checklistname: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "Checklist name cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    reviewers: Joi.string().required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case "string.empty":
              err.message = "Number of reviewers cannot be empty";
              break;
            default:
              break;
          }
        });
        return errors;
      }),
  };

  

