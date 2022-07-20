import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { useGlobal } from 'context/global/GlobalContext';
import { ChangeEvent } from 'react';

type Props = {
  options: string[];
  name: string;
  defaultValue?: string;
  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const RadioButtons = (props: Props) => {
  const { options, defaultValue, onChange, name, className = '' } = props;
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
            className={className}
            key={idx}
            control={<Radio disableRipple={true} disableTouchRipple={true} />}
          />
        );
      })}
    </RadioGroup>
  );
};

export default RadioButtons;
