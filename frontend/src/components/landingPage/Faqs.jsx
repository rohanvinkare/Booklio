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
        <div className="flex justify-center items-center">
            <section
                id="faq"
                className="flex-col w-[80vw] justify-center items-center px-60 pt-20 h-[50vh] mt-10 text-3xl text-white bg-background">
                <p className="text-4xl font-helvetica">FAQ's</p>

                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`faq mt-2 pb-2 border-b-2 border-white cursor-pointer transition-all duration-500 ${clickedIndex === index ? "max-h-[300px]" : "max-h-16"}`}
                    >
                        <div className="question flex justify-between items-center">
                            <p className="text-xl font-helvetica">{faq.question}</p>
                            {clickedIndex === index ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        <div
                            className={`answer overflow-hidden transition-max-height duration-500 ${clickedIndex === index ? "max-h-[200px]" : "max-h-0"}`}
                        >
                            <p className="pt-2 text-sm font-helvetica leading-6">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};
