import { hydrate } from 'preact';
import Router from 'preact-router';
import { FileShare } from './FileShare';
import Home from './Home';
import Layout from './Layout';
import './index.css';

export const Main = ({url}:{url?:string}) => (
  <Layout>
    <Router url={url}>
      <Home path="/" />
      <FileShare path="/fileshare/:id?"  />
    </Router>
  </Layout>
  
);
if(!import.meta.env.SSR){
  console.log("SPA")
  hydrate(<Main/>,  document.getElementById('app')!);
}
