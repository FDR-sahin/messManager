import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// AnimatedNumber: number ta 0 theke target value porjonto count up animation kore
function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString(),
  );
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.8, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return <>{display}</>;
}

function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  icon,
  color = "brand",
}) {
  const colorMap = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-accent-green/10 text-accent-green",
    red: "bg-accent-red/10 text-accent-red",
    amber: "bg-accent-amber/10 text-accent-amber",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="card flex items-center gap-4"
    >
      <div
        className={`md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div>
        <p className="text-sm text-slate2-400">{label}</p>
        <p className="text-2xl font-display font-semibold text-slate2-900">
          {prefix}
          <AnimatedNumber value={value} />
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}

export default StatCard;
