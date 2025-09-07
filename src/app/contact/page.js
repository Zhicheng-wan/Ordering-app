export default function Contact() {
  return (
    <section>
      <div className="max-w-2xl mx-auto text-center my-28">
        <h2 className="text-4xl font-bold text-red-600 mb-4">Get in Touch</h2>
        <p className="text-lg text-gray-700 mb-8">
          We would love to hear from you! Whether you have questions, feedback, or just want to say
          hello, feel free to reach out.
        </p>
        <form className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded w-full max-w-md"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-2 rounded w-full max-w-md"
          />
          <textarea
            placeholder="Your Message"
            className="border p-2 rounded w-full max-w-md h-32"
          ></textarea>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-full font-semibold"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
