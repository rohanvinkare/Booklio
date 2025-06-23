import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

export const Faqs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Can I cancel a Booklio order anytime?",
            answer:
                "Yes, you can cancel your Booklio order before it is dispatched. We would appreciate feedback while you cancel.",
        },
        {
            question: "My account has credits. How can I use them on Booklio?",
            answer:
                "Your credits will be automatically applied at checkout. Just ensure you're logged in with the same account.",
        },
        {
            question: "How does Booklio's pricing work?",
            answer:
                "Booklio offers competitive pricing for both new and used books. Discounts and offers vary by seller.",
        },
        {
            question: "Is my data secure on Booklio?",
            answer:
                "Absolutely. Booklio prioritizes user data security with encrypted transactions and secure authentication.",
        },
        {
            question: "How do I access an eBook I purchased on Booklio?",
            answer:
                "After purchase, go to your dashboard > My Library. You can read your eBooks directly from there.",
        },
        {
            question: "Can I upgrade to a seller account later?",
            answer:
                "Yes! You can switch to a seller account anytime from your profile settings and start listing your books.",
        },
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="grid md:grid-cols-5 gap-10">
                <div className="md:col-span-2">
                    <div className="max-w-xs">
                        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
                            Frequently <br /> asked questions
                        </h2>
                        <p className="mt-1 hidden md:block text-gray-600 dark:text-neutral-400">
                            Everything you need to know about Booklio.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-3">
                    <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {faqs.map((faq, index) => (
                            <div key={index} className="py-4">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between gap-x-3 text-left md:text-lg font-semibold text-gray-800 dark:text-neutral-200 hover:text-gray-500 dark:hover:text-neutral-400 transition"
                                >
                                    {faq.question}
                                    <svg
                                        className={`transition-transform duration-300 size-5 text-gray-600 dark:text-neutral-400 ${openIndex === index ? "rotate-180" : ""
                                            }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>


                                {/* <AnimatePresence initial={false}>
                                    {openIndex === index && (
                                        <motion.div
                                            key="content"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <p className="mt-2 text-gray-600 dark:text-neutral-400 text-sm md:text-base">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence> */}

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="mt-2 text-gray-600 dark:text-neutral-400 text-sm md:text-base">
                                        {faq.answer}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
