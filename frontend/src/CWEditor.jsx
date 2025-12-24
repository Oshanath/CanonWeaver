import {Box, Button, Card, CircularProgress, TextField, Typography} from "@mui/material";
import React from "react";
import {useQuery} from "@tanstack/react-query";

function CWEditor(props) {

    const para1 = "Riverend was a peaceful town. But peace, like everything else in the world, can prove to be fragile in the face of nature. The townsmen carried pikes and torches in the dead of night, patrolling the dusty roads. One would expect a stampede from the dozens upon dozens of watchmen, but they made not a peep, except for the occasional curse when the wind pulled the flames towards their faces. The wind that flew ever westwards with a ghostly howl, suddenly changing direction for a moment and regaining course in but an instant.  The wind that chilled and stabbed the bones of those walking, making them bring their torches to their own faces uncaring of the risks."
    const para2 = "The dark hooded stranger walking along the shore on the other hand, didn’t make any sound, even when stepping on a puddle made and forgotten the great river. They also didn’t make a sound walking past the sleeping guards at the large gate, and following the path on a gentle slope upwards. The black of night was painted with distant fiery lights, pacing to and fro, often meeting each other to share the light, and never a single one alone."

    const [editableBlock, setEditableBlock] = React.useState(para2)

    function handleEditableBlockOnChange(editableBlock) {
        setEditableBlock(editableBlock.value)
    }

    const {data, isPending} = useQuery({
        queryKey: ["blocks"],
        queryFn: getBlocks,
    })

    return (
        <Box>
            {isPending ? <CircularProgress /> :
                data.map(block => {
                    return (
                        <Card key={block.id} sx={{ width: '100%', p: 2, m:2, background: "rgba(0,0,255,0.04)" }}>
                            <Typography variant="body1" component="div">
                                {block.content}
                            </Typography>
                        </Card>
                    )
                })}
            {/*<TextField*/}
            {/*    value={editableBlock}*/}
            {/*    multiline*/}
            {/*    fullWidth*/}
            {/*    minRows={3}*/}
            {/*    sx={{ m: 2 }}*/}
            {/*    onChange={handleEditableBlockOnChange}*/}
            {/*/>*/}
            <Button variant="contained" sx={{m:2}}>+ Block</Button>
        </Box>
    )
}

const getBlocks = async () => {
    const response = await fetch("/api/blocks")
    return await response.json()
}

export default CWEditor;