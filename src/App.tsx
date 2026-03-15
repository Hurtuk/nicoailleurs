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
import CountryPage from "./pages/CountryPage/CountryPage";
import CityPage from "./pages/CityPage/CityPage";

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
          <Route path="pays/:slug" element={<CountryPage />} />
          <Route path="countries" element={<ContinentsPage />} />
          <Route path="countries/:slug" element={<CountryPage />} />
          
          <Route path="villes" element={<CitiesPage />} />
          <Route path="villes/:slug" element={<CityPage />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="cities/:slug" element={<CityPage />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;