import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  addContact,
  updateContact,
  clearEditingContact
} from '../redux/contactSlice';
import { useEffect } from 'react';
    
export default function ContactForm() {
  const dispatch = useDispatch();
  const { editingContact } = useSelector(state => state.contacts);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (editingContact) {
      Object.entries(editingContact).forEach(([key, val]) => setValue(key, val));
    } else {
      reset();
    }
  }, [editingContact]);

  const onSubmit = data => {
    if (editingContact) {
      dispatch(updateContact({ ...editingContact, ...data }));
    } else {
      dispatch(addContact(data));
    }
    reset();
    dispatch(clearEditingContact());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white shadow rounded-xl mb-6">
      <input placeholder="Name" {...register('name', { required: true })} className="input" />
      {errors.name && <span className="text-red-500">Name is required</span>}
      
      <input placeholder="Email" {...register('email', { required: true })} className="input" />      
      <input placeholder="Phone" {...register('phone', { required: true, pattern: /^[0-9]*$/ })} type="number" className="input" />
      {errors.phone && <span className="text-red-500">Please enter a valid phone number</span>}

      <input placeholder="Country" {...register('country')} className="input" />
      <input placeholder="State" {...register('state')} className="input" />
      <input placeholder="City" {...register('city')} className="input" />
      <input placeholder="Appointment Date" type="date" {...register('appointmentDate')} className="input" />
      
      <div className="col-span-1 md:col-span-3 flex justify-end mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingContact ? 'Update Contact' : 'Add Contact'}
        </button>
      </div>
    </form>
  );
}
