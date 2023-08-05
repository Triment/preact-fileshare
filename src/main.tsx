import { render } from 'preact'
import './index.css'
import Router from 'preact-router'
import { FileShare } from './FileShare';

const Main = () => (
  <Router>
    <FileShare path="/fileshare/:id?" />
  </Router>
);
render(<Main/>, document.getElementById('app')!)
