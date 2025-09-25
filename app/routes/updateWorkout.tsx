import SubPageHeader from '~/components/layouts/SubPageHeader';

export function meta() {
  return [
    { title: 'Update Workout' },
    { name: 'description', content: 'Update Workout' },
  ];
}

export default function UpdateWorkout() {
  return (
    <div>
      <SubPageHeader />
      <h1>Update Workout</h1>
    </div>
  );
}
