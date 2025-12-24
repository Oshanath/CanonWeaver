import {Box, Button, Card, CircularProgress, TextField, Typography} from "@mui/material";
import React from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

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

    return (
        <Box sx={{ height: "100%", overflowY: "auto" }}>
            {isPending ? <CircularProgress /> :
                data.map(block => {
                    if (block.isSaved){
                        return (
                            <Card key={block.id} sx={{ width: '100%', p: 2, m:2, background: "rgba(0,0,255,0.04)" }}>
                                <Typography variant="body1" component="div">
                                    {block.content}
                                </Typography>
                            </Card>
                        )
                    } else {
                        const value = draftBlocks[block.id] ?? block.content ?? "";
                        return (
                            <TextField
                                key={block.id}
                                value={value}
                                multiline
                                fullWidth
                                minRows={3}
                                sx={{ m: 2 }}
                                onChange={e => {onBlockChange(block.id, e.target.value)}}
                            />
                        )
                    }
                })
            }
            <Button onClick={addBlockMutation.mutate} variant="contained" sx={{m:2}}>+ Block</Button>
        </Box>
    )

    function onBlockChange(blockId, content) {
        let newDraftBlocks = {...draftBlocks};
        newDraftBlocks[blockId] = content;
        setDraftBlocks(newDraftBlocks);
    }
}

const addBlock = async () => {
    const response = await fetch("/api/blocks", {
        method: "POST"
    });
    return await response.json();
}

const getBlocks = async () => {
    const response = await fetch("/api/blocks")
    return await response.json()
}

export default CWEditor;
