import { motion } from 'framer-motion';

export default function SceneFrame({ children, className = '' }) {
  return (
    <motion.main
      id="main-content"
      className={`game-scene ${className}`}
      initial={{ opacity: 0, filter: 'brightness(1.4)' }}
      animate={{ opacity: 1, filter: 'brightness(1)' }}
      exit={{ opacity: 0, filter: 'brightness(1.8)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.main>
  );
}
