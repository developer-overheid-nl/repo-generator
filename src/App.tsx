import { FC } from 'react';
import { Link } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import GitHubIcon from './components/GitHubIcon';
import { Spec } from './types';

interface Props {
  spec: Spec;
}

const App: FC<Props> = ({ spec }) => {

  const headerStyle = {
    color: 'white',
    background: "#154273"
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center px-4 py-2 bg-slate-700 text-white" style={headerStyle}>
        <div>
          <h1 className="text-lg font-medium">
            <Link to="/">OAS Generator</Link>
          </h1>
        </div>
        <div className="flex items-center">
          <a href="https://github.com/developer-overheid-nl/oas-generator" target="_blank">
            <GitHubIcon />
          </a>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <CodeEditor spec={spec} uri={undefined} />
      </div>
    </div>
  );
};

export default App;
