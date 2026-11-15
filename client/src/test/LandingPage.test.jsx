import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from '../pages/LandingPage';

describe('Public Landing Page Component Tests', () => {
  it('renders brand heading and core tagline', () => {
    render(<LandingPage onGetStarted={() => {}} onSignIn={() => {}} />);

    expect(screen.getAllByText(/Sweety/i)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/Your daily health, one reading at a time/i)[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Take control of your/i)[0]
    ).toBeInTheDocument();
  });

  it('triggers navigation callbacks on CTA clicks', () => {
    const handleGetStarted = vi.fn();
    const handleSignIn = vi.fn();
    const handleTryDemo = vi.fn();

    render(
      <LandingPage
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
        onTryDemo={handleTryDemo}
      />
    );

    const getStartedBtn = screen.getAllByRole('button', { name: /get started free/i })[0];
    fireEvent.click(getStartedBtn);
    expect(handleGetStarted).toHaveBeenCalledTimes(1);

    const signInBtn = screen.getAllByRole('button', { name: /sign in/i })[0];
    fireEvent.click(signInBtn);
    expect(handleSignIn).toHaveBeenCalledTimes(1);
  });

  it('renders features, how it works, and FAQ accordion', () => {
    render(<LandingPage onGetStarted={() => {}} onSignIn={() => {}} />);

    expect(screen.getByText(/Simple Glucose Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Health Insights/i)).toBeInTheDocument();
    expect(screen.getByText(/How Sweety works/i)).toBeInTheDocument();

    // Toggle FAQ
    const faqQuestion = screen.getByText(/What are the 4 designated daily reading slots\?/i);
    expect(faqQuestion).toBeInTheDocument();
    fireEvent.click(faqQuestion);
    expect(screen.getByText(/four standard clinical mealtime markers/i)).toBeInTheDocument();
  });
});
