import { motion } from "framer-motion";
const LeftSideSnippet = () => {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden lg:flex w-full lg:w-2/5 bg-black items-center justify-center"
    >
      <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold">
        SNIPPETS
      </h1>
    </motion.div>
  );
};

export default LeftSideSnippet;
