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
    const { sortOrder, itemType, children, showSceneButton, onAddScene, ...other } = props;

    const prefix = sortOrder == null
        ? ""
        : itemType === "scene"
            ? `scene-${sortOrder}`
            : `chapter-${sortOrder}`;

    const handleAddSceneClick = (event) => {
        event.stopPropagation();
        onAddScene?.();
    };

    return (
        <TreeItemLabel ref={ref} {...other}>
            <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <span style={orderPrefixStyle}>{prefix}</span>
                <span style={{ minWidth: 0, flex: 1 }}>{children}</span>
                {showSceneButton ? (
                    <Button
                        size="small"
                        variant="text"
                        sx={{ textTransform: "none", ml: 1 }}
                        onClick={handleAddSceneClick}
                    >
                        + Scene
                    </Button>
                ) : null}
            </span>
        </TreeItemLabel>
    );
});

const ChapterTreeItemLabelInput = React.forwardRef(function ChapterTreeItemLabelInput(props, ref) {
    const { sortOrder, itemType, style, ...other } = props;
    const prefix = sortOrder == null
        ? ""
        : itemType === "scene"
            ? `scene-${sortOrder}`
            : `chapter-${sortOrder}`;
    return (
        <span style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span style={orderPrefixStyle}>{prefix}</span>
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
        selectedItemId,
        onAddScene,
        ...other
    } = props;
    const item = useTreeItemModel(itemId);
    const sortOrder = item?.sortOrder;
    const isChapter = item?.type === "chapter";
    const showSceneButton = isChapter && selectedItemId === itemId;
    const handleLabelInputFocus = (event) => {
        externalSlotProps.labelInput?.onFocus?.(event);
        onLabelInputFocus?.(event);
    };
    const handleAddScene = () => {
        if (!item?.chapterId) {
            return;
        }
        onAddScene?.(item.chapterId);
    };

    return (
        <TreeItem
            {...other}
            itemId={itemId}
            label={label}
            slots={{ ...externalSlots, label: ChapterTreeItemLabel, labelInput: ChapterTreeItemLabelInput }}
            slotProps={{
                ...externalSlotProps,
                label: {
                    ...externalSlotProps.label,
                    sortOrder,
                    itemType: item?.type,
                    showSceneButton,
                    onAddScene: handleAddScene,
                },
                labelInput: {
                    ...externalSlotProps.labelInput,
                    sortOrder,
                    itemType: item?.type,
                    onFocus: handleLabelInputFocus,
                },
            }}
        />
    );
}

function CWManuscriptExplorer() {

    const queryClient = useQueryClient();
    const apiRef = useRichTreeViewApiRef();
    const [pendingEditId, setPendingEditId] = React.useState(null);
    const [selectedItemId, setSelectedItemId] = React.useState(null);

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

    const scenesQueryKey = ["scenes"];
    const getScenes = async () => {
        const response = await fetch("/api/scenes");
        if (!response.ok) {
            throw new Error(`Failed to load scenes: ${response.status}`);
        }
        return await response.json();
    };
    const { data: scenes = [] } = useQuery({
        queryKey: scenesQueryKey,
        queryFn: getScenes,
    });

    const scenesByChapter = React.useMemo(() => {
        const map = new Map();
        scenes.forEach((scene) => {
            const entry = map.get(scene.chapterId);
            if (entry) {
                entry.push(scene);
            } else {
                map.set(scene.chapterId, [scene]);
            }
        });
        return map;
    }, [scenes]);

    const chapterItemId = (id) => `chapter-${id}`;
    const sceneItemId = (id) => `scene-${id}`;

    const items = chapters.map((chapter) => ({
        id: chapterItemId(chapter.id),
        label: chapter.name,
        sortOrder: chapter.sortOrder,
        type: "chapter",
        chapterId: chapter.id,
        children: (scenesByChapter.get(chapter.id) ?? []).map((scene) => ({
            id: sceneItemId(scene.id),
            label: scene.name,
            sortOrder: scene.sortOrder,
            type: "scene",
            chapterId: scene.chapterId,
        })),
    }));

    function parseItemId(itemId) {
        if (typeof itemId !== "string") {
            return { type: null, id: null };
        }
        const match = itemId.match(/^(chapter|scene)-(\d+)$/);
        if (!match) {
            return { type: null, id: null };
        }
        return { type: match[1], id: Number(match[2]) };
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
                setPendingEditId(chapterItemId(createdChapter.id));
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

    const createScene = async (scene) => {
        const response = await fetch("/api/scenes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(scene),
        });
        if (!response.ok) {
            throw new Error(`Failed to create scene: ${response.status}`);
        }
        return await response.json();
    };
    const createSceneMutation = useMutation({
        mutationFn: createScene,
        onSuccess: (createdScene) => {
            queryClient.invalidateQueries({ queryKey: scenesQueryKey });
            if (createdScene?.id != null) {
                if (createdScene.chapterId != null) {
                    apiRef.current?.setItemExpansion({
                        itemId: chapterItemId(createdScene.chapterId),
                        shouldBeExpanded: true,
                    });
                }
                setPendingEditId(sceneItemId(createdScene.id));
            }
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const renameScene = async ({ id, name }) => {
        const response = await fetch(`/api/scenes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            throw new Error(`Failed to rename scene: ${response.status}`);
        }
        return await response.json();
    };
    const renameSceneMutation = useMutation({
        mutationFn: renameScene,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scenesQueryKey });
        },
        onError: (error) => {
            console.error(error);
        },
    });

    function handleRenameItem(itemId, newLabel) {
        const { type, id } = parseItemId(itemId);
        if (!type || id == null) {
            return;
        }
        const trimmedLabel = newLabel.trim();
        if (trimmedLabel === "") {
            return;
        }
        if (type === "chapter") {
            const currentChapter = chapters.find((chapter) => chapter.id === id);
            if (!currentChapter || trimmedLabel === currentChapter.name) {
                return;
            }
            renameChapterMutation.mutate({ id, name: trimmedLabel });
        } else if (type === "scene") {
            const currentScene = scenes.find((scene) => scene.id === id);
            if (!currentScene || trimmedLabel === currentScene.name) {
                return;
            }
            renameSceneMutation.mutate({ id, name: trimmedLabel });
        }
    }

    function handleCreateChapter() {
        const nextIndex = chapters.length + 1;
        const newChapter = { name: `chapter-${nextIndex}` };
        createChapterMutation.mutate(newChapter);
    }

    function handleCreateScene(chapterId) {
        const scenesForChapter = scenesByChapter.get(chapterId) ?? [];
        const nextIndex = scenesForChapter.length + 1;
        const newScene = { name: `scene-${nextIndex}`, chapterId };
        createSceneMutation.mutate(newScene);
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
        const existsInChapters = chapters.some((chapter) => chapterItemId(chapter.id) === pendingEditId);
        const existsInScenes = scenes.some((scene) => sceneItemId(scene.id) === pendingEditId);
        const exists = existsInChapters || existsInScenes;
        if (!exists || !apiRef.current) {
            return;
        }
        apiRef.current.setEditedItem(pendingEditId);
        setPendingEditId(null);
    }, [apiRef, chapters, pendingEditId, scenes]);

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
                    onItemLabelChange={handleRenameItem}
                    selectedItems={selectedItemId}
                    onSelectedItemsChange={(event, itemId) => {
                        const nextSelected = Array.isArray(itemId) ? itemId[0] ?? null : itemId;
                        setSelectedItemId(nextSelected ?? null);
                    }}
                    slots={{ item: ChapterTreeItem }}
                    slotProps={{
                        item: {
                            onLabelInputFocus: handleLabelInputFocus,
                            selectedItemId,
                            onAddScene: handleCreateScene,
                        },
                    }}
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
