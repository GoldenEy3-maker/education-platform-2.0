import { useState } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

export const useNavigatorUserAgent = () => {
  const [isMac, setIsMac] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
  }, []);

  return { isMac };
};
