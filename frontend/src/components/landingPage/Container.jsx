import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

export const Container = ({ children, className = "", style = {} }) => {
    return (
        <div className={twMerge("mx-auto max-w-[980px] px-8", className)} style={style}>
            {children}
        </div>
    );
};

Container.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
};
