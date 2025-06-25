import { useState } from "react";

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
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-5">
        {/* Header */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
            Frequently <br /> asked questions
          </h2>
          <p className="mt-3 text-sm text-neutral-00 hidden md:block">
            Everything you need to know about Booklio.
          </p>
        </div>

        {/* Accordion */}
        <div className="md:col-span-3">
          <div className="divide-y divide-neutral-300">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-start text-left text-gray-500 font-medium transition hover:text-blue-600 dark:hover:text-blue-700"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${index}`}
                  >
                    <span className="text-sm md:text-base">{faq.question}</span>
                    <svg
                      className={`ml-4 shrink-0 size-5 transition-transform duration-300 transform ${isOpen ? "rotate-180" : ""
                        } text-gray-500`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        color="white"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Reserved space and better transitions */}
                  <div
                    id={`faq-${index}`}
                    className={`transition-all duration-300 ease-in-out overflow-hidden will-change-[max-height,opacity] ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="mt-2 text-sm text-gray-300  md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
