import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './containers/Homepage';
import ApplicationForm from './containers/ApplicationForm';
import DriverData from './containers/DriverData';
import Rent from './containers/Rent'

function App() {
  return (
    <Router> 
      {/*<NavBar />*/}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/driver_data" element={<DriverData/>}/>
        <Route path='/rent' element={<Rent/>}/>
        <Route path="/apply_VC" element={<ApplicationForm />}/>
      </Routes>
    </Router>
  );
}

export default App;
