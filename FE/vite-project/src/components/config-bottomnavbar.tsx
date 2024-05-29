import IconBasket from "@/assets/ui/navbar/IconBasket";
import IconCloset from "@/assets/ui/navbar/IconCloset";
import IconHome from "@/assets/ui/navbar/IconHome";
import IconCalendar from "@/assets/ui/navbar/IconCalendar";

const navConfig = [
  {
    title: "home",
    path: "/home",
    Icon: IconHome,
  },
  {
    title: "calendar",
    path: "/calendar",
    Icon: IconCalendar,
  },
  {
    title: "closet",
    path: "/closet",
    Icon: IconCloset,
  },
  {
    title: "basket",
    path: "/basket",
    Icon: IconBasket,
  },
];

export default navConfig;
