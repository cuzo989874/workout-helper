import SubPageHeader from './SubPageHeader';

export default function SubPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubPageHeader />
      <main className="main pt-md px-lg">{children}</main>
    </>
  );
}
