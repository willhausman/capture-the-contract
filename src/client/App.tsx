import { HashRouter as Router, Route } from 'react-router-dom';
import { Home } from '~/pages';

export const App = () => (
  <Router>
    <Route path="/">
      <Home />
    </Route>
  </Router>
);
