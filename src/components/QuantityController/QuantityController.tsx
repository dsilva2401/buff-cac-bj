import React from 'react';
import Wrapper from 'components/Wrapper';
import { theme } from 'styles/theme';
import { useGlobal } from 'context/global/GlobalContext';
import { ControllerButton, NumberInput } from './styles';
import { ReactComponent as Plus } from 'assets/icons/svg/plus.svg';
import { ReactComponent as Minus } from 'assets/icons/svg/minus.svg';

type QuantityControllerProps = {
  value: string;
  onChange(value: string): void;
  limit?: number;
};

const QuantityController: React.FC<QuantityControllerProps> = ({
  value,
  onChange,
  limit,
}) => {
  const { brandTheme } = useGlobal();
  const changeQuantity = (value: string, operation?: 'sum' | 'subtract') => {
    let currValue: number;

    if (operation) {
      switch (operation) {
        case 'sum':
          currValue = Number(value) + 1;
          onChange(currValue.toString());
          // if (limit && currValue <= limit) {
          //   onChange(currValue.toString());
          // }
          break;
        case 'subtract':
          currValue = Number(value) - 1;
          onChange(currValue.toString());
          // if (currValue >= 1) {
          //   onChange(currValue.toString());
          // }
          break;
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Wrapper gap='0.3rem' justifyContent='flex-start'>
      <ControllerButton
        theme={brandTheme || theme.primary}
        disabled={Number(value) <= 1 ? true : false}
        onClick={() => changeQuantity(value, 'subtract')}
      >
        <Minus />
      </ControllerButton>
      <NumberInput
        type='number'
        value={value}
        onChange={({ target: { value } }) => changeQuantity(value)}
        // disabled={Number(value) === limit || Number(value) <= 0 ? true : false}
        disabled={false}
      />
      <ControllerButton
        theme={brandTheme || theme.primary}
        // disabled={Number(value) === limit || Number(value) <= 0 ? true : false}
        disabled={false}
        onClick={() => changeQuantity(value, 'sum')}
      >
        <Plus />
      </ControllerButton>
    </Wrapper>
  );
};

export default QuantityController;
