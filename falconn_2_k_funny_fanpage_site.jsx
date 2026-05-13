export default function Falconn2KSite() {
  const memes = [
    {
      title: "Legendary Bakış",
      desc: "Bu fotoğrafı gören bir daha normal bakamıyor.",
      img: "https://placehold.co/600x400?text=Falconn2K+1",
    },
    {
      title: "Gece 3 Moodu",
      desc: "Tam uyuyacakken gelen saçma fikir.",
      img: "https://placehold.co/600x400?text=Falconn2K+2",
    },
    {
      title: "Boss Fight",
      desc: "Mahallede son level enerji.",
      img: "https://placehold.co/600x400?text=Falconn2K+3",
    },
    {
      title: "Wifi Kesilince",
      desc: "İnsanlığın en karanlık anı.",
      img: "https://placehold.co/600x400?text=Falconn2K+4",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
          FALCONN2K
        </h1>

        <p className="mt-6 max-w-2xl text-zinc-300 text-lg md:text-2xl">
          İnternet tarihinin en gereksiz ama en efsane fan sitesi.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <button className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 transition font-bold shadow-2xl">
            Efsaneyi İzle
          </button>

          <button className="px-6 py-3 rounded-2xl border border-zinc-700 hover:bg-zinc-900 transition font-bold">
            Random Buton
          </button>
        </div>
      </section>

      {/* Fake Stats */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto pb-20">
        <div className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          <h2 className="text-4xl font-black text-cyan-400">999+</h2>
          <p className="text-zinc-400 mt-2">Absürt Şaka</p>
        </div>

        <div className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          <h2 className="text-4xl font-black text-purple-400">0</h2>
          <p className="text-zinc-400 mt-2">Ciddiyet Seviyesi</p>
        </div>

        <div className="bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800 shadow-2xl">
          <h2 className="text-4xl font-black text-pink-400">∞</h2>
          <p className="text-zinc-400 mt-2">Boş Muhabbet Gücü</p>
        </div>
      </section>

      {/* Meme Gallery */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <h2 className="text-4xl font-black">Falconn2K Arşivi</h2>

          <input
            placeholder="Meme ara..."
            className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-purple-500 w-full md:w-72"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {memes.map((meme, i) => (
            <div
              key={i}
              className="group bg-zinc-900/80 border border-zinc-800 rounded-3xl overflow-hidden hover:scale-105 transition duration-300 shadow-2xl"
            >
              <div className="overflow-hidden">
                <img
                  src={meme.img}
                  alt={meme.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-5">
                <h3 className="text-2xl font-bold">{meme.title}</h3>
                <p className="text-zinc-400 mt-2">{meme.desc}</p>

                <button className="mt-5 w-full bg-gradient-to-r from-purple-600 to-cyan-500 py-3 rounded-2xl font-bold hover:opacity-90 transition">
                  Fotoğrafa Bak
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-zinc-800 rounded-[40px] p-10 text-center backdrop-blur-xl shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black leading-tight">
            “Hayat kısa, internet daha kısa.”
          </h2>

          <p className="mt-6 text-zinc-400 text-lg">
            — Muhtemelen Falconn2K
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 px-6 py-10 text-center text-zinc-500">
        <p>
          © 2026 Falconn2K Fan Club • Tamamen makaraya yapılmıştır.
        </p>
      </footer>
    </div>
  );
}
