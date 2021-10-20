import { Drawer } from "@material-ui/core";
import DrawerContent from "./drawer-content";

function Sidebar() {
    return (
        <Drawer variant="permanent" anchor="left">
            <DrawerContent />
        </Drawer>
    );
}

export default Sidebar;
