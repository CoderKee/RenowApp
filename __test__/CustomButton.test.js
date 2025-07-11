import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../Home/components/CustomButton';

describe('CustomButton', () => {
  it('Correct Text', () => {
    const { getByText } = render(
      <CustomButton text="Test" onPress={() => {}} color="blue" />
    );

    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <CustomButton text="Test" onPress={mockPress} color="green" />
    );

    fireEvent.press(getByText('Test'));

    expect(mockPress).toHaveBeenCalledTimes(1);
  });
});