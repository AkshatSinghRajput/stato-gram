"use client";

import { useOrganization } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import JoinOrganizationPage from "./PersonalAccount";
import DashboardComponent from "./DashboardPage";

export default function Dashboard({}) {
  const { organization } = useOrganization();
  const [orgId, setOrgId] = useState(organization?.id);

  useEffect(() => {
    setOrgId(organization?.id);
  }, [organization]);

  return <div>{orgId ? <DashboardComponent /> : <JoinOrganizationPage />}</div>;
}
