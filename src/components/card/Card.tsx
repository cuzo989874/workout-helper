import React from 'react';

interface ICardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<ICardProps> = ({ className, children }) => {
  return <div className={`card ${className ?? ''}`}>{children}</div>;
};

interface ICardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<ICardHeaderProps> = ({
  className,
  children,
}) => {
  return <div className={`card__header ${className ?? ''}`}>{children}</div>;
};

interface ICardBodyProps {
  className?: string;
  children: React.ReactNode;
}

export const CardBody: React.FC<ICardBodyProps> = ({ className, children }) => {
  return <div className={`card__body ${className ?? ''}`}>{children}</div>;
};
