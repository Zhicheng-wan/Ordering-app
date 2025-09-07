import Image from 'next/image';
import RightArrow from '../icons/RightArrow';

export default function Hero() {
  return (
    <section className="hero gap-18">
      <div className="py-30">
        <h1 className="text-8xl font-semibold ">
          Everything
          <br />
          is better <br />
          with a&nbsp;
          <br />
          <span className="text-primary">Labubu</span>
        </h1>
        <p className="my-4 text-gray-500">
          Labubu is the missing piece that makes every day complete, a simple joy in life
        </p>
        <div className="flex gap-4">
          <button className="bg-primary items-center text-sm uppercase flex gap-2 text-white px-4 py-2 rounded-full font-semibold">
            Order Now
            <RightArrow />
          </button>
          <button className="flex gap-2 py-2 text-gray-600 font-semibold">
            Learn More
            <RightArrow />
          </button>
        </div>
      </div>

      <div className="relative w-[750px] h-[750px]">
        <Image src="/LabubuBrown.png" alt="LabubuBrown" fill className="object-contain" priority />
      </div>
    </section>
  );
}
