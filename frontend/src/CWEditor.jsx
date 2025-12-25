import {Alert, Box, Button, Card, CircularProgress, Snackbar, TextField, Typography} from "@mui/material";
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import CWBlockIcons from "./CWBlockIcons.jsx";
import SaveIcon from "@mui/icons-material/Save";

function SaveIndicator({isVisible}) {
    return (
        <Box
            sx={{
                width: 24,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                pt: 1.5,
                flexShrink: 0,
                opacity: isVisible ? 1 : 0,
            }}
        >
            <SaveIcon fontSize="small" sx={{ color: "error.main" }} />
        </Box>
    );
}

function CWEditor(props) {

    const queryClient = useQueryClient();

    const [draftBlocks, setDraftBlocks] = React.useState({});
    const [changedBlocks, setChangedBlocks] = React.useState({});
    const [errorAlertOpen, setErrorAlertOpen] = React.useState(false);
    const [errorAlertMessage, setErrorAlertMessage] = React.useState("");
    const [focusedBlockId, setFocusedBlockId] = React.useState(null);
    const saveButtonRefs = React.useRef({});

const addBlock = async () => {
    const response = await fetch("/api/blocks", {
        method: "POST"
    });
    if (!response.ok) {
        throw new Error("Failed to add block");
    }
    return await response.json();
}

const getBlocks = async () => {
    const response = await fetch("/api/blocks")
    if (!response.ok) {
        throw new Error("Failed to load blocks");
    }
    const body = await response.json()
    return body;
}

    const blocksQueryKey = ["blocks"];
    const {data, isPending, isError, error} = useQuery({
        queryKey: blocksQueryKey,
        queryFn: getBlocks,
    })
    React.useEffect(() => {
        if (!isPending && isError) {
            setErrorAlertMessage("Failed to load blocks");
            setErrorAlertOpen(true);
            throw error;
        }
    }, [isError, isPending])

    const addBlockMutation = useMutation({
        mutationFn: addBlock,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: blocksQueryKey});
        },
        onError: (error) => {
            setErrorAlertMessage("Failed to add block");
            setErrorAlertOpen(true);
            throw error;
        },
    })

    const updateBlock = async (block) => {
        const response = await fetch(`/api/blocks/${block.id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: block.id,
                content: draftBlocks[block.id] ?? block.content ?? "",
                isLocked: false
            }),
        });

        if (!response.ok) {
            let error = new Error("Failed to update block");
            error.blockId = block.id;
            throw error;    
        }

        return await response.json();
    }
    const updateBlockMutation = useMutation({
        mutationFn: updateBlock,
        onSuccess: (block) => {
            queryClient.invalidateQueries({queryKey: blocksQueryKey});

            let newChangedBlocks = {...changedBlocks};
            newChangedBlocks[block.id] = false;
            setChangedBlocks(newChangedBlocks);
        },
        onError: (error) => {
            setErrorAlertMessage("Failed to save block");
            setErrorAlertOpen(true);
            throw error;
        }
    })

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
    }, [focusedBlockId]);

    function onBlockChange(blockId, content) {
        let newDraftBlocks = {...draftBlocks};
        newDraftBlocks[blockId] = content;
        setDraftBlocks(newDraftBlocks);

        let newChangedBlocks = {...changedBlocks};
        newChangedBlocks[blockId] = true;
        setChangedBlocks(newChangedBlocks);
    }

    function onLockBlock(blockId) {
        console.log("lock block", blockId);
    }

    function onStarBlock(blockId) {
        console.log("star block", blockId);
    }

    function onDeleteBlock(blockId) {
        console.log("delete block", blockId);
    }

    const iconRowBaseSx = {
        display: "flex",
        flexDirection: "row",
        gap: 1,
        justifyContent: "flex-start",
        alignSelf: "stretch",
        overflow: "hidden",
        transition: "opacity 0.15s ease, max-height 0.2s ease, margin-top 0.2s ease",
    };
    const iconRowVisibleSx = {
        opacity: 1,
        pointerEvents: "auto",
        maxHeight: 40,
        mt: 1,
    };
    const iconRowHiddenSx = {
        opacity: 0,
        pointerEvents: "none",
        maxHeight: 0,
        mt: 0,
    };
    const rowSx = {
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        mb: 2,
    };
    const contentSx = {
        flex: 1,
        minWidth: 0,
    };

    return (
        <Box sx={{ height: "100%", overflowY: "auto", overflowX: "visible", p: 2, pl:0.4, boxSizing: "border-box" }}>
            {isPending ? <CircularProgress /> :
                data && data.map(block => {

                    const blockId = block.id;

                    const saveIndicator = (
                        <SaveIndicator isVisible={Boolean(changedBlocks[blockId])} />
                    );

                    const isBlockFocused = focusedBlockId === blockId;

                    if (block.isLocked){
                        return (
                            <Box
                                key={blockId}
                                sx={{
                                    ...rowSx,
                                }}
                                onMouseEnter={() => setFocusedBlockId(blockId)}
                                onMouseLeave={() => setFocusedBlockId(null)}
                            >
                                {saveIndicator}
                                <Box sx={contentSx}>
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
                                    <CWBlockIcons
                                        className="cw-block-icons"
                                        sx={{
                                            ...iconRowBaseSx,
                                            ...(isBlockFocused ? iconRowVisibleSx : iconRowHiddenSx),
                                        }}
                                        onSave={() => updateBlockMutation.mutate(block)}
                                        onLock={() => onLockBlock(blockId)}
                                        onStar={() => onStarBlock(blockId)}
                                        onDelete={() => onDeleteBlock(blockId)}
                                        saveButtonRef={node => {
                                            if (node) {
                                                saveButtonRefs.current[blockId] = node;
                                            } else {
                                                delete saveButtonRefs.current[blockId];
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        )
                    } else {
                        const value = draftBlocks[blockId] ?? block.content ?? "";
                        return (
                            <Box
                                key={blockId}
                                sx={rowSx}
                                data-block-id={blockId}
                                tabIndex={-1}
                                onFocus={() => setFocusedBlockId(blockId)}
                                onMouseDown={(event) => {
                                    event.currentTarget.focus();
                                }}
                                onBlur={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) {
                                        setFocusedBlockId(null);
                                    }
                                }}
                            >
                                {saveIndicator}
                                <Box sx={contentSx}>
                                    <TextField
                                        value={value}
                                        multiline
                                        fullWidth
                                        minRows={3}
                                        onChange={e => {onBlockChange(blockId, e.target.value)}}
                                        onFocus={() => setFocusedBlockId(blockId)}
                                    />
                                    <CWBlockIcons
                                        className="cw-block-icons"
                                        sx={{
                                            ...iconRowBaseSx,
                                            ...(isBlockFocused ? iconRowVisibleSx : iconRowHiddenSx),
                                        }}
                                        onSave={() => updateBlockMutation.mutate(block)}
                                        onLock={() => onLockBlock(blockId)}
                                        onStar={() => onStarBlock(blockId)}
                                        onDelete={() => onDeleteBlock(blockId)}
                                        saveButtonRef={node => {
                                            if (node) {
                                                saveButtonRefs.current[blockId] = node;
                                            } else {
                                                delete saveButtonRefs.current[blockId];
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        )
                    }
                })
            }
            <Button onClick={addBlockMutation.mutate} variant="contained" sx={{ ml: 4.5, mt: 3 }}>
                + Block
            </Button>
            <Snackbar
                open={errorAlertOpen}
                autoHideDuration={4000}
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    setErrorAlertOpen(false);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setErrorAlertOpen(false)}
                    severity="error"
                    variant="filled"
                >
                    {errorAlertMessage || "Failed to save block"}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default CWEditor;
