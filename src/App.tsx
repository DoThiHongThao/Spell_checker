import './style/App.css';
import HightLighter from "./pages/HightLighter";
import {
  BrowserRouter as Router,
  Route, Switch, RouteComponentProps
} from "react-router-dom";
import UploadFile from './pages/UploadFile';
function App() {
  return (
    <Router>
      <Switch>
        <Route
          key={`uploadfirebase`}
          path="/upload"
          exact
          render={(props: RouteComponentProps<any>) => <UploadFile />}
        />
        <Route
          key={`hightlighter`}
          path="/hightlighter"
          exact
          render={(props: RouteComponentProps<any>) => <HightLighter />}
        />
      </Switch>
    </Router>
  );
}

export default App;
