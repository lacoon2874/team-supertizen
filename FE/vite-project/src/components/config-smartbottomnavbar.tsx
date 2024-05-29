import Star from "@/assets/ui/smartNavbar/Star";
import Device from "@/assets/ui/smartNavbar/Device";
import Automatic from "@/assets/ui/smartNavbar/Automatic";
import Life from "@/assets/ui/smartNavbar/Life";
import Menu from "@/assets/ui/smartNavbar/Menu";

const smartNavConfig = [
  {
    title: "/smart",
    path: "/smarthome",
    Icon: Star,
    name: "즐겨찾기",
  },
  {
    title: "/device",
    path: "/device",
    Icon: Device,
    name: "기기",
  },
  {
    title: "/smarthome",
    path: "/smarthome",
    Icon: Life,
    name: "라이프",
  },
  {
    title: "/automatic",
    path: "/smarthome",
    Icon: Automatic,
    name: "자동화",
  },
  {
    title: "/menu",
    path: "/smarthome",
    Icon: Menu,
    name: "메뉴",
  },
];

export default smartNavConfig;
