import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

function CWManuscriptExplorer() {

    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [chapterName, setChapterName] = React.useState("");
    const chapterNameRef = React.useRef(null);

    const chaptersQueryKey = ["chapters"];
    const getChapters = async () => {
        const response = await fetch("/api/chapters");
        if (!response.ok) {
            throw new Error(`Failed to load chapters: ${response.status}`);
        }
        return await response.json();
    };
    const { data: chapters = [] } = useQuery({
        queryKey: chaptersQueryKey,
        queryFn: getChapters,
    });

    const items = [
        {
            id: "chapters-root",
            label: "Chapters",
            children: chapters.map((chapter) => ({
                id: String(chapter.id),
                label: chapter.name,
            })),
        },
    ];

    function parseChapterId(itemId) {
        if (typeof itemId !== "string" || itemId === "chapters-root") {
            return null;
        }
        const numeric = Number(itemId);
        return Number.isFinite(numeric) ? numeric : null;
    }

    function handleDialogEntered() {
        if (chapterNameRef.current) {
            chapterNameRef.current.focus();
        }
    }

    function openAddChapterDialog() {
        setChapterName("");
        setIsDialogOpen(true);
    }

    function closeAddChapterDialog() {
        setIsDialogOpen(false);
    }

    const createChapter = async (chapter) => {
        const response = await fetch("/api/chapters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chapter),
        });
        if (!response.ok) {
            throw new Error(`Failed to create chapter: ${response.status}`);
        }
        return await response.json();
    };
    const createChapterMutation = useMutation({
        mutationFn: createChapter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chaptersQueryKey });
            setIsDialogOpen(false);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const renameChapter = async ({ id, name }) => {
        const response = await fetch(`/api/chapters/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            throw new Error(`Failed to rename chapter: ${response.status}`);
        }
        return await response.json();
    };
    const renameChapterMutation = useMutation({
        mutationFn: renameChapter,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chaptersQueryKey });
        },
        onError: (error) => {
            console.error(error);
        },
    });

    function handleRenameChapter(itemId, newLabel) {
        const chapterId = parseChapterId(itemId);
        if (chapterId == null) {
            return;
        }
        const trimmedLabel = newLabel.trim();
        const currentChapter = chapters.find((chapter) => chapter.id === chapterId);
        if (!currentChapter || trimmedLabel === "" || trimmedLabel === currentChapter.name) {
            return;
        }
        renameChapterMutation.mutate({ id: chapterId, name: trimmedLabel });
    }

    function handleCreateChapter() {
        const trimmedName = chapterName.trim();
        const nextIndex = chapters.length + 1;
        const fallbackName = `chapter-${nextIndex}`;
        const newChapter = { name: trimmedName === "" ? fallbackName : trimmedName };
        createChapterMutation.mutate(newChapter);
    }

    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 1, pb: 0.5 }}>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={openAddChapterDialog}
                >
                    + Chapter
                </Button>
            </Box>
            <Box sx={{ px: 1, pb: 1 }}>
                <RichTreeView
                    items={items}
                    isItemEditable={(item) => item.id !== "chapters-root"}
                    onItemLabelChange={handleRenameChapter}
                    sx={{
                        "& .MuiTreeItem-content": {
                            minWidth: 0,
                        },
                        "& .MuiTreeItem-label": {
                            whiteSpace: "nowrap",
                            overflow: "visible",
                            textOverflow: "clip",
                        },
                    }}
                />
            </Box>
            <Dialog
                open={isDialogOpen}
                onClose={closeAddChapterDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { width: 520 } }}
                TransitionProps={{ onEntered: handleDialogEntered }}
            >
                <DialogTitle>New Chapter</DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Chapter name"
                        fullWidth
                        value={chapterName}
                        inputRef={chapterNameRef}
                        onChange={(event) => setChapterName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddChapterDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateChapter}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CWManuscriptExplorer
