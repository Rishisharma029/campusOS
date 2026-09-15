import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url?: string;
          'events-target'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          hint?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url?: string;
          'events-target'?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          hint?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

export {};
