import SectionHeaders from '@/components/layout/SectionHeaders';

export default function About() {
  return (
    <section className="text-center my-50">
      <SectionHeaders title="Our Story" subtitle="About Us" />
      <div className="max-w-2xl flex flex-col items-center mx-auto gap-4">
        <p>
          Welcome to our world of collectibles! At POP MART, we believe that every piece tells a
          story.
        </p>
        <p>
          Our journey began with a passion for unique and artistic designs, bringing together a
          community of collectors who share the same love for creativity and innovation.
        </p>
        <p>
          From limited edition figures to exclusive collaborations, we strive to offer products that
          inspire joy and spark imagination. Join us in celebrating the art of collecting and
          discover the magic behind each creation.
        </p>
      </div>
    </section>
  );
}
