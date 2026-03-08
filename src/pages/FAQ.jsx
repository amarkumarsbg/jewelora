import FAQAccordion from "../components/FAQAccordion";

const FAQ = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-center font-heading text-3xl md:text-4xl font-medium text-neutral-dark mb-4">
        Frequently Asked Questions
      </h1>
      <p className="text-center text-neutral-mid mb-12 max-w-xl mx-auto">
        Find answers to common questions about shopping, shipping, returns, and more.
      </p>
      <div className="max-w-2xl mx-auto">
        <FAQAccordion variant="light" />
      </div>
    </div>
  );
};

export default FAQ;
