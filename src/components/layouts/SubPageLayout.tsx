import SubPageHeader from './SubPageHeader';

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SubPageHeader />
      <main className="p-md">{children}</main>
    </div>
  );
}
