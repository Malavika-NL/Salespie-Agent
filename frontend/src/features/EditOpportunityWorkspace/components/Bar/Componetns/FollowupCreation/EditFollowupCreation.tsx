import React from "react";
import EditFollowupCreationForm from "./EditFollowupCreationForm/EditFollowupCreationForm";
import EditUpcomingFollowups    from "./EditUpcomingFollowups/Editupcomingfollowups";
 
const EditFollowupCreation: React.FC = () => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "16px",
    width: "100%",
    alignItems: "start",
  }}>
    <EditFollowupCreationForm />
    <EditUpcomingFollowups />
  </div>
);
 
export default EditFollowupCreation;
 