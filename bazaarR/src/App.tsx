import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Providers from "./components/Providers";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Providers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          {/* Add more routes here as they are ported */}
        </Routes>
      </Providers>
    </Router>
  );
}


export default App;
