import "styled-components";
import { ColorsType, FontsSizesType, CommonType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsType;
    fontSizes: FontsSizesType;
    common: CommonType;
  }
}
