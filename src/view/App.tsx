import type { FC } from "react";
import { Route, Router, Switch } from "wouter";
import { RouteView } from "./route/RouteView";
import { Editor } from "./editor/Editor";
import { Header } from "./common/Header";
import { Footer } from "./common/Footer";

export const App: FC = () => {
  return (
    <Router base="/routevis">
      <div className="h-screen flex flex-col bg-slate-800 overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0">
          <Switch>
            <Route path="/edit/" component={Editor} />
            <Route path="*" component={RouteView} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
