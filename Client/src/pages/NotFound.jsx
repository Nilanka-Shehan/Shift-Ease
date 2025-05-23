// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-xl">
        <img
          src="https://illustrations.popsy.co/gray/error.svg"
          alt="404 Illustration"
          className="mx-auto w-60 md:w-80 mb-8"
        />
        <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
        <p className="text-xl md:text-2xl mb-4">Oops! Page not found.</p>
        <p className="text-gray-400 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
        >
          <FaArrowLeft className="mr-2" />
          Go back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
