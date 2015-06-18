import { DefaultRoute, Route, HashLocation, run } from 'react-router';
import App from './App' ;
import Home from './Home' ;
import Sites from './Sites' ;
import Export from './Export';

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Home}/>
    <Route path="home" handler={Home}/>
    <Route path="site" handler={Sites}/>
    <Route path="export" handler={Export}/>
  </Route>
);

run(routes, HashLocation, (Root) => {
  React.render(<Root/>, document.body);
});
