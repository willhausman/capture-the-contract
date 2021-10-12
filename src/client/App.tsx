import { HashRouter as Router, Route } from 'react-router-dom';
import { Menu } from '~/components/Menu';
import { Home } from '~/pages';

export const App = () => (
  <Router>
    <Menu>
      Menu content here.
    </Menu>
    <Route path="/">
      <Home />
    </Route>
  </Router>
);
