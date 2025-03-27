import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  useEffect(() => {
    document.title = `${title} | CyberShield Labs`;
  }, [title]);

  return (
    <Helmet>
      <title>{`${title} | CyberShield Labs`}</title>
    </Helmet>
  );
};
