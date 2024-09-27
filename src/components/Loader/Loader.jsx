// components/OverlayLoader.jsx
import React from "react";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";

const OverlayLoader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <Loader className="animate-spin text-white" size={48} />
    </div>
  );
};

export default OverlayLoader;
