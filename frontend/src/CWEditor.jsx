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
    const {data, isPending, isError} = useQuery({
        queryKey: blocksQueryKey,
        queryFn: getBlocks,
    })
    React.useEffect(() => {
        if (!isPending && isError) {
            setErrorAlertMessage("Failed to load blocks");
            setErrorAlertOpen(true);
        }
    }, [isError, isPending])

    const addBlockMutation = useMutation({
        mutationFn: addBlock,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: blocksQueryKey});
        },
        onError: (error) => {
            setErrorAlertMessage(error?.message || "Failed to add block");
            setErrorAlertOpen(true);
        },
    })

    const updateBlock = async (blockId) => {
        console.log("in update block:", blockId, data);
        const response = await fetch(`/api/blocks/${blockId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: blockId,
                content: draftBlocks[blockId] ?? data[blockId].content ?? "",
                isLocked: false
            }),
        });

        if (!response.ok) {
            let error = new Error("Failed to update block");
            error.blockId = blockId;
            throw error;    
        }

        return await response.json();
    }
    const updateBlockMutation = useMutation({
        mutationFn: updateBlock,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: blocksQueryKey});
        },
        onError: (error) => {
            changedBlocks[error.blockId] = true;
            setErrorAlertMessage(error?.message || "Failed to save block");
            setErrorAlertOpen(true);
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

    function onSaveBlock(blockId) {
        let newChangedBlocks = {...changedBlocks};
        newChangedBlocks[blockId] = false;
        setChangedBlocks(newChangedBlocks);

        updateBlockMutation.mutate(blockId);
    }

    function onLockBlock(blockId) {
        console.log("lock block", blockId);
    }

    function onStarBlock(blockId) {
        console.log("star block", blockId);
    }

    const hoverIconsSx = {
        display: "flex",
        flexDirection: "row",
        gap: 1,
        opacity: 0,
        transition: "opacity 0.15s ease",
        pointerEvents: "none",
        alignSelf: "center",
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
                data && Object.keys(data).map(blockId => {

                    const saveIndicator = (
                        <SaveIndicator isVisible={Boolean(changedBlocks[blockId])} />
                    );

                    if (data[blockId].isLocked){
                        return (
                            <Box
                                key={blockId}
                                sx={{
                                    ...rowSx,
                                    "&:hover .cw-block-icons": { opacity: 1, pointerEvents: "auto" },
                                }}
                                tabIndex={0}
                                onFocus={() => setFocusedBlockId(blockId)}
                                onClick={() => setFocusedBlockId(blockId)}
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
                                            {data[blockId].content}
                                        </Typography>
                                    </Card>
                                </Box>
                                <CWBlockIcons
                                    className="cw-block-icons"
                                    sx={hoverIconsSx}
                                    onSave={() => onSaveBlock(blockId)}
                                    onLock={() => onLockBlock(blockId)}
                                    onStar={() => onStarBlock(blockId)}
                                    saveButtonRef={node => {
                                        if (node) {
                                            saveButtonRefs.current[blockId] = node;
                                        } else {
                                            delete saveButtonRefs.current[blockId];
                                        }
                                    }}
                                />
                            </Box>
                        )
                    } else {
                        const value = draftBlocks[blockId] ?? data[blockId].content ?? "";
                        return (
                            <Box
                                key={blockId}
                                sx={rowSx}
                                data-block-id={blockId}
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
                                </Box>
                                <CWBlockIcons
                                    className="cw-block-icons"
                                    sx={{
                                        ...hoverIconsSx,
                                        opacity: focusedBlockId === blockId ? 1 : 0,
                                        pointerEvents: focusedBlockId === blockId ? "auto" : "none",
                                    }}
                                    onSave={() => {onSaveBlock(blockId)}}
                                    onLock={() => onLockBlock(blockId)}
                                    onStar={() => onStarBlock(blockId)}
                                    saveButtonRef={node => {
                                        if (node) {
                                            saveButtonRefs.current[blockId] = node;
                                        } else {
                                            delete saveButtonRefs.current[blockId];
                                        }
                                    }}
                                />
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
