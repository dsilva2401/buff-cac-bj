import React, { useState } from 'react';
import { InputWrapper, NativePicker, InputPlaceholder } from './styles';
import { ReactComponent as Calendar } from 'assets/icons/svg/calendar.svg';

type DatePickerProps = {
  selectedDate: string;
  changeDate(date: string): void;
};

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  changeDate,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  };

  return (
    <InputWrapper
      isFocused={isFocused}
      isDateSelected={selectedDate ? true : false}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <NativePicker
        type='date'
        name='dateofbirth'
        id='dateofbirth'
        isFocused={isFocused}
        min={disablePastDate()}
        isDateSelected={selectedDate ? true : false}
        onChange={({ target: { value } }) => changeDate(value)}
      />
      <InputPlaceholder
        isFocused={isFocused}
        isDateSelected={selectedDate ? true : false}
      >
        {selectedDate ? 'Purchase Date' : 'Select purchase date...'}
      </InputPlaceholder>
      <Calendar />
    </InputWrapper>
  );
};

export default DatePicker;
