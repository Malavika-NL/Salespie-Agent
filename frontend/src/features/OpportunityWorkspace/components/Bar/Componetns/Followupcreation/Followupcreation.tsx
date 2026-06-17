// src/features/OpportunityWorkspace/components/Bar/Componetns/FollowupCreation/FollowupCreation.tsx

import React from "react";
import FollowupCreationForm from "../Followupcreation/Followupcreationform/Followupcreationform";
import UpcomingFollowups from "./Upcomingfollowups/Upcomingfollowups";

const FollowupCreation: React.FC = () => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "16px",
    width: "100%",
    alignItems: "start",
  }}>
    <FollowupCreationForm />
    <UpcomingFollowups />
  </div>
);

export default FollowupCreation;
