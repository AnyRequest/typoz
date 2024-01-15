import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
// import Test from './pages/Test';
import { BASE_PATH } from './utils/global';
import ApiComponent from './pages/ApiComponent';

function App() {
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path={BASE_PATH} element={<Landing />} />
        {/* <Route path={BASE_PATH + 'test/'} element={<Test />} /> */}
      </Route>
      <Route path={BASE_PATH + 'api'}>
        <Route path="render" element={<ApiComponent />} />
      </Route>
    </Routes>
  );
}

export default App;
