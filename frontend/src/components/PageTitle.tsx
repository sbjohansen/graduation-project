import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  useEffect(() => {
    document.title = `${title} | SecureShield Solutions`;
  }, [title]);

  return (
    <Helmet>
      <title>{`${title} | SecureShield Solutions`}</title>
    </Helmet>
  );
};
