import {Box, IconButton} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import React from "react";

function CWBlockIcons({sx, className, onSave, onLock, onStar, saveButtonRef}) {
    return (
        <Box className={className} sx={sx}>
            <IconButton size="small" onClick={onSave} ref={saveButtonRef}>
                <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onLock}>
                <LockIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onStar}>
                <StarIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}

export default CWBlockIcons;
