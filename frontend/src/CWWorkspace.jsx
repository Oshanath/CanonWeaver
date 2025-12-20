import {Box, List, ListItemButton, ListItemIcon, Paper, Tooltip} from "@mui/material";
import {Group, Panel, Separator} from "react-resizable-panels";
import React from "react";
import CWSelectorBar from "./CWSelectorBar.jsx";
import CWExplorerEditor from "./CWExplorerEditor.jsx";

function CWWorkspace() {

    return (
        <Box sx={{ flex: 1, display: "flex", height: "100%", minHeight: 0 }}>
            <CWSelectorBar />
            <CWExplorerEditor />
        </Box>
    )
}

export default CWWorkspace;