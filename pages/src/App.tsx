import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
// import Test from './pages/Test';
import Docs from './pages/Docs';
import Advanced from './pages/Advanced';
import { BASE_PATH } from './utils/global';

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path={BASE_PATH} element={<Landing />} />
        {/* <Route path={BASE_PATH + 'test/'} element={<Test />} /> */}
        <Route path={BASE_PATH + 'document'} element={<Docs />} />
        <Route path={BASE_PATH + 'advanced'} element={<Advanced />} />
      </Route>
      {/* <Route path={BASE_PATH + 'api'}>
        <Route path="render" element={<ApiComponent />} />
      </Route> */}
    </Routes>
  );
}

export default App;
