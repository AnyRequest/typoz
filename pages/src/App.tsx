import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';

const basePath = import.meta.env.DEV ? '/' : '/typoz/';

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path={basePath} element={<Landing />} />
      </Route>
    </Routes>
  );
}

export default App;
