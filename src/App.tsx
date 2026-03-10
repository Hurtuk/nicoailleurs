import { BrowserRouter, Route, Routes } from "react-router-dom";
import TripsPage from "./pages/TripsPage/TripsPage";
import TripPage from "./pages/TripPage/TripPage";
import LocaleWrapper from "./components/LocaleWrapper";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import "./App.scss";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>  
        <Route path="/:lang?" element={<LocaleWrapper />}>
          <Route index element={<HomePage />} />
          
          <Route path="voyages" element={<TripsPage />} />
          <Route path="voyages/:id" element={<TripPage />} />

          <Route path="trips" element={<TripsPage />} />
          <Route path="trips/:id" element={<TripPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;