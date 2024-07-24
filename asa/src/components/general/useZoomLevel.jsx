import { useState, useEffect } from "react";

const useZoomLevels = () => {
  const [zoomLevel, setZoomLevel] = useState(null);

  useEffect(() => {
    const checkZoom = () => {
      const zoomPercentage = Math.round(window.devicePixelRatio * 100);
      if (zoomPercentage <= 50) {
        setZoomLevel("zoomed-50");
      } else if (zoomPercentage <= 90) {
        setZoomLevel("zoomed-90");
      } else {
        setZoomLevel(null);
      }
    };

    window.addEventListener("resize", checkZoom);
    window.addEventListener("load", checkZoom);

    checkZoom(); // Initial check

    return () => {
      window.removeEventListener("resize", checkZoom);
      window.removeEventListener("load", checkZoom);
    };
  }, []);

  return zoomLevel;
};

export default useZoomLevels;
