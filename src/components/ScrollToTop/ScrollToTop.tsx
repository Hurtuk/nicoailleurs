// ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.match(/(voyages|trips)\/[^/]+\/\d+/g)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}