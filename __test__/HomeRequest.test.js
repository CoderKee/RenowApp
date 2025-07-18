import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeRequest from '../Home/homeTabs/HomeRequest';

jest.mock('../server/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  }
}));

const renderWithNavigation = (ui) =>
  render(<NavigationContainer>{ui}</NavigationContainer>);

describe('HomeRequest', () => {
  it('renders search input and filter button', () => {
    const { getByPlaceholderText, getByTestId } = renderWithNavigation(<HomeRequest />);
    expect(getByPlaceholderText('Search listings...')).toBeTruthy();
    expect(getByTestId('filterButton')).toBeTruthy();
  });

  it('shows no listings message when items is empty', async () => {
    const { getByText } = renderWithNavigation(<HomeRequest />);
    await waitFor(() => {
      expect(getByText(/No Listing matches your search/i)).toBeTruthy();
    });
  });

  it('clears search text when clear button is pressed', async () => {
    const { getByPlaceholderText, getByTestId, queryByDisplayValue } = renderWithNavigation(<HomeRequest />);
    const input = getByPlaceholderText('Search listings...');
    fireEvent.changeText(input, 'test');
    expect(queryByDisplayValue('test')).toBeTruthy();
    const clearBtn = getByTestId('clearSearchButton');
    fireEvent.press(clearBtn);
    expect(queryByDisplayValue('test')).toBeNull();
  });
});