import {Box, List, ListItemButton, ListItemIcon, Paper, Tooltip} from "@mui/material";
import React from "react";

function CWSelectorBar() {

    const selectorValues = ["manuscript-explorer", "bios", "manuscript-search", "knowledge-search"]
    const [selected, setSelected] = React.useState(selectorValues[0]);

    function onSelect(item) {
        setSelected(item);
    }

    return (
        <Box
            sx={{
                width: "60px",
                height: "100%",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Paper sx={{ flex: 1, bgcolor: "rgba(0,0,255,0.12)" }}>
                <List disablePadding>
                    {selectorValues.map((v) => (
                        <Tooltip key={v} title={v} placement="auto">
                            <ListItemButton
                                selected={selected === v}
                                onClick={() => onSelect(v)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "rgba(0,0,0,0.12)", // darker
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "rgba(0,0,0,0.18)", // a bit darker on hover
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 44 }}>
                                    <Box
                                        component="img"
                                        src={"/selector-icons/" + v + ".png"}
                                        alt={v}
                                        sx={{ width: 28, height: 28, objectFit: "contain" }}
                                    />
                                </ListItemIcon>
                            </ListItemButton>
                        </Tooltip>
                    ))}
                </List>
            </Paper>
        </Box>
    )
}

export default CWSelectorBar