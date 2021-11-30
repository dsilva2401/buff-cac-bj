import React, { useState } from "react";
import Wrapper from "components/Wrapper";
import DatePicker from "components/DatePicker";
import { Modal } from "./styles";
import Text from "components/Text";
import Button from "components/Button";
import UploadInput from "components/UploadInput";
import { useTranslation } from "react-i18next"

type DetailsModalProps = {
  isOpen: boolean;
  close(): void;
  confirmWarranty(): void;
};

const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  close,
  confirmWarranty,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.warrantyDrawer.detailsModal",
  });

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
  };

  const changeSelectedFile = (files: FileList) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setSelectedFile(undefined);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <Wrapper
        width="99%"
        height="99%"
        position="relative"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        gap="1rem"
      >
        <Wrapper
          width="90%"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          padding="0 1rem"
          gap="0.1rem"
        >
          <Text fontSize="1.6rem" fontWeight="700" textAlign="center">
            <h2>{t('activateWarrantyHeading')}</h2>
          </Text>
          <Text fontSize="0.8rem" textAlign="center" color="#414149">
            <p>
              {t('description')}
            </p>
          </Text>
        </Wrapper>
        <Wrapper
          width="100%"
          direction="column"
          justifyContent="center"
          margin="0 0 1rem"
          gap="1rem"
        >
          <DatePicker
            selectedDate={selectedDate}
            changeDate={changeSelectedDate}
          />
          <UploadInput
            selectedFile={selectedFile}
            changeFile={changeSelectedFile}
          />
        </Wrapper>
        <Wrapper width="100%" direction="column" gap="1rem">
          <Button
            theme="dark"
            disabled={!selectedDate || !selectedFile}
            onClick={confirmWarranty}
          >
            {t('activateButton')}
          </Button>
          <Button theme="light" onClick={close}>
          {t('cancelButton')}
          </Button>
        </Wrapper>
      </Wrapper>
    </Modal>
  );
};

export default DetailsModal;
