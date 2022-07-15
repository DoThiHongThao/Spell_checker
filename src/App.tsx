import './style/App.css';
import HightLighter from "./pages/HightLighter";
import {
  BrowserRouter as Router,
  Route, Switch, RouteComponentProps
} from "react-router-dom";
import UploadFile from './pages/UploadFile';
import DownloadFile from './pages/DownloadFile';
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
        <Route
          key={`download`}
          path="/download"
          exact
          render={(props: RouteComponentProps<any>) => <DownloadFile />}
        />
      </Switch>
    </Router>
  );
}

export default App;
