import React, { useState } from 'react'

import { ForceGraph } from "../../graph/components/forceGraph";
import { Button, Stack } from '@mui/material';




const Ctf = () => {
    const [values, setValue] = useState({ name: 'adf', value: 'N' })
    const [refresh, setRefresh] = useState(false)

    const nodeHoverTooltip = React.useCallback((node) => {
        return `<div>     
          <b>${node.name}</b>
        </div>`;
    }, [values]);

    const initialValue = {
        "nodes": [],
        "links": []

    }

    const changeHandler = () => {


        initialValue.nodes.push(values)
        setRefresh(!refresh)
    }
    return (
        <div>
            <Stack>

                <input name="name" onChange={e => setValue({ ...values, [e.target.name]: e.target.value })} />
                <Button onClick={changeHandler}>Submit</Button>
            </Stack>

            <ForceGraph linksData={initialValue.links} nodesData={initialValue.nodes} nodeHoverTooltip={nodeHoverTooltip} values={refresh} />

        </div>
    )
}

export default Ctf;