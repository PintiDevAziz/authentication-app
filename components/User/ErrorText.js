import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

const ErrorText = ({ error }) => {
  const [animate] = useAutoAnimate();
  return (
    <div ref={animate}>
      {error && (
        <div className="w-full flex items-center py-2 justify-center animate-pulse text-red-500 font-semibold">
          {error}
        </div>
      )}
    </div>
  );
};

export default ErrorText;
