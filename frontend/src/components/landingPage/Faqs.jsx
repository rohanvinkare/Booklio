import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const Faqs = () => {
    const faqs = [
        {
            question: "How can I purchase books on Booklio?",
            answer: "Simply search for your desired books, add them to your cart, and proceed to a secure checkout for a seamless purchase experience."
        },
        {
            question: "Can I easily find books by genre on Booklio?",
            answer: "Yes, Booklio offers a diverse range of over 17 genres and more than 1,800 books, making it easy to explore and find your next favorite read."
        },
        {
            question: "Is it possible to sell books on Booklio?",
            answer: "Absolutely! You can create a seller account, log in as a seller, and start listing your books to grow your business on Booklio."
        },
    ];

    const [clickedIndex, setClickedIndex] = useState(null);

    const handleClick = (index) => {
        setClickedIndex(clickedIndex === index ? null : index);
    };


    return (
        <div className="min-h-[1/2] bg-[#060606] py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-blue-400 mb-4">Frequently Asked Questions</h2>

                    <p className="text-gray-400">Everything you need to know about Booklio</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            onClick={() => handleClick(index)}
                            className="bg-[#0d0d0d] backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-700/70 transition-all duration-300"
                        >
                            <button
                                className="w-full px-6 py-4 text-left flex items-center justify-between"
                                aria-expanded={clickedIndex === index}
                            >
                                <span className="text-lg font-medium text-white">{faq.question}</span>
                                <span className="ml-6 flex-shrink-0 text-white">
                                    {clickedIndex === index ? (
                                        <ChevronUp className="h-6 w-6" />
                                    ) : (
                                        <ChevronDown className="h-6 w-6" />
                                    )}
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${clickedIndex === index
                                    ? 'max-h-48 opacity-100'
                                    : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-4">
                                    <p className="text-blue-300 text-base leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
