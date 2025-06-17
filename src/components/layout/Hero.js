import Image from 'next/image';

export default function Hero() {
    return (
        <section className="grid grid-cols-2">
            <div> 
                <h1 className="text-8xl font-semibold">
                    Everything is better with a Labubu
                </h1>
                <p className="my-4 text-gray-500">
                    Labubu is the missing piece that makes every day complete, a simple joy in life
                </p>
                <div className="flex gap-4">
                    <button className="bg-primary text-white px-8 py-2 rounded-full">    Order Now   </button>
                    <button>    Learn More  </button>
                </div>

            </div>
           
            <div className='relative'>
                <Image src={'/LabubuBrown.webp'} alt={'LabubuBrown'} layout={'fill'} objectFit={'con'}/>
            </div>
            
        </section>
    );
}