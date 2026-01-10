import { Outlet } from "react-router";
import Navbar from "./components/Client/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Client/Footer";

function App() {
  return (
    <div className="font-primary bg-white">
      <ScrollToTop />
      <Navbar />
      <main className="max-w-7xl min-h-dvh mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <ToastContainer theme="colored" />
      <Footer />
    </div>
  );
}

export default App;
