import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './containers/Homepage';
import SignIn from './containers/SignIn';
import DriverData from './containers/DriverData';
import History from './containers/History';

function App() {
  return (
    <Router> 
      {/*<NavBar />*/}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign_in" element={<SignIn />}/>
        <Route path="/driver_data" element={<DriverData/>}/>
        <Route path="/history" element={<History/>}/>
      </Routes>
    </Router>
  );
}

export default App;
