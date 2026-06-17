import React from "react";
import worldmapimg from '../../../images/worldmap.png'
import styles from './WorldMap.module.css'

interface Region {
  name: string;
  coordinates: [number, number]; // Enforce tuple type
}

interface Props {
  regions: Region[];
}

const isValidCoordinates = (coordinates: unknown): coordinates is [number, number] =>
  Array.isArray(coordinates) &&
  coordinates.length === 2 &&
  coordinates.every((num) => typeof num === 'number' && Number.isFinite(num));

const WorldMap: React.FC<Props> = ({ regions }) => {
  const safeRegions = Array.isArray(regions)
    ? regions.filter((region) => isValidCoordinates(region.coordinates))
    : [];

  if (Array.isArray(regions) && safeRegions.length !== regions.length) {
    console.error('Some map regions were skipped because their coordinates were invalid.', regions);
  }

  return (
    // <ComposableMap projectionConfig={{ scale: 150 }} style={{ width: "100%", height: "100%" }}>
    //   <Geographies geography={geoUrl}>
    //     {({ geographies }: { geographies: any[] }) =>
    //       geographies.map((geo: any) => (
    //         <Geography
    //           key={geo.rsmKey}
    //           geography={geo}
    //           style={{
    //             default: { fill: "#6694dd", outline: "none" },
    //             hover: { fill: "#F53", outline: "none" },
    //             pressed: { fill: "#E42", outline: "none" },
    //           }}
    //         />
    //       ))
    //     }
    //   </Geographies>
    //   {regions.map(({ name, coordinates }) => {
    //     if (!isValidCoordinates(coordinates)) {
    //       console.error(`Invalid coordinates for region ${name}:`, coordinates);
    //       return null; // Skip invalid markers
    //     }
    //     return (
    //       <Marker key={name} coordinates={coordinates}>
          
    //         <circle r={35} fill="rgba(222, 11, 11, 0.82)" stroke="red" strokeWidth={1} />

           
    //         <circle r={1} fill="#F53" stroke="#fff" strokeWidth={2} />

    
    //         <text
    //           textAnchor="end"
    //           y={-10}
    //           x={-55}
    //           style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px" }}
    //         >
    //           {name}
    //         </text>
    //         <text
    //           textAnchor="middle"
    //           y={-10}
    //           style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: "10px" }}
    //         >
    //           {name}
    //         </text>
    //       </Marker>
    //     );
    //   })}
    // </ComposableMap>
    <>
    <div data-region-count={safeRegions.length}><img src={worldmapimg} alt="worldmapimg"  className={styles.worldmapimg}/></div>
    </>
  );
};

export default WorldMap;
