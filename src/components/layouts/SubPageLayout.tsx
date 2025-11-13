import SubPageHeader from './SubPageHeader';

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubPageHeader />
      <main className="main main--sm pt-md px-lg">{children}</main>
    </>
  );
}
