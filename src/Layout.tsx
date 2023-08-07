import { ComponentProps } from "preact";

export default function Layout({ children }: ComponentProps<any>) {
    return <>
        <nav>
            <ul class="flex gap-3">
                <a href="/"><li class="text-gray-700 cursor-pointer switch hover:text-blue-600">主页</li></a>

                <a href="/fileshare"><li class="text-gray-700 cursor-pointer switch hover:text-blue-600">文件共享</li></a>
                <a href="https://tool.nmmm.top"><li class="text-gray-700 cursor-pointer switch hover:text-blue-600">RSA在线加密解密工具</li></a>
            </ul>
        </nav>
        {children}
    </>
}