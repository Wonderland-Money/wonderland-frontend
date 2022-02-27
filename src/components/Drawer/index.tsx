import { Drawer } from "@material-ui/core";
import DrawerContent from "./drawer-content";

function Sidebar(props: any) {
    return (
        <Drawer variant="permanent" anchor="left">
            <DrawerContent socialIsOpen={props.socialIsOpen} />
        </Drawer>
    );
}

export default Sidebar;
