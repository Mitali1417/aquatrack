import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Report from "./routes/Reports";
// import About from "./routes/About";
import Home from "./routes/Home";
import Header from "./components/Header";
// import ReportCard from "./components/ReportCard";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="mt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NotFound />} />
            {/* <Route path="/reports" element={<ReportCard />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
