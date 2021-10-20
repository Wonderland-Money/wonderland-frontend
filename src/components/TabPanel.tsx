import Box from "@material-ui/core/Box";

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other} style={{ overflow: "hidden" }}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

export default TabPanel;
