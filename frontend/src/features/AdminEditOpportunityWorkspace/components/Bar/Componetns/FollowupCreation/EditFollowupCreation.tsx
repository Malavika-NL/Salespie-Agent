// // src/features/AdminEditopportunityworkspace/components/Bar/Componetns/FollowupCreation/EditFollowupCreation.tsx
// import React from "react";
// import EditFollowupCreationForm from "./EditFollowupCreationForm/EditFollowupCreationForm";
// import EditUpcomingFollowups    from "./EditUpcomingFollowups/EditUpcomingFollowups";
 
// const EditFollowupCreation: React.FC = () => (
//   <div style={{
//     display: "grid",
//     gridTemplateColumns: "1fr 1.4fr",
//     gap: "16px",
//     width: "100%",
//     alignItems: "start",
//   }}>
//     <EditFollowupCreationForm />
//     <EditUpcomingFollowups />
//   </div>
// );
 
// export default EditFollowupCreation;

import React from "react";
import EditFollowupCreationForm from "./EditFollowupCreationForm/EditFollowupCreationForm";
import EditUpcomingFollowups    from "./EditUpcomingFollowups/EditUpcomingFollowups";

const EditFollowupCreation: React.FC = () => (
  <div style={{
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    gap: "2%",
    padding: "10px 0",
    boxSizing: "border-box",
  }}>
    <div style={{ width: "39%" }}>
      <EditFollowupCreationForm />
    </div>
    <div style={{ flexGrow: 1, width: "59%" }}>
      <EditUpcomingFollowups />
    </div>
  </div>
);

export default EditFollowupCreation;