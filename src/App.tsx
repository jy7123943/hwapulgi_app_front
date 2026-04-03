import { Route, Routes } from 'react-router-dom';
import { RootGate } from './components/RouteGuards';
import { HomeRoute } from './routes/home';
import { GameRoute } from './routes/play';
import { ResultRoute } from './routes/result';
import { AngerRoute } from './routes/start/anger';
import { NameRoute } from './routes/start/name';
import { TargetRoute } from './routes/start/target';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootGate />} />
      <Route path="/start/target" element={<TargetRoute />} />
      <Route path="/start/name" element={<NameRoute />} />
      <Route path="/start/anger" element={<AngerRoute />} />
      <Route path="/play" element={<GameRoute />} />
      <Route path="/result" element={<ResultRoute />} />
      <Route path="/home" element={<HomeRoute />} />
    </Routes>
  );
}

export default App;
