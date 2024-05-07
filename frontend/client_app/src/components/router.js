import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "../pages/HomePage";
import SetupPage from "../pages/setupPage";
import ClientSearch from "../pages/clientSearch";
import ArticleVersions from "../pages/articleVersions";
import Header from "./header";
import Footer from "./footer";
import SpecificRun from "../pages/specificRun";
import Docs from "../pages/docs";
import Tutorial from "./docs/tutorial";
import Selectors from "./docs/selectors";
import GeneralInfo from "./docs/generelInfo";

function AppRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setActive/:name" element={<SetupPage />} />
        <Route path="/search" element={<ClientSearch />} />
        <Route path="/versions" element={<ArticleVersions />} />
        <Route path="/lastRuns/:name/:creation" element={<SpecificRun />} />
        <Route path="/docs" element={<Docs />}>
          <Route path="general" element={<GeneralInfo />} />
          <Route path="tutorial" element={<Tutorial />} />
          <Route path="selectors" element={<Selectors />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRouter;