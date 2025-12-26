import {Box, Button} from "@mui/material";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, TreeItemLabel } from "@mui/x-tree-view/TreeItem";
import { TreeItemLabelInput } from "@mui/x-tree-view/TreeItemLabelInput";
import { useRichTreeViewApiRef, useTreeItemModel } from "@mui/x-tree-view/hooks";
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const orderPrefixStyle = {
    display: "inline-block",
    minWidth: "3ch",
    marginRight: "1.6em",
    textAlign: "right",
    color: "rgba(0, 0, 0, 0.6)",
};

const ChapterTreeItemLabel = React.forwardRef(function ChapterTreeItemLabel(props, ref) {
    const { sortOrder, children, ...other } = props;
    return (
        <TreeItemLabel ref={ref} {...other}>
            <span
                style={orderPrefixStyle}
            >
                {sortOrder ?? ""}
            </span>
            {children}
        </TreeItemLabel>
    );
});

const ChapterTreeItemLabelInput = React.forwardRef(function ChapterTreeItemLabelInput(props, ref) {
    const { sortOrder, style, ...other } = props;
    return (
        <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span style={orderPrefixStyle}>{sortOrder ?? ""}</span>
            <TreeItemLabelInput
                ref={ref}
                {...other}
                style={{ ...style, flex: 1, minWidth: 0 }}
            />
        </span>
    );
});

function ChapterTreeItem(props) {
    const {
        itemId,
        label,
        slotProps: externalSlotProps = {},
        slots: externalSlots = {},
        onLabelInputFocus,
        ...other
    } = props;
    const item = useTreeItemModel(itemId);
    const sortOrder = item?.sortOrder;
    const handleLabelInputFocus = (event) => {
        externalSlotProps.labelInput?.onFocus?.(event);
        onLabelInputFocus?.(event);
    };

    return (
        <TreeItem
            {...other}
            itemId={itemId}
            label={label}
            slots={{ ...externalSlots, label: ChapterTreeItemLabel, labelInput: ChapterTreeItemLabelInput }}
            slotProps={{
                ...externalSlotProps,
                label: { ...externalSlotProps.label, sortOrder },
                labelInput: { ...externalSlotProps.labelInput, sortOrder, onFocus: handleLabelInputFocus },
            }}
        />
    );
}

function CWManuscriptExplorer() {

    const queryClient = useQueryClient();
    const apiRef = useRichTreeViewApiRef();
    const [pendingEditId, setPendingEditId] = React.useState(null);

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

    const items = chapters.map((chapter) => ({
        id: String(chapter.id),
        label: chapter.name,
        sortOrder: chapter.sortOrder,
    }));

    function parseChapterId(itemId) {
        if (typeof itemId !== "string") {
            return null;
        }
        const numeric = Number(itemId);
        return Number.isFinite(numeric) ? numeric : null;
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
        onSuccess: (createdChapter) => {
            queryClient.invalidateQueries({ queryKey: chaptersQueryKey });
            if (createdChapter?.id != null) {
                setPendingEditId(String(createdChapter.id));
            }
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
        const nextIndex = chapters.length + 1;
        const newChapter = { name: `chapter-${nextIndex}` };
        createChapterMutation.mutate(newChapter);
    }

    function handleLabelInputFocus(event) {
        if (event.target && typeof event.target.select === "function") {
            event.target.select();
        }
    }

    React.useEffect(() => {
        if (!pendingEditId) {
            return;
        }
        const exists = chapters.some((chapter) => String(chapter.id) === pendingEditId);
        if (!exists || !apiRef.current) {
            return;
        }
        apiRef.current.setEditedItem(pendingEditId);
        setPendingEditId(null);
    }, [apiRef, chapters, pendingEditId]);

    return (
        <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 1, pb: 0.5 }}>
                <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={handleCreateChapter}
                >
                    + Chapter
                </Button>
            </Box>
            <Box sx={{ px: 0, pb: 1 }}>
                <RichTreeView
                    apiRef={apiRef}
                    items={items}
                    isItemEditable={() => true}
                    onItemLabelChange={handleRenameChapter}
                    slots={{ item: ChapterTreeItem }}
                    slotProps={{ item: { onLabelInputFocus: handleLabelInputFocus } }}
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
        </Box>
    );
}

export default CWManuscriptExplorer
