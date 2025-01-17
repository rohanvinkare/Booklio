import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

export const Button = ({ children, size = "medium", className = "" }) => {
    const sizeClassNames = {
        small: "text-xs px-2 py-1",
        medium: "text-md px-5 py-3",
        large: "text-lg px-5 py-5",
    };
    return (
        <button className={twMerge("text-textBlack bg-white rounded-full", sizeClassNames[size], className)}>
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    className: PropTypes.string,
};
