import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path="/" element={<Landing />} />
      </Route>
    </Routes>
  );
}

export default App;
