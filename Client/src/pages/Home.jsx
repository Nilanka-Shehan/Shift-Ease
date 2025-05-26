import React from "react";

const Home = () => {
  return (
    <section className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-[#E30B5D]">
      {/* Video Background with custom border, full screen */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0 pointer-events-none">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 300 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ left: 0, top: 0 }}
        >
          <polygon
            points="2,2 298,2 298,198 150,248 2,198"
            stroke="#000"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        <video
          className="absolute w-full h-full object-cover rounded-none"
          src="/bg_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 95%, 50% 100%, 0% 95%)",
          }}
        />
      </div>
      {/* Overlay Content */}
      <div className="flex flex-col items-center justify-center h-full w-full relative z-10">
        <h1
          className="text-[#F5E20C] text-9xl font-i font-bold drop-shadow-lg"
          style={{ fontFamily: "'Inria Serif', serif" }}
        >
          Shift Ease
        </h1>
        <p className="mt-4 text-white text-xl md:text-2xl font-medium drop-shadow-sm">
          Smarter Scheduling, Less Stress.
        </p>
      </div>
      {/* Optional: Overlay for darkening video */}
      {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-5"></div> */}
    </section>
  );
};

export default Home;
