import React from "react";
import HomeContainer from "./home/home-container";
import ErrorPage from "./commons/errorhandling/error-page";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            {/* Home Page: */}
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <HomeContainer />
                </div>
              )}
            />

            {/*Error Page:  */}
            <Route exact path="/error" render={() => <ErrorPage />} />
            <Route render={() => <ErrorPage />} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
