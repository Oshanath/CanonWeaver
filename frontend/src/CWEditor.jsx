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
    React.useEffect(() => {
        if (!isPending) {
            data.map((block) => {
                let newBlocksContent = blocksContent;
                newBlocksContent[block.id] = block.content;
                setBlocksContent(newBlocksContent);
            })
        }
    }, [isPending]);
    const [blocksContent, setBlocksContent] = React.useState({});
    const addBlockMutation = useMutation({
        mutationFn: addBlock,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: blocksQueryKey});
        }
    })
    console.log(blocksContent)
    return (
        <Box>
            {isPending ? <CircularProgress /> :
                data.map(block => {
                    if (block.isSaved){
                        return (
                            <Card key={block.id} sx={{ width: '100%', p: 2, m:2, background: "rgba(0,0,255,0.04)" }}>
                                <Typography variant="body1" component="div">
                                    {blocksContent[block.id]}
                                </Typography>
                            </Card>
                        )
                    } else {
                        return (
                            <TextField
                                key={block.id}
                                value={blocksContent[block.id]}
                                multiline
                                fullWidth
                                minRows={3}
                                sx={{ m: 2 }}
                                onChange={e => {onBlockChange(e)}}
                            />
                        )
                    }
                })
            }
            <Button onClick={addBlockMutation.mutate} variant="contained" sx={{m:2}}>+ Block</Button>
        </Box>
    )

    function onBlockChange(blockElement) {
        let newBlocksContent = blocksContent;
        newBlocksContent[blockElement.key] = blockElement.value;
        setBlocksContent(newBlocksContent);
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