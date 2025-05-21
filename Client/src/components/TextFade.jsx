import React, { useEffect, useState } from "react";

function TypingFadeText({text}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`text-lg lg:text-2xl mb-4 fade-in`}>
      {displayed}
    </span>
  );
}

export default TypingFadeText;
