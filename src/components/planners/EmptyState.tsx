interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <div className='rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm font-semibold text-slate-400'>
    {message}
  </div>
);

export default EmptyState;

