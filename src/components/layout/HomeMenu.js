export default function HomeMenu() {
  const products = [
    {
      title: 'Zsiga Dream Destination 1/8 Action Figure',
      time: 'Jun 19 19:00',
      price: '$89.99',
      image: '/Zsiga.png',
    },
    {
      title: 'Zsiga Pondering Love Figurine by Zsiga',
      time: 'Jun 19 19:00',
      price: '$142.99',
      image: '/Love.png',
    },
    {
      title: 'Minions Bedtime Stories by Bob and Tim Series Figures',
      time: 'Jun 19 19:00',
      price: '$19.99',
      image: '/minions.png',
    },
    {
      title: 'MEGA SPACE MOLLY 400% Pride 2.0',
      time: 'Jun 19 19:00',
      price: '$314.90',
      image: '/molly.png',
    },
  ];

  return (
    <section className="py-2">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-red-600">NEW ARRIVALS</h2>
          <a href="/products" className="text-black underline text-sm">
            More &gt;
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col text-center p-4 rounded-lg h-[420px]">
              {/* Image */}
              <div className="w-full h-[220px] overflow-hidden rounded-md mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Time */}
              <p className="text-sm text-gray-500">{product.time}</p>

              {/* Title and Price section with fixed height */}
              <div className="flex flex-col justify-between min-h-[80px]">
                <h3 className="font-semibold mt-1 text-md px-2 overflow-hidden">{product.title}</h3>
                <p className="text-red-600 text-lg font-bold mt-2">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
