import { useState } from "react";
import arrowUrl from "../../assets/arrow.svg";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Card = ({ image }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <motion.div
      className="relative h-[300px] min-w-[200px] bg-#060606 flex justify-center items-center"
      onHoverStart={() => setShowOverlay(true)}
      onHoverEnd={() => setShowOverlay(false)}
    >
      <AnimatePresence>
        {showOverlay && (
          <Link to="/shop/listing">
            <motion.div
              className="absolute inset-0 z-10 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute bg-#060606 pointer-events-none opacity-50 h-full w-full" />
              <motion.h1
                className="bg-white font-semibold text-sm z-10 px-2 py-2 rounded-full flex items-center gap-[0.5ch] hover:opacity-75 pointer-events-none"
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                exit={{ y: 10 }}
              >
                <span>Shop Now</span>
                <img src={arrowUrl} alt="arrow" loading="lazy" decoding="async" />
              </motion.h1>
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
      <img src={image} alt={image} className="w-full h-full object-cover" loading="lazy" decoding="async" />
    </motion.div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
};

export default Card;
