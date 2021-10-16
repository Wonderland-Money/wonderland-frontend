import { ReactComponent as DocsIcon } from "../../../assets/icons/stake.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Docs",
    url: "https://wonderland.gitbook.io/wonderland/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
];

export default externalUrls;
