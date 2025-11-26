import { kebabCase, upperCamelCase } from 'case-anything'

export const populateOpenApiSpec = (inputJson: string) => {
  const content = JSON.parse(inputJson) as {
    title: string;
    description: string;
    contact: {
      name: string;
      email: string;
      url: string;
    };
    resources: {
      name: string;
      plural: string;
      readonly?: boolean;
    }[];
  };
  return JSON.stringify({
    "openapi": "3.0.2",
    "info": {
      "title": content.title,
      "description": content.description,
      "version": "1.0.0",
      "contact": {
        "name": content.contact.name,
        "email": content.contact.email,
        "url": content.contact.url
      }
    },
    "servers": [
      {
        "url": "@TODO: Add server URL",
      }
    ],
    "tags": content.resources.map(resource => {
      const tag = toUppercase(resource['plural']);
      return { "name": tag, "description": `Alle API operaties die bij ${resource['plural']} horen.` }
    }),
    "paths": createPaths(content.resources as []),
    "components": {
      "schemas": createSchemas(content.resources as []),
      "parameters": {
        "id": {
          "name": "id",
          "in": "path",
          "description": "id",
          "required": true,
          "schema": {
            "type": "string"
          }
        }
      }
    }
  }, undefined, 2)
}

const toUppercase = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const createPaths = (resources: []) => {
  const initialValue = {};
  return resources.reduce((obj, item) => {

    const endpointList = createEndpointList(item)
    const endpointSingle = createEndpointSingle(item)

    const pluralKebabCase = kebabCase(item['plural']);

    return {
      ...obj,
      [`/${pluralKebabCase}`]: endpointList,
      [`/${pluralKebabCase}/{id}`]: endpointSingle,
    };
  }, initialValue);
};

const createEndpointSingle = function (item: {
  name: string;
  plural: string;
  readonly?: boolean;
}) {
  const endpointSingle: {
    parameters: { $ref: string }[];
    get: {
      operationId: string;
      description: string;
      summary: string;
      tags: string[];
      responses: {
        "200": {
          headers: { "API-Version": { $ref: string } };
          description: string;
          content: { "application/json": { schema: { $ref: string } } };
        };
        "404": { $ref: string };
      };
    };
    put?: {
      operationId: string;
      description: string;
      summary: string;
      tags: string[];
      responses: {
        "200": {
          headers: { "API-Version": { $ref: string } };
          description: string;
          content: { "application/json": { schema: { $ref: string } } };
        };
        "400": { $ref: string };
      };
    };
    delete?: {
      operationId: string;
      description: string;
      summary: string;
      tags: string[];
      responses: {
        "204": { $ref: string };
        "404": { $ref: string };
      };
    };
  } = {
    "parameters": [
      {
        "$ref": "#/components/parameters/id"
      }
    ],
    "get": {
      "operationId": `retrieve${upperCamelCase(item['name'])}`,
      "description": `${toUppercase(item['name'])} ophalen`,
      "summary": `${toUppercase(item['name'])} ophalen`,
      "tags": [
        toUppercase(item['plural']),
      ],
      "responses": {
        "200": {
          "headers": {
            "API-Version": {
              "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/headers/API-Version"
            }
          },
          "description": "OK",
          "content": {
            "application/json": {
              "schema": {
                "$ref": `#/components/schemas/${toUppercase(item['name'])}`
              }
            }
          }
        },
        "404": {
          "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/responses/404"
        }
      }
    }
  }

  if (!item.readonly) {
    endpointSingle["put"] = {
      "operationId": `edit${upperCamelCase(item['name'])}`,
      "description": `${toUppercase(item['name'])} wijzigen`,
      "summary": `${toUppercase(item['name'])} wijzigen`,
      "tags": [
        toUppercase(item['plural']),
      ],
      "responses": {
        "200": {
          "headers": {
            "API-Version": {
              "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/headers/API-Version"
            }
          },
          "description": "OK",
          "content": {
            "application/json": {
              "schema": {
                "$ref": `#/components/schemas/${toUppercase(item['name'])}`
              }
            }
          }
        },
        "400": {
          "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/responses/400"
        }
      }
    }
    endpointSingle["delete"] = {
      "operationId": `remove${upperCamelCase(item['name'])}`,
      "description": `${toUppercase(item['name'])} verwijderen`,
      "summary": `${toUppercase(item['name'])} verwijderen`,
      "tags": [
        toUppercase(item['plural']),
      ],
      "responses": {
        "204": {
          "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/responses/204"
        },
        "404": {
          "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/responses/404"
        }
      }
    }
  }

  return endpointSingle;
}

const createEndpointList = function (item: {
  name: string;
  plural: string;
  readonly?: boolean;
}) {
  const endpointList: {
    get: {
      operationId: string;
      description: string;
      summary: string;
      tags: string[];
      responses: {
        "200": {
          headers: {
            "API-Version": { $ref: string };
            Link: { $ref: string };
          };
          description: string;
          content: {
            "application/json": {
              schema: { $ref: string };
            };
          };
        };
      };
    };
    post?: {
      operationId: string;
      description: string;
      summary: string;
      tags: string[];
      responses: {
        "201": {
          headers: {
            "API-Version": { $ref: string };
          };
          description: string;
          content: {
            "application/json": {
              schema: { $ref: string };
            };
          };
        };
        "400": { $ref: string };
      };
    };
  } = {
    "get": {
      "operationId": `list${upperCamelCase(item['plural'])}`,
      "description": `Alle ${item['plural']} ophalen`,
      "summary": `Alle ${item['plural']} ophalen`,
      "tags": [
        toUppercase(item['plural'])
      ],
      "responses": {
        "200": {
          "headers": {
            "API-Version": {
              "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/headers/API-Version"
            },
            "Link": {
              "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/headers/Link"
            }
          },
          "description": "OK",
          "content": {
            "application/json": {
              "schema": {
                "$ref": `#/components/schemas/${toUppercase(item['name'])}`
              }
            }
          }
        }
      }
    },
  }

  if (!item.readonly) {
    endpointList["post"] = {
      "operationId": `create${upperCamelCase(item['plural'])}`,
      "description": `Nieuwe ${item['name']} aanmaken`,
      "summary": `Nieuwe ${item['name']} aanmaken`,
      "tags": [
        toUppercase(item['plural']),
      ],
      "responses": {
        "201": {
          "headers": {
            "API-Version": {
              "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/headers/API-Version"
            }
          },
          "description": "Created",
          "content": {
            "application/json": {
              "schema": {
                "$ref": `#/components/schemas/${toUppercase(item['name'])}`
              }
            }
          }
        },
        "400": {
          "$ref": "https://static.developer.overheid.nl/adr/components.yaml#/responses/400"
        }
      }
    }
  }

  return endpointList

}

const createSchemas = (resources: []) => {
  const initialValue = {};
  return resources.reduce((obj, item) => {

    const objSchema = {
      properties: {
        id: {
          type: "string",
          format: "uuid",
        }
      }
    };

    return {
      ...obj,
      [`${upperCamelCase(item['name'])}`]: objSchema,
    };
  }, initialValue);
};

export default populateOpenApiSpec;
