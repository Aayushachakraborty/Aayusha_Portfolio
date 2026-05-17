import { motion } from 'framer-motion';

export default function SceneFrame({ children, className = '', ...props }) {
  return (
    <motion.main
      id="main-content"
      className={`game-scene ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.main>
  );
}
