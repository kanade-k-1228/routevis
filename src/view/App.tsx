import type { FC } from "react";
import { Route, Router, Switch } from "wouter";
import { Footer } from "./common/Footer";
import { Header } from "./common/Header";
import { Editor } from "./editor/Editor";
import { Guide } from "./guide/Guide";
import { Home } from "./home/Home";
import { RouteView } from "./route/RouteView";

export const App: FC = () => {
  return (
    <Router base="/routevis">
      <div className="h-screen flex flex-col bg-slate-800">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/guide/:step" component={Guide} />
            <Route path="/view/" component={RouteView} />
            <Route path="/edit/" component={Editor} />
            <Route path="*" component={Home} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
