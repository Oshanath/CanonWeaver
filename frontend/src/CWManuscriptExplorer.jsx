import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import React from "react";

function CWManuscriptExplorer() {

    const [chapters, setChapters] = React.useState([]);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [chapterName, setChapterName] = React.useState("");
    const chapterNameRef = React.useRef(null);

    const items = [
        {
            id: "chapters-root",
            label: "Chapters",
            children: chapters.map((chapter) => ({
                id: `chapter-${chapter.id}`,
                label: chapter.name,
            })),
        },
    ];

    React.useEffect(() => {
        let isMounted = true;
        async function loadChapters() {
            try {
                const response = await fetch("/api/chapters");
                if (!response.ok) {
                    throw new Error(`Failed to load chapters: ${response.status}`);
                }
                const data = await response.json();
                if (isMounted) {
                    setChapters(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadChapters();
        return () => {
            isMounted = false;
        };
    }, []);

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

    async function handleCreateChapter() {
        const nextIndex = chapters.length + 1;
        const fallbackName = `chapter-${nextIndex}`;
        const trimmedName = chapterName.trim();
        const newChapter = { name: trimmedName === "" ? fallbackName : trimmedName };
        try {
            const response = await fetch("/api/chapters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newChapter),
            });
            if (!response.ok) {
                throw new Error(`Failed to create chapter: ${response.status}`);
            }
            const created = await response.json();
            setChapters((prev) => [...prev, created]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
        }
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
