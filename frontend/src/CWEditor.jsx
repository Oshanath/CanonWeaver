import {Box, Button, Card, CircularProgress, TextField, Typography} from "@mui/material";
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import CWBlockIcons from "./CWBlockIcons.jsx";
import SaveIcon from "@mui/icons-material/Save";

function CWEditor(props) {

    const queryClient = useQueryClient();

    const blocksQueryKey = ["blocks"];
    const {data, isPending} = useQuery({
        queryKey: blocksQueryKey,
        queryFn: getBlocks,
    })
    const addBlockMutation = useMutation({
        mutationFn: addBlock,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: blocksQueryKey});
        }
    })

    const [draftBlocks, setDraftBlocks] = React.useState({});
    const [changedBlocks, setChangedBlocks] = React.useState({});
    const [focusedBlockId, setFocusedBlockId] = React.useState(null);
    const saveButtonRefs = React.useRef({});

    React.useEffect(() => {
        function handleKeyDown(event) {
            if (!focusedBlockId) {
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
                event.preventDefault();
                const saveButton = saveButtonRefs.current[focusedBlockId];
                if (saveButton) {
                    saveButton.click();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [focusedBlockId, changedBlocks]);

    return (
        <Box sx={{ height: "100%", overflowY: "auto", overflowX: "visible", p: 2, pl:0.4, boxSizing: "border-box" }}>
            {isPending ? <CircularProgress /> :
                data.map(block => {
                    const hoverIconsSx = {
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.15s ease",
                        pointerEvents: "none",
                        alignSelf: "center",
                    };

                    if (block.isSaved){
                        return (
                            <Box
                                key={block.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    gap: 1,
                                    mb: 2,
                                    "&:hover .cw-block-icons": { opacity: 1, pointerEvents: "auto" },
                                }}
                                tabIndex={0}
                                onFocus={() => setFocusedBlockId(block.id)}
                                onClick={() => setFocusedBlockId(block.id)}
                            >
                                <Box sx={{ position: "relative", flex: 1, pl: 3.5 }}>
                                    <Box sx={{ position: "absolute", top: 12, left: 0, pointerEvents: "none", opacity: 0 }}>
                                        <SaveIcon fontSize="small" sx={{ color: "error.main" }} />
                                    </Box>
                                    <Card
                                        sx={{
                                            width: "100%",
                                            p: 2,
                                            background: "rgba(0,0,255,0.04)",
                                        }}
                                    >
                                        <Typography variant="body1" component="div">
                                            {block.content}
                                        </Typography>
                                    </Card>
                                </Box>
                                <CWBlockIcons
                                    className="cw-block-icons"
                                    sx={hoverIconsSx}
                                    onSave={() => onSaveBlock(block.id, changedBlocks, draftBlocks, true)}
                                    onLock={() => onLockBlock(block.id)}
                                    onStar={() => onStarBlock(block.id)}
                                    saveButtonRef={node => {
                                        if (node) {
                                            saveButtonRefs.current[block.id] = node;
                                        } else {
                                            delete saveButtonRefs.current[block.id];
                                        }
                                    }}
                                />
                            </Box>
                        )
                    } else {
                        const value = draftBlocks[block.id] ?? block.content ?? "";
                        return (
                            <Box
                                key={block.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    gap: 1,
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ position: "relative", flex: 1, pl: 3.5 }}>
                                    {changedBlocks[block.id] ? (
                                        <Box sx={{ position: "absolute", top: 12, left: 0, pointerEvents: "none" }}>
                                            <SaveIcon fontSize="small" sx={{ color: "error.main" }} />
                                        </Box>
                                    ) : null}
                                    <TextField
                                        value={value}
                                        multiline
                                        fullWidth
                                        minRows={3}
                                        onChange={e => {onBlockChange(block.id, e.target.value)}}
                                        onFocus={() => setFocusedBlockId(block.id)}
                                    />
                                </Box>
                                <CWBlockIcons
                                    className="cw-block-icons"
                                    sx={{
                                        ...hoverIconsSx,
                                        opacity: focusedBlockId === block.id ? 1 : 0,
                                        pointerEvents: focusedBlockId === block.id ? "auto" : "none",
                                    }}
                                    onSave={() => {onSaveBlock(block.id, changedBlocks, draftBlocks, true)}}
                                    onLock={() => onLockBlock(block.id)}
                                    onStar={() => onStarBlock(block.id)}
                                    saveButtonRef={node => {
                                        if (node) {
                                            saveButtonRefs.current[block.id] = node;
                                        } else {
                                            delete saveButtonRefs.current[block.id];
                                        }
                                    }}
                                />
                            </Box>
                        )
                    }
                })
            }
            <Button onClick={addBlockMutation.mutate} variant="contained">+ Block</Button>
        </Box>
    )

    function onBlockChange(blockId, content) {
        let newDraftBlocks = {...draftBlocks};
        newDraftBlocks[blockId] = content;
        setDraftBlocks(newDraftBlocks);

        let newChangedBlocks = {...changedBlocks};
        newChangedBlocks[blockId] = true;
        setChangedBlocks(newChangedBlocks);
    }

    function onSaveBlock(blockId, changedBlocks, draftBlocks, isSaved) {
        let newChangedBlocks = {...changedBlocks};
        newChangedBlocks[blockId] = false;
        setChangedBlocks(newChangedBlocks);

        updateBlock(blockId, draftBlocks[blockId], isSaved);
    }

    function onLockBlock(blockId) {
        console.log("lock block", blockId);
    }

    function onStarBlock(blockId) {
        console.log("star block", blockId);
    }
}

const addBlock = async () => {
    const response = await fetch("/api/blocks", {
        method: "POST"
    });
    return await response.json();
}

const updateBlock = async (blockId, content, isSaved) => {
    const response = await fetch(`/api/blocks/${blockId}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            id: blockId,
            content: content ?? "",
            isSaved: false
        }),
    });
    return await response.json();
}

const getBlocks = async () => {
    const response = await fetch("/api/blocks")
    return await response.json()
}

export default CWEditor;
