import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Rides from './pages/Rides';
import RideDetails from './pages/RideDetails';
import NewRide from './pages/NewRide';
import RequestRide from './pages/RequestRide';
import Profile from './pages/Profile';
import './App.css';


function MainApp(){
    document.title = "CampusRide";
    return (
        <div>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rides" element={<Rides />} />
                <Route path="/rides/:id" element={<RideDetails />} />
                <Route path="/requests/:id" element={<RideDetails />} />
                <Route path="/newride" element={<NewRide />} />
                <Route path="/requestride" element={<RequestRide />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </div>
  );
}

function App() {
  return(
    <BrowserRouter>
        <MainApp/>
    </BrowserRouter>
  )
}

export default App;
