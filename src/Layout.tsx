import { ComponentProps } from "preact";
import { useRouter } from "preact-router";
import { useEffect } from "preact/hooks";

const navBars = [
  {
    name: "主页",
    url: "/",
  },
  {
    name: "P2P在线文件传输",
    url: "/fileshare"
  },
  {
    name: "RSA 在线加密解密工具",
    url: "https://tool.nmmm.top",
  },
  {
    name: "博客",
    url: "https://blog.nmmm.top",
  },
];

export default function Layout({ children }: ComponentProps<any>) {
    const [router] =  useRouter()
  useEffect(() => {
    console.log(router)
    const button = document.querySelector("#menu-button");
    const menu = document.querySelector("#menu");
    button!.addEventListener("click", () => {
      menu!.classList.toggle("hidden");
    });
  }, []);
  return (
    <>
      <header>
        <nav
          class="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg text-gray-700
          bg-white
        "
        >
          <div>
            <a href="/">nmmm.top</a>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="menu-button"
            class="h-6 w-6 cursor-pointer md:hidden block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>

          <div
            class="hidden w-full md:flex md:items-center md:w-auto"
            id="menu"
          >
            <ul
              class="
              pt-4
              text-base text-gray-700
              md:flex
              md:justify-between 
              md:pt-0"
            >
              {navBars.map((item, index) => (
                <li key={index}>
                  <a class={`switch md:p-4 py-2 block hover:text-purple-400 ${item.url === router!.url && 'text-purple-500'}`} href={item.url}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
