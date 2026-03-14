import { BrowserRouter, Route, Routes } from "react-router-dom";
import TripsPage from "./pages/TripsPage/TripsPage";
import TripPage from "./pages/TripPage/TripPage";
import LocaleWrapper from "./components/LocaleWrapper";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import "./App.scss";
import Footer from "./components/Footer/Footer";
import ContinentsPage from "./pages/ContinentsPage/ContinentsPage";
import CitiesPage from "./pages/CitiesPage/CitiesPage";

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
          
          <Route path="pays" element={<ContinentsPage />} />
          <Route path="pays/:id" element={<ContinentsPage />} />
          <Route path="countries" element={<ContinentsPage />} />
          <Route path="countries/:id" element={<ContinentsPage />} />
          
          <Route path="villes" element={<CitiesPage />} />
          <Route path="villes/:id" element={<CitiesPage />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="cities/:id" element={<CitiesPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;