import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

type Props = {
  options: string[];
  name: string;
  defaultValue?: string;
  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
};

const RadioButtons = (props: Props) => {
  const { options, defaultValue, onChange, name } = props;
  return (
    <RadioGroup
      aria-labelledby='demo-controlled-radio-buttons-group'
      name={name}
      value={defaultValue ?? null}
      onChange={(event) => onChange(event.target.value, event)}
    >
      {options.map((value, idx) => {
        return (
          <FormControlLabel
            value={value}
            label={value}
            key={idx}
            control={<Radio disableRipple={true} disableTouchRipple={true} />}
          />
        );
      })}
    </RadioGroup>
  );
};

export default RadioButtons;
