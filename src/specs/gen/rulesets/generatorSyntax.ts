import type { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';

export const GEN_URI = 'https://developer-overheid-nl.github.io/oas-generator';

const generatorSyntax: RulesetDefinition = {
  documentationUrl: 'https://developer-overheid-nl.github.io/oas-generator',
  description: 'OAS Generator syntax',
  rules: {
    'title-required': {
      severity: "error",
      given: "$",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "title",
            ],
          }
        }
      },
      message: "Title is required",
    },
    'title-string': {
      severity: "error",
      given: "$.title",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Title must be a non-empty string",
    },
    'description-required': {
      severity: "error",
      given: "$",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "description",
            ],
          }
        }
      },
      message: "Description is required",
    },
    'description-string': {
      severity: "error",
      given: "$.description",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Description must be a non-empty string",
    },
    'contact-required': {
      severity: "error",
      given: "$",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "contact",
            ],
          }
        }
      },
      message: "Contact info is required",
    },
    'contact-email-required': {
      severity: "error",
      given: "$.contact",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "email",
            ],
          }
        }
      },
      message: "Contact email is required",
    },
    'contact-email-string': {
      severity: "error",
      given: "$.contact.email",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Contact email must be a valid e-mailaddress",
    },
    'contact-name-required': {
      severity: "error",
      given: "$.contact",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "name",
            ],
          }
        }
      },
      message: "Contact name is required",
    },
    'contact-name-string': {
      severity: "error",
      given: "$.contact.name",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Contact name must be a valid non-empty string",
    },
    'contact-url-required': {
      severity: "error",
      given: "$.contact",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "url",
            ],
          }
        }
      },
      message: "Contact URL is required",
    },
    'contact-url-string': {
      severity: "error",
      given: "$.contact.url",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Contact URL must be a valid URI",
    },
    'resources-required': {
      severity: "error",
      given: "$",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "resources",
            ],
          }
        }
      },
      message: "Resources are required",
    },
    'resources-array': {
      severity: "error",
      given: "$.resources",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "array",
            minItems: 1,
          }
        }
      },
      message: "Resources must be an array with at least one resource",
    },
    'resource-name-required': {
      severity: "error",
      given: "$.resources[*]",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "name",
            ],
          }
        }
      },
      message: "Resource name is required",
    },
    'resource-name-string': {
      severity: "error",
      given: "$.resources[*].name",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Resource name must be a non-empty string",
    },
    'resource-plural-required': {
      severity: "error",
      given: "$.resources[*]",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            required: [
              "plural",
            ],
          }
        }
      },
      message: "Resource plural is required",
    },
    'resource-plural-string': {
      severity: "error",
      given: "$.resources[*].plural",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "string",
            pattern: "\\w+",
          }
        }
      },
      message: "Resource plural must be a non-empty string",
    },
    'resource-readonly-boolean': {
      severity: "error",
      given: "$.resources[*].readonly",
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: "boolean",
          }
        }
      },
      message: "Resource readonly must be a boolean",
    },
  },
};

export default generatorSyntax;



