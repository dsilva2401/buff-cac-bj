import useLogEvent from "hooks/useLogEvent";
import React, { useEffect } from "react";

type LinkModuleProps = {
  closePage(): void;
  moduleData: any;
};

const LinkModule: React.FC<LinkModuleProps> = ({ closePage, moduleData }) => {
  const logEvent = useLogEvent();

  useEffect(() => {
    window.open(moduleData?.link, "_blank");
    logEvent({
      type: "EVENT_MODULE",
      name: "LINK_CLICKED",
      data: moduleData,
    });
    closePage();
  });
  return null;
};

export default LinkModule;
