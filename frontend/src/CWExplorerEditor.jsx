import {Box, Paper} from "@mui/material";
import {Group, Panel, Separator} from "react-resizable-panels";
import CWManuscriptExplorer from "./CWManuscriptExplorer.jsx";
import CWEditor from "./CWEditor.jsx";

function CWExplorerEditor() {
    return (
        <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
            <Group style={{ height: "100%" }}   >
                <Panel defaultSize={"20%"} collapsible minSize={5}>
                    <Paper elevation={5} sx={{ height: "100%", p: 1 }}>
                        <CWManuscriptExplorer />
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
                        <CWEditor />
                    </Paper>
                </Panel>
            </Group>
        </Box>
    )
}

export default CWExplorerEditor