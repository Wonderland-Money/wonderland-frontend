import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";
import DrawerContent from "./drawer-content";
import { DRAWER_WIDTH } from "../../constants/style";

function NavDrawer() {

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            className="mobile-drawer">
            <h1>To experience Trident, please use a desktop computer</h1>
        </Drawer>
    );
}

export default NavDrawer;
