import { render, fireEvent } from '@testing-library/react-native';
import ReviewModal from '../Home/components/ReviewModal';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../Home/globalContext/UserContext', () => ({
  useUser: () => ({ username: 'testuser' }),
}));

jest.mock('../Home/components/ReviewInput', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return ({ value, setValue, placeholder }) => (
    <TextInput
      testID="review-input"
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      multiline
    />
  );
});

jest.mock('../server/supabase.js', () => {
  const eq = jest.fn().mockReturnThis();
  const update = jest.fn(() => ({ eq }));
  const insert = jest.fn(() => ({ error: null }));
  const from = jest.fn(() => ({ insert, update, eq }));
  return { supabase: { from } };
});

describe('ReviewModal', () => {
  const item = {
    listing_id: '123',
    accepted_by: 'acceptedUser',
  };
  const posterUsername = 'posterUser';
  const onCloseMock = jest.fn();
  const onReviewWrittenMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and shows correct target username', () => {
    const { getByText } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );
    expect(getByText('Writing a review for posterUser')).toBeTruthy();
  });

  it('star buttons update rating state and enable submit button', () => {
    const { getAllByTestId, getByTestId } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );

    const stars = getAllByTestId('star-button');
    fireEvent.press(stars[2]);

    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState?.disabled).toBe(false);
  });

  it('submit button is disabled when no rating is selected', () => {
    const { getByTestId } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );
    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('calls onClose and resets rating/review on cancel', () => {
    const { getByTestId, getAllByTestId } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );

    const stars = getAllByTestId('star-button');
    fireEvent.press(stars[4]);

    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState?.disabled).toBe(true);
  });

  it('calls onReviewWritten when review is submitted', async () => {
    const { getAllByTestId, getByTestId } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );

    const stars = getAllByTestId('star-button');
    fireEvent.press(stars[3]); 

    const input = getByTestId('review-input');
    fireEvent.changeText(input, 'Great experience!');

    const submitButton = getByTestId('submit-button');
    await fireEvent.press(submitButton);

    expect(onReviewWrittenMock).toHaveBeenCalledTimes(1);
  });
});


