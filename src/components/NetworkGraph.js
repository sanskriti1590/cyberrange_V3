
import React from "react";
import Graph from "react-graph-vis";
import CloseIcon from '@mui/icons-material/Close';
import { Stack, Typography } from "@mui/material";
import './networkGraph.css'

function NetworkGraph({ id, topology, setDiagram, diagram }) {

  const graph = {
    nodes: topology.nodes,
    edges: topology.edges,
  };

  const options = {
    autoResize: true,
    height: '300px',
    width: '100%',
    nodes: {
      shape: 'image',
      size: 15, // Customize the size of the images
    },

    edges: {
      color: "#909398",
      height: '200px',

    },
    label: {
      color: "#ffffff"
    },

    title: {
      color: "#ffffff"
    },


    backgroundColor: '#bbbbbb',
    layout: {
      hierarchical: false,
    },
    physics: {
      enabled: false,
    },

  };


  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },

  };
  if (graph.edges) {


    return (
      <div className="graph-container" style={{ width: '600px', zIndex: 9, marginTop: -132, position: 'absolute', backgroundColor: "white", borderRadius: '8px' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' padding={1}>
          <Typography variant="h2" style={{ color: "#909398" }}>Network Topology</Typography>
          <CloseIcon onClick={() => setDiagram(!diagram)} sx={{ cursor: 'pointer', color: "#909398" }} />
        </Stack>
        <Graph
          graph={graph}
          options={options}
          events={events}
          getNetwork={network => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        />
      </div>

    );
  }
}

export default NetworkGraph;