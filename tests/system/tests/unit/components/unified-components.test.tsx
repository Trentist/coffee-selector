/**
 * Unified Components Unit Tests
 * اختبارات وحدة المكونات الموحدة
 */

import React from 'react';
import { render, screen, fireEvent } from '../../helpers/test-utils';
import { UnifiedButton } from '@/components/unified/UnifiedButton';
import { UnifiedInput } from '@/components/unified/UnifiedInput';
import { UnifiedText } from '@/components/unified/UnifiedText';
import { UnifiedBox } from '@/components/unified/UnifiedBox';
import { validateAccessibility } from '../../helpers/test-utils';

describe('Unified Components Tests', () => {
  describe('UnifiedButton Component', () => {
    test('should render button with text', () => {
      render(<UnifiedButton>Test Button</UnifiedButton>);
      
      const button = screen.getByRole('button', { name: /test button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button');
    });

    test('should handle click events', () => {
      const handleClick = jest.fn();
      render(
        <UnifiedButton onClick={handleClick}>
          Clickable Button
        </UnifiedButton>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('should support different variants', () => {
      const { rerender } = render(
        <UnifiedButton variant="solid">Solid Button</UnifiedButton>
      );
      
      let button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      rerender(<UnifiedButton variant="outline">Outline Button</UnifiedButton>);
      button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('should be disabled when disabled prop is true', () => {
      render(
        <UnifiedButton disabled>
          Disabled Button
        </UnifiedButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('should show loading state', () => {
      render(
        <UnifiedButton isLoading loadingText="Loading...">
          Submit
        </UnifiedButton>
      );
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should meet accessibility requirements', () => {
      const { container } = render(
        <UnifiedButton aria-label="Accessible button">
          Button
        </UnifiedButton>
      );
      
      const accessibility = validateAccessibility(container);
      expect(accessibility.isAccessible).toBe(true);
    });
  });

  describe('UnifiedInput Component', () => {
    test('should render input with label', () => {
      render(
        <UnifiedInput 
          label="Test Input" 
          placeholder="Enter text"
        />
      );
      
      const input = screen.getByLabelText(/test input/i);
      const label = screen.getByText('Test Input');
      
      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    test('should handle value changes', () => {
      const handleChange = jest.fn();
      render(
        <UnifiedInput 
          label="Controlled Input"
          value=""
          onChange={handleChange}
        />
      );
      
      const input = screen.getByLabelText(/controlled input/i);
      fireEvent.change(input, { target: { value: 'test value' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('should display error message', () => {
      render(
        <UnifiedInput 
          label="Input with Error"
          error="This field is required"
        />
      );
      
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
    });

    test('should show required indicator', () => {
      render(
        <UnifiedInput 
          label="Required Input"
          isRequired
        />
      );
      
      const input = screen.getByLabelText(/required input/i);
      expect(input).toBeRequired();
    });

    test('should support different input types', () => {
      const { rerender } = render(
        <UnifiedInput 
          label="Email Input"
          type="email"
        />
      );
      
      let input = screen.getByLabelText(/email input/i);
      expect(input).toHaveAttribute('type', 'email');
      
      rerender(
        <UnifiedInput 
          label="Password Input"
          type="password"
        />
      );
      
      input = screen.getByLabelText(/password input/i);
      expect(input).toHaveAttribute('type', 'password');
    });

    test('should meet accessibility requirements', () => {
      const { container } = render(
        <UnifiedInput 
          label="Accessible Input"
          aria-describedby="input-help"
        />
      );
      
      const accessibility = validateAccessibility(container);
      expect(accessibility.isAccessible).toBe(true);
    });
  });

  describe('UnifiedText Component', () => {
    test('should render text with default variant', () => {
      render(<UnifiedText>Default Text</UnifiedText>);
      
      const text = screen.getByText('Default Text');
      expect(text).toBeInTheDocument();
    });

    test('should support different text variants', () => {
      const variants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption'];
      
      variants.forEach(variant => {
        const { unmount } = render(
          <UnifiedText variant={variant as any}>
            {variant} Text
          </UnifiedText>
        );
        
        const text = screen.getByText(`${variant} Text`);
        expect(text).toBeInTheDocument();
        
        unmount();
      });
    });

    test('should apply custom styles', () => {
      render(
        <UnifiedText 
          color="red.500" 
          fontSize="lg"
          fontWeight="bold"
        >
          Styled Text
        </UnifiedText>
      );
      
      const text = screen.getByText('Styled Text');
      expect(text).toBeInTheDocument();
    });

    test('should render as different HTML elements', () => {
      const { rerender } = render(
        <UnifiedText as="h1">Heading Text</UnifiedText>
      );
      
      let element = screen.getByRole('heading', { level: 1 });
      expect(element).toBeInTheDocument();
      
      rerender(
        <UnifiedText as="p">Paragraph Text</UnifiedText>
      );
      
      element = screen.getByText('Paragraph Text');
      expect(element.tagName).toBe('P');
    });
  });

  describe('UnifiedBox Component', () => {
    test('should render box container', () => {
      render(
        <UnifiedBox data-testid="test-box">
          Box Content
        </UnifiedBox>
      );
      
      const box = screen.getByTestId('test-box');
      expect(box).toBeInTheDocument();
      expect(box).toHaveTextContent('Box Content');
    });

    test('should support different variants', () => {
      const variants = ['card', 'container', 'section', 'overlay'];
      
      variants.forEach(variant => {
        const { unmount } = render(
          <UnifiedBox 
            variant={variant as any}
            data-testid={`box-${variant}`}
          >
            {variant} Box
          </UnifiedBox>
        );
        
        const box = screen.getByTestId(`box-${variant}`);
        expect(box).toBeInTheDocument();
        
        unmount();
      });
    });

    test('should apply custom styling props', () => {
      render(
        <UnifiedBox 
          p={4}
          m={2}
          bg="gray.100"
          borderRadius="md"
          data-testid="styled-box"
        >
          Styled Box
        </UnifiedBox>
      );
      
      const box = screen.getByTestId('styled-box');
      expect(box).toBeInTheDocument();
    });

    test('should handle responsive props', () => {
      render(
        <UnifiedBox 
          p={{ base: 2, md: 4, lg: 6 }}
          data-testid="responsive-box"
        >
          Responsive Box
        </UnifiedBox>
      );
      
      const box = screen.getByTestId('responsive-box');
      expect(box).toBeInTheDocument();
    });
  });

  describe('Components Integration', () => {
    test('should work together in a form', () => {
      const handleSubmit = jest.fn();
      
      render(
        <UnifiedBox as="form" onSubmit={handleSubmit}>
          <UnifiedText variant="h2">Test Form</UnifiedText>
          
          <UnifiedInput 
            label="Name"
            placeholder="Enter your name"
            data-testid="name-input"
          />
          
          <UnifiedInput 
            label="Email"
            type="email"
            placeholder="Enter your email"
            data-testid="email-input"
          />
          
          <UnifiedButton type="submit">
            Submit Form
          </UnifiedButton>
        </UnifiedBox>
      );
      
      // Check all components are rendered
      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
      
      // Test form interaction
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);
      
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
    });

    test('should maintain theme consistency', () => {
      const { container } = render(
        <UnifiedBox>
          <UnifiedText>Themed Text</UnifiedText>
          <UnifiedButton>Themed Button</UnifiedButton>
          <UnifiedInput label="Themed Input" />
        </UnifiedBox>
      );
      
      // All components should be rendered without theme conflicts
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Themed Text')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByLabelText(/themed input/i)).toBeInTheDocument();
    });
  });
});