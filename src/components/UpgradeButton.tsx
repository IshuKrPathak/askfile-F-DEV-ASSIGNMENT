"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

const UpgradeButton = () => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
  });
  return (
    <Button onClick={() => createStripeSession()} className=" w-full">
      Upgrade Now <ArrowRight className=" h-6 w-6 ml-1.5" />
    </Button>
  );
};

export default UpgradeButton;
