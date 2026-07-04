import { useState, type SyntheticEvent } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

import { eventCategories } from '../../data/eventCategories';
import type { EventCategoryId } from '../../types/EventCategory';

export interface AddEventFormValues {
  title: string;
  dateTime: string;
  categoryId: EventCategoryId;
  note: string;
}

interface AddEventModalProps {
  defaultCategoryId: EventCategoryId;
  defaultDateTime: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AddEventFormValues) => void;
}

const AddEventModal = ({
  defaultCategoryId,
  defaultDateTime,
  isOpen,
  onClose,
  onSubmit,
}: AddEventModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AddEventModalForm
      key={`${defaultDateTime}-${defaultCategoryId}`}
      defaultCategoryId={defaultCategoryId}
      defaultDateTime={defaultDateTime}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

interface AddEventModalFormProps {
  defaultCategoryId: EventCategoryId;
  defaultDateTime: string;
  onClose: () => void;
  onSubmit: (values: AddEventFormValues) => void;
}

const AddEventModalForm = ({
  defaultCategoryId,
  defaultDateTime,
  onClose,
  onSubmit,
}: AddEventModalFormProps) => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState(defaultDateTime);
  const [categoryId, setCategoryId] =
    useState<EventCategoryId>(defaultCategoryId);
  const [note, setNote] = useState('');

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      title,
      dateTime,
      categoryId,
      note,
    });
  };

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/40 px-4 py-6 backdrop-blur-sm'
      onMouseDown={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='add-event-title'
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        className='w-full max-w-lg rounded-3xl bg-white shadow-2xl shadow-indigo-950/20'
      >
        <header className='flex items-center justify-between border-b border-slate-200 px-6 py-5'>
          <h2
            id='add-event-title'
            className='font-display text-2xl text-indigo-950'
          >
            Dodaj novi događaj
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-500'
            aria-label='Zatvori formu'
          >
            <FaTimes aria-hidden='true' />
          </button>
        </header>

        <div className='space-y-5 px-6 py-6'>
          <label className='block' htmlFor='event-title'>
            <span className='mb-2 block text-xs font-bold uppercase tracking-[0.06em] text-slate-500'>
              Naziv događaja
            </span>
            <input
              id='event-title'
              type='text'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder='npr. Predati seminarski rad...'
              className='h-12 w-full rounded-xl border-2 border-slate-200 bg-indigo-50 px-4 text-sm text-indigo-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
            />
          </label>

          <label className='block' htmlFor='event-date-time'>
            <span className='mb-2 block text-xs font-bold uppercase tracking-[0.06em] text-slate-500'>
              Datum i vreme
            </span>
            <input
              id='event-date-time'
              type='datetime-local'
              value={dateTime}
              onChange={(event) => setDateTime(event.target.value)}
              className='h-12 w-full rounded-xl border-2 border-slate-200 bg-indigo-50 px-4 text-sm text-indigo-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
            />
          </label>

          <div>
            <div className='mb-2 text-xs font-bold uppercase tracking-[0.06em] text-slate-500'>
              Kategorija
            </div>
            <div className='flex flex-wrap gap-2'>
              {eventCategories.map((category) => {
                const isSelected = categoryId === category.id;

                return (
                  <button
                    key={category.id}
                    type='button'
                    onClick={() => setCategoryId(category.id)}
                    className='rounded-full border-2 px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5'
                    style={{
                      backgroundColor: category.lightColor,
                      borderColor: isSelected ? category.color : 'transparent',
                      color: category.color,
                    }}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className='block' htmlFor='event-note'>
            <span className='mb-2 block text-xs font-bold uppercase tracking-[0.06em] text-slate-500'>
              Napomena
            </span>
            <input
              id='event-note'
              type='text'
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder='Opciona napomena...'
              className='h-12 w-full rounded-xl border-2 border-slate-200 bg-indigo-50 px-4 text-sm text-indigo-950 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
            />
          </label>
        </div>

        <footer className='flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end'>
          <button
            type='button'
            onClick={onClose}
            className='min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50'
          >
            Otkaži
          </button>
          <button
            type='submit'
            className='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300'
          >
            <FaPlus aria-hidden='true' />
            Dodaj događaj
          </button>
        </footer>
      </form>
    </div>
  );
};

export default AddEventModal;
