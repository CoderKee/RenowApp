import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Calendar from '../Home/components/Calendar';

describe('Calendar', () => {
  it('renders calendar', () => {
    const { getByTestId } = render(<Calendar />);
    expect(getByTestId('calendar-component')).toBeTruthy();
  });

  it('correct date is recorded', () => {
    const onDateSelect = jest.fn();
    const availableDates = ['2025-07-15', '2025-07-18', '2025-07-19'];
    const { getByText } = render(
      <Calendar
        availableDates={availableDates}
        onSelectDate={onDateSelect}
      />
    );
    fireEvent.press(getByText('15'));
    expect(onDateSelect).toHaveBeenCalledWith('2025-07-15');
  });
});