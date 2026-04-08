import { Route, Routes } from 'react-router-dom';
import { RequireHistory, RequireIntroSeen, RootGate } from './components/RouteGuards';
import { HomeRoute } from './routes/home';
import { IntroRoute } from './routes/intro';
import { GameRoute } from './routes/play';
import { ReportsRoute } from './routes/reports';
import { ResultRoute } from './routes/result';
import { AngerRoute } from './routes/start/anger';
import { NameRoute } from './routes/start/name';
import { TargetRoute } from './routes/start/target';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootGate />} />
      <Route path="/intro" element={<IntroRoute />} />
      <Route element={<RequireIntroSeen />}>
        <Route path="/start/target" element={<TargetRoute />} />
        <Route path="/start/name" element={<NameRoute />} />
        <Route path="/start/anger" element={<AngerRoute />} />
      </Route>
      <Route path="/play" element={<GameRoute />} />
      <Route path="/result" element={<ResultRoute />} />
      <Route element={<RequireHistory />}>
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/reports" element={<ReportsRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
