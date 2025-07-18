import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterModal from '../Home/components/FilterModal';

// Mock DropDownPicker
jest.mock('react-native-dropdown-picker', () => {
  return ({ setValue, value, items, ...props }) => (
    <select
      testID="type-dropdown"
      value={value || ''}
      onChange={e => setValue(() => e.target.value)}
    >
      {items.map(opt => (
        <option key={opt.label} value={opt.value || ''}>{opt.label}</option>
      ))}
    </select>
  );
});

describe('FilterModal', () => {
  it('renders when visible', () => {
    const { getByTestId } = render(
      <FilterModal visible={true} filters={{}} setFilters={jest.fn()} onClose={jest.fn()} />
    );
    expect(getByTestId('filter-modal')).toBeTruthy();
  });

  it('calls setFilters when apply button is pressed', () => {
    const setFilters = jest.fn();
    const { getByTestId, getByText } = render(
        <FilterModal visible={true} filters={{}} setFilters={setFilters} onClose={jest.fn()} />
    );
    fireEvent(getByTestId('min-price-slider'), 'valueChange', 10);
    fireEvent.press(getByText('Apply'));
    expect(setFilters).toHaveBeenCalled();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <FilterModal visible={true} filters={{}} setFilters={jest.fn()} onClose={onClose} />
    );
    fireEvent.press(getByTestId('cancel-button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('applies correct type and price filters', () => {
    const setFilters = jest.fn();
    const { getByTestId, getByText } = render(
      <FilterModal
        visible={true}
        filters={{ type: null, minPrice: 0, maxPrice: 100000 }}
        setFilters={setFilters}
        onClose={jest.fn()}
      />
    );

    // Change type to "Cleaning"
    getByTestId('type-dropdown').props.onChange({ target: { value: 'Cleaning' } });
    
    // Change min price
    fireEvent(getByTestId('min-price-slider'), 'valueChange', 500);

    // Change max price
    fireEvent(getByTestId('max-price-slider'), 'valueChange', 5000); // max

    fireEvent.press(getByText('Apply'));

    // setFilters should be called with updated values
    expect(setFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Cleaning',
        minPrice: 500,
        maxPrice: 5000,
      })
    );
  });

  it('resets filters when Clear is pressed', () => {
    const setFilters = jest.fn();
    const { getByText } = render(
      <FilterModal
        visible={true}
        filters={{ type: 'Cleaning', minPrice: 100, maxPrice: 5000 }}
        setFilters={setFilters}
        onClose={jest.fn()}
      />
    );

    fireEvent.press(getByText('Clear'));
  });
});