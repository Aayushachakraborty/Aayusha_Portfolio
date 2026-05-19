import { motion } from 'framer-motion';

export default function SceneFrame({ children, className = '', ...props }) {
  return (
    <motion.main
      id="main-content"
      className={`game-scene ${className}`}
      initial={false}
      {...props}
    >
      {children}
    </motion.main>
  );
}
