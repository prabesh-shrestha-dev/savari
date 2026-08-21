import { useEffect, useState } from "react";

export default function AnimatedAmount({ value }) {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1000;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const easeOut = 1 - Math.pow(1 - progress, 4);

      setDisplay(Math.floor(target * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    setDisplay(0);
    requestAnimationFrame(animate);
  }, [target]);

  return (
    <span className="amount-counter">
      {display.toLocaleString()}
    </span>
  );
}