import { linter } from '@codemirror/lint';
import { Document, RulesetDefinition, Spectral } from '@stoplight/spectral-core';
import { Json } from '@stoplight/spectral-parsers';
import { DiagnosticSeverity } from '@stoplight/types';
import { Extension } from '@uiw/react-codemirror';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Severity } from './types';
import parametersSchema from '../input_json_schema.json';

interface BetterAjvError {
  line?: number;
  column?: number;
  error?: string;
  message?: string;
}

export interface Rulesets {
  [confClass: string]: RulesetDefinition;
}

const mapSeverity = (severity: DiagnosticSeverity): Severity => {
  switch (severity) {
    case DiagnosticSeverity.Warning:
      return 'warning';
    case DiagnosticSeverity.Information:
      return 'info';
    case DiagnosticSeverity.Hint:
      return 'hint';
    default:
      return 'error';
  }
};

export const spectralLinter = (name: string, ruleset: RulesetDefinition): Extension => {
  const spectral = new Spectral();

  spectral.setRuleset(ruleset);

  return linter(async view => {
    const doc = view.state.doc;
    const document = new Document(doc.toString(), Json);

    const violations = await spectral.run(document);

    return violations.map(violation => ({
      source: name,
      from: doc.line(violation.range.start.line + 1).from + violation.range.start.character,
      to: doc.line(violation.range.end.line + 1).from + violation.range.end.character,
      severity: mapSeverity(violation.severity),
      message: `[${violation.code}] ${violation.message}`,
    }));
  });
};

export const ajvLinter = (name: string): Extension => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // Remove meta-schema properties that AJV doesn't need for validation
  const { $schema, $id, ...schemaForValidation } = parametersSchema;
  const validate = ajv.compile(schemaForValidation);

  return linter(async view => {
    
    const doc = view.state.doc;
    const text = doc.toString();

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // JSON parse error
      return [{
        source: name,
        from: 0,
        to: text.length,
        severity: 'error' as Severity,
        message: `Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`,
      }];
    }

    const valid = validate(parsed);

    if (!valid && validate.errors) {
      // const errors = betterAjvErrors({
      //   schema: jsonSchema,
      //   data: parsed,
      //   errors: validate.errors,
      // });

      return validate.errors.map((error: BetterAjvError) => {
        const line = error.line || 1;
        const column = error.column || 0;

        return {
          source: name,
          from: doc.line(line).from + column,
          to: doc.line(line).to,
          severity: 'error' as Severity,
          message: error.error || error.message || 'Validation error',
        };
      });
    }

    return [];
  });
};
