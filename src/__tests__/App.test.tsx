import { render } from '@solidjs/testing-library';
import App from '../App';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom'; // 👈 this is imported in order to use the jest-dom matchers
import BlockResults from '../components/BlockResults';

describe('App', () => {
  it('should render the app', () => {
    const { getByText } = render(() => <BlockResults />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});