import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll lên ngay lập tức, tránh nháy
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return children;
};

export default ScrollToTop;
