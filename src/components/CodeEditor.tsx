import { json, jsonParseLinter } from '@codemirror/lang-json';
import {yaml} from "@codemirror/lang-yaml"
import { markdown } from '@codemirror/lang-markdown';
import { Diagnostic, forEachDiagnostic, linter, lintGutter, setDiagnosticsEffect } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import ReactCodeMirror, { EditorSelection, Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import clsx from 'clsx';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spec, SpecLinter } from '../types';
import { groupBySource } from '../util';
import parseOutput from '../populateOutputFile';


const INPUT_EDITOR_EXTENSIONS: Extension[] = [json(), linter(jsonParseLinter()), lintGutter()];

interface Props {
  spec: Spec;
  uri?: string;
  gitTemplate: string | null;
}

const CodeEditor: FC<Props> = ({ spec, gitTemplate }) => {
  const [content, setContent] = useState('{}');
  const [output, setOutput] = useState('{}');
  const [checking, setChecking] = useState(false);
  const [error] = useState<string>();
  const [linters, setLinters] = useState<SpecLinter[]>([]);
  const [diagnostics, setDiagnostics] = useState<{ [key: string]: Diagnostic[] }>({});
  const [copied, setCopied] = useState(false);
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);

  const location = useLocation();

  const outputExtensions = useMemo(() => {
    if (location.pathname?.endsWith('.yml') || location.pathname?.endsWith('.yaml')) {
      return [yaml()];
    }
    return [markdown()];
  }, [location]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    setContent(spec.example);
    setLinters(spec.linters);
  }, [spec]);

  useEffect(() => {
    if (gitTemplate) {  
      const result = parseOutput(content, gitTemplate);
      setOutput(result);
    }
  }, [gitTemplate, content]);

  return (
    <div className="flex h-full">
      <div className="w-[50%] min-w-[400px] overflow-auto">
        <ReactCodeMirror
          ref={codeMirrorRef}
          value={content}
          extensions={[...INPUT_EDITOR_EXTENSIONS, ...linters.map(l => l.linter), EditorView.lineWrapping]}
          onUpdate={viewUpdate => {
            if (error) {
              return;
            }

            viewUpdate.transactions.forEach(transaction => {
              transaction.effects.forEach(effect => {
                if (effect.is(setDiagnosticsEffect)) {
                  const diagnostics: Diagnostic[] = [];
                  forEachDiagnostic(viewUpdate.state, d => diagnostics.push(d));
                  setDiagnostics(groupBySource(diagnostics));
                  setChecking(false);
                }
              });
            });

            if (viewUpdate.docChanged) {
              setContent(viewUpdate.state.doc.toString());
              // setOutput(populateOpenApiSpec(viewUpdate.state.doc.toString()));
              setChecking(true);
            }
          }}
        />
      </div>
      <div className="w-[50%] min-w-[400px] max-w-[50%] overflow-auto">
        {checking && <p><div className="error-container m-2">Genereren...</div></p>}
        {!checking && error && <div className="mb-4 p-4 bg-red-500 text-white rounded-sm shadow-lg">{error}</div>}
        {!checking &&
          !error &&
          linters.map(linter => (
            <div key={linter.name}>
              {!diagnostics[linter.name] ? (
                <div className="relative">
                  <ReactCodeMirror ref={codeMirrorRef} value={output} extensions={outputExtensions} readOnly={true} className='' />
                  <button onClick={handleCopy} className="fixed top-14 right-2 text-x">{copied ? '✓ Gekopieërd!' : 'Kopiëren'}</button>
                </div>
              ) : (
                <>
                <div className="error-container m-2">
                  <div className="mb-2 p-4 bg-red-500 text-white rounded-sm shadow-lg">
                    [{linter.name}] Found {diagnostics[linter.name].length} linting error(s).
                  </div>
                  <ul>
                    {diagnostics[linter.name].map((diagnostic, i) => (
                      <li key={i}>
                        <div
                          className={clsx('mb-4 p-4 rounded-sm shadow-lg', {
                            'bg-red-200': diagnostic.severity === 'error',
                            'bg-yellow-100': diagnostic.severity === 'warning',
                            'bg-white': diagnostic.severity === 'info' || diagnostic.severity === 'hint',
                          })}
                        >
                          {diagnostic.message}
                          &nbsp;
                          <span className="text-blue-600 underline">
                            <a
                              className="cursor-pointer"
                              onClick={() =>
                                codeMirrorRef.current?.view?.dispatch({
                                  selection: EditorSelection.single(diagnostic.from, diagnostic.to),
                                  scrollIntoView: true,
                                })
                              }
                            >
                              (show)
                            </a>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  </div>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CodeEditor;
