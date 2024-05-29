import icon1 from "@/assets/weather/small_weather_icon/1.png";
import icon2 from "@/assets/weather/small_weather_icon/2.png";
import icon3 from "@/assets/weather/small_weather_icon/3.png";
import icon4 from "@/assets/weather/small_weather_icon/4.png";
import icon5 from "@/assets/weather/small_weather_icon/5.png";
import icon6 from "@/assets/weather/small_weather_icon/6.png";
import icon7 from "@/assets/weather/small_weather_icon/7.png";
import icon8 from "@/assets/weather/small_weather_icon/8.png";
// import icon9 from "@/assets/weather/small_weather_icon/9.png";
// import icon10 from "@/assets/weather/small_weather_icon/10.png";
import icon11 from "@/assets/weather/small_weather_icon/11.png";
import icon12 from "@/assets/weather/small_weather_icon/12.png";
import icon13 from "@/assets/weather/small_weather_icon/13.png";
import icon14 from "@/assets/weather/small_weather_icon/14.png";
import icon15 from "@/assets/weather/small_weather_icon/15.png";
import icon16 from "@/assets/weather/small_weather_icon/16.png";
import icon17 from "@/assets/weather/small_weather_icon/17.png";
import icon18 from "@/assets/weather/small_weather_icon/18.png";
import icon19 from "@/assets/weather/small_weather_icon/19.png";
import icon20 from "@/assets/weather/small_weather_icon/20.png";
import icon21 from "@/assets/weather/small_weather_icon/21.png";
import icon22 from "@/assets/weather/small_weather_icon/22.png";
import icon23 from "@/assets/weather/small_weather_icon/23.png";
import icon24 from "@/assets/weather/small_weather_icon/24.png";
import icon25 from "@/assets/weather/small_weather_icon/25.png";
import icon26 from "@/assets/weather/small_weather_icon/26.png";
// import icon27 from "@/assets/weather/small_weather_icon/27.png";
// import icon28 from "@/assets/weather/small_weather_icon/28.png";
import icon29 from "@/assets/weather/small_weather_icon/29.png";
import icon30 from "@/assets/weather/small_weather_icon/30.png";
import icon31 from "@/assets/weather/small_weather_icon/31.png";
import icon32 from "@/assets/weather/small_weather_icon/32.png";

const icons = {
  "1": icon1,
  "2": icon2,
  "3": icon3,
  "4": icon4,
  "5": icon5,
  "6": icon6,
  "7": icon7,
  "8": icon8,
  // "9": icon9,
  // "10": icon10,
  "11": icon11,
  "12": icon12,
  "13": icon13,
  "14": icon14,
  "15": icon15,
  "16": icon16,
  "17": icon17,
  "18": icon18,
  "19": icon19,
  "20": icon20,
  "21": icon21,
  "22": icon22,
  "23": icon23,
  "24": icon24,
  "25": icon25,
  "26": icon26,
  // "27": icon27,
  // "28": icon28,
  "29": icon29,
  "30": icon30,
  "31": icon31,
  "32": icon32,
};

const IconSmallWeather = (id) => {
  const iconPath = icons[id.id.toString()];
  if (!iconPath) {
    return <div>Icon not found</div>;
  }

  return (
    <img
      src={iconPath}
      alt="Weather Icon"
      style={{ width: "1.5rem", height: "1.5rem", marginRight: "5px" }}
    />
  );
};

export default IconSmallWeather;
