
import Hero from '@/components/layout/Hero';
import HomeMenu from '@/components/layout/HomeMenu';
import SectionHeaders from '@/components/layout/SectionHeaders';

export default function Home() {
  return (
      <>
       <Hero />
       <HomeMenu />
       <section className="text-center my-16">
         <SectionHeaders 
            title="Our Story" 
            subtitle="About Us" 
          />
          <div className="max-w-2xl flex flex-col items-center mx-auto gap-4">
            <p>
              Welcome to our world of collectibles! At POP MART, we believe that
              every piece tells a story.  
            </p>
            <p>
              Our journey began with a passion for unique 
              and artistic designs, bringing together a community of collectors who 
              share the same love for creativity and innovation.
            </p>
            <p>
              From limited edition
              figures to exclusive collaborations, we strive to offer products that 
              inspire joy and spark imagination. Join us in celebrating the art of 
              collecting and discover the magic behind each creation.
            </p>
            
          </div>
          
       </section>
       <section>
        <div className="max-w-2xl mx-auto text-center my-20">
          <h2 className="text-4xl font-bold text-red-600 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-700 mb-8">
            We would love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.
          </p>
          <form className="flex flex-col items-center gap-4">
            <input type="text" placeholder="Your Name" className="border p-2 rounded w-full max-w-md" />
            <input type="email" placeholder="Your Email" className="border p-2 rounded w-full max-w-md" />
            <textarea placeholder="Your Message" className="border p-2 rounded w-full max-w-md h-32"></textarea>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full font-semibold">Send Message</button>
          </form>
        </div>
       </section>
      </>
  );
}
