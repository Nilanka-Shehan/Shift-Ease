import React from 'react';

const Home = () => {
  return (
    <section
      className="w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg_image.jpg')" }}
    >
      <div className="flex items-center justify-center h-full w-full">
        <h1 className="text-[#F5E20C] text-9xl font-i font-bold drop-shadow-lg" style={{ fontFamily: "'Inria Serif', serif" }}>
          HEXANODE
        </h1>
      </div>
    </section>
  );
};

export default Home;
