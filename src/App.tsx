import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import GitHubIcon from './components/GitHubIcon';
import { Spec } from './types';
import TemplateSelector from './components/TemplateSelector';

import '@rijkshuisstijl-community/design-tokens/dist/index.css'; // design tokens importeren
import '@rijkshuisstijl-community/components-css/dist/index.css'; // css importeren

interface Props {
  spec: Spec;
}

const App: FC<Props> = ({ spec }) => {
  const [gitTemplate, setGitTemplate] = useState<string | null>(null);

  const headerStyle = {
    color: 'white',
    background: "#154273"
  };

  const appStyle = {
    background: "#e2e8f0"
  }

  return (
    <div className="flex flex-col h-screen rhc-theme" style={appStyle}>
      <header className="flex justify-between items-center px-4 py-2 bg-slate-700 text-white" style={headerStyle}>
        <div>
          <h1 className="text-lg font-medium">
            <Link to="/">Repository Generator 2000</Link>
          </h1>
        </div>
        <div className="flex items-center">
          <TemplateSelector setGitTemplate={setGitTemplate} className='mr-2' />
          <a href="https://github.com/developer-overheid-nl/repo-generator" target="_blank">
            <GitHubIcon />
          </a>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <CodeEditor spec={spec} gitTemplate={gitTemplate} />
      </div>
    </div>
  );
};

export default App;
