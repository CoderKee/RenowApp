
import { render, fireEvent } from '@testing-library/react-native';
import ReviewModal from '../path/to/ReviewModal';


jest.mock('../globalContext/UserContext', () => ({
  useUser: () => ({ username: 'testuser' }),
}));

jest.mock('./ReviewInput', () => {
  return ({ value, setValue }) => (
    <input
      testID="review-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Write your review here..."
    />
  );
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

  it('star buttons update rating state', () => {
    const { getAllByRole, getByTestId } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );

    const stars = getAllByRole('button');
    fireEvent.press(stars[2]);


    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState.disabled).toBe(false);
  });

  it('submit button is disabled when no rating', () => {
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
    expect(submitButton.props.accessibilityState.disabled).toBe(true);
  });

  it('calls onClose and resets rating/review on cancel', () => {
    const { getByText, getByTestId } = render(
      <ReviewModal
        visible={true}
        onClose={onCloseMock}
        onReviewWritten={onReviewWrittenMock}
        item={item}
        posterUsername={posterUsername}
      />
    );

    const stars = getAllByRole('button');
    fireEvent.press(stars[4]); 

    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    const submitButton = getByTestId('submit-button');
    expect(submitButton.props.accessibilityState.disabled).toBe(true);
  });
});