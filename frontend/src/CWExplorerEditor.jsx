import {Box, Paper} from "@mui/material";
import {Group, Panel, Separator} from "react-resizable-panels";

function CWExplorerEditor() {
    return (
        <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
            <Group style={{ height: "100%" }}   >
                <Panel defaultSize={"20%"} collapsible minSize={5}>
                    <Paper elevation={5} sx={{ height: "100%", p: 1 }}>
                        Explorer
                    </Paper>
                </Panel>

                <Separator
                    style={{
                        width: "6px",
                        cursor: "col-resize",
                        background: "rgba(0,0,255,0.12)",
                    }}
                />

                <Panel>
                    <Paper elevation={5} sx={{ height: "100%", p: 1 }}>
                        Editor
                    </Paper>
                </Panel>
            </Group>
        </Box>
    )
}

export default CWExplorerEditor