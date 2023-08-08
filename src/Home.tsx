import homeShow from './home-show.png';

export default function Home({}: { path?: string }) {
  return (
    <main
      class="
    antialiased
    bg-gradient-to-r
    from-pink-300
    via-purple-300
    to-indigo-400
    w-full h-full
    flex flex-col
    "
    >
      <div class="px-4">
        <div
          class="
          flex
          justify-center
          items-center
          bg-white
          mx-auto
          max-w-4xl
          rounded-lg
          my-16
          p-16
          flex-col
        "
        >
          <h1 class="text-3xl text-pink-500 font-medium">
            P2P在线文件传输-无需添加好友即可点对点传输文件
          </h1>
          <img class="shadow" src={homeShow} />
        </div>
      </div>
    </main>
  );
}
