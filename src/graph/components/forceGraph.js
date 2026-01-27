import React from "react";
import { runForceGraph } from "./forceGraphGenerator";
import styles from "./forceGraph.module.css";

export function ForceGraph({ linksData, nodesData, nodeHoverTooltip ,values}) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    let destroyFn;
    if (containerRef.current) {
      const { destroy } = runForceGraph(containerRef.current, linksData, nodesData, nodeHoverTooltip,values);
      destroyFn = destroy;
    }

    return destroyFn;
  }, [values,nodesData]);

  return (
  
  <div>
    <div ref={containerRef} className={styles.container} />
  </div>
  )

}
