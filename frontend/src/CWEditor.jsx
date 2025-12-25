import {Box, Button, Card, CircularProgress, TextField, Typography} from "@mui/material";
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import CWBlockIcons from "./CWBlockIcons.jsx";

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
                } else {
                    onSaveBlock(focusedBlockId, changedBlocks);
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [focusedBlockId, changedBlocks]);

    return (
        <Box sx={{ height: "100%", overflowY: "auto", p: 2, boxSizing: "border-box" }}>
            {isPending ? <CircularProgress /> :
                data.map(block => {
                    const hoverIconsSx = {
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        opacity: 0,
                        transition: "opacity 0.15s ease",
                        pointerEvents: "none",
                    };

                    if (block.isSaved){
                        return (
                            <Card
                                key={block.id}
                                sx={{
                                    width: "100%",
                                    p: 2,
                                    pr: 6,
                                    mb: 2,
                                    background: "rgba(0,0,255,0.04)",
                                    position: "relative",
                                    "&:hover .cw-block-icons": { opacity: 1, pointerEvents: "auto" },
                                }}
                                tabIndex={0}
                                onFocus={() => setFocusedBlockId(block.id)}
                                onClick={() => setFocusedBlockId(block.id)}
                            >
                                <Typography variant="body1" component="div">
                                    {block.content}
                                </Typography>
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
                            </Card>
                        )
                    } else {
                        const value = draftBlocks[block.id] ?? block.content ?? "";
                        return (
                            <Box
                                key={block.id}
                                sx={{
                                    position: "relative",
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    value={value}
                                    multiline
                                    fullWidth
                                    minRows={3}
                                    sx={{ pr: 6 }}
                                    onChange={e => {onBlockChange(block.id, e.target.value)}}
                                    onFocus={() => setFocusedBlockId(block.id)}
                                />
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
