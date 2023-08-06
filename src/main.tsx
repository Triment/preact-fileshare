import './index.css';
import Router from 'preact-router';
import Home from './Home';
import Layout from './Layout';

export const Main = ({url}:{url?:string}) => (
  <Layout>
    <Router url={url}>
      <Home path="/" />
      {/* <FileShare path="/fileshare/:id?"  /> */}
    </Router>
  </Layout>
  
);
// render(<Main/>, document.getElementById('app')!)