import React, { useEffect } from "react";

type LinkModuleProps = {
  closePage(): void;
  moduleData: any;
};

const LinkModule: React.FC<LinkModuleProps> = ({ closePage, moduleData }) => {
  useEffect(() => {
    window.open(moduleData?.link, "_blank");
    closePage();
  });
  return null;
};

export default LinkModule;
