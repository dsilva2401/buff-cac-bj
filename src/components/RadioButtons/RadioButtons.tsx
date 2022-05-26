import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

type Props = {
  options: string[];
  defaultValue?: string;
};

const RadioButtons = (props: Props) => {
  const { options, defaultValue } = props;
  return (
    <RadioGroup
      aria-labelledby='demo-controlled-radio-buttons-group'
      name='controlled-radio-buttons-group'
      value={defaultValue ?? null}
    >
      {options.map((value, idx) => {
        return (
          <FormControlLabel
            value={value}
            label={value}
            key={idx}
            control={<Radio />}
          />
        );
      })}
    </RadioGroup>
  );
};

export default RadioButtons;
