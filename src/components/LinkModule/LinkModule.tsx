import React, { useEffect } from "react";
import logEvent from "utils/eventLogger";

type LinkModuleProps = {
  closePage(): void;
  moduleData: any;
};

const LinkModule: React.FC<LinkModuleProps> = ({ closePage, moduleData }) => {
  useEffect(() => {
    window.open(moduleData?.link, "_blank");
    logEvent({
      eventType: "EVENT_MODULE",
      event: "LINK_CLICKED",
      data: moduleData,
    });
    closePage();
  });
  return null;
};

export default LinkModule;
