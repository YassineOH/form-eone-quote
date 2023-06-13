import {
  InputHTMLAttributes,
  Ref,
  forwardRef,
  useState,
  useEffect,
  useRef,
} from 'react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import cx from 'classnames';

import eoneLogo from './assets/eone.png';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error: string | undefined;
}

const formValidation = z.object({
  name: z.string().nonempty('ce champ is obligatoire'),
  phone: z
    .string()
    .nonempty('ce champ is obligatoire')
    .regex(
      /^(06|0%)\d{8}/,
      'insérer un numéro valide, le numero doit commencer par 06 ou 05'
    ),
  address: z.string().nonempty('ce champ is obligatoire'),
  bill: z.number().nullable(),
});

type FormType = z.infer<typeof formValidation>;

function App() {
  const [open, setOpen] = useState(false);
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [isLoading, setIsLoading] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      modalRef.current?.showModal();
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormType>({
    resolver: zodResolver(formValidation),
  });

  const handleSend: SubmitHandler<FormType> = async (_, e) => {
    e?.preventDefault();
    setIsLoading(true);
    if (!e) return;
    const myForm = e.target;
    const formData = new FormData(myForm);

    try {
      await axios.post('/', formData);
    } catch (error) {
      console.log(error);
      setMsgType('error');
    }

    setIsLoading(false);
    setOpen(true);
  };

  return (
    <main className='flex min-h-screen w-screen items-center justify-center bg-inherit'>
      <div className='w-11/12 space-y-6 rounded-md bg-white p-6  shadow-md md:w-1/2 lg:w-1/3'>
        <img src={eoneLogo} alt='eone logo' className='bloc mx-auto' />
        <h1 className='text-center text-xl font-semibold'>
          Remplir la formulaire ci-dessous
        </h1>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(handleSend)}
          data-netlify='true'
          name='form-submission'
        >
          <input type='hidden' name='form-name' value='form-submission' />

          <Input
            {...register('name')}
            label='Nom et Prénom'
            error={errors.name?.message}
            required
          />
          <Input
            {...register('phone')}
            label='Téléphone'
            error={errors.phone?.message}
            type='tel'
            required
          />
          <Input
            {...register('address')}
            label='Adresse'
            error={errors.address?.message}
            required
          />
          <Input
            {...register('bill', { valueAsNumber: true })}
            label='Facture mensuelle moyenne '
            type='number'
            error={errors.bill?.message}
            aria-invalid={!!errors.name?.message}
            defaultValue={0}
          />
          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-md bg-primary py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-700'
          >
            Envoyer
          </button>
        </form>
        <hr className='mx-auto block h-0.5 w-11/12 bg-primary' />
        <div className='text-center'>
          Visiter notre siteweb{' '}
          <a
            href='https://eonegreen.ma/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary underline'
          >
            eone &#9741;
          </a>
        </div>
      </div>
      {isSubmitted && open && (
        <Modal
          msg={
            msgType === 'success'
              ? 'votre demande a été bien enregistrer'
              : "Une erreur s'est produite. Veuillez réessayer"
          }
          ref={modalRef}
          type={msgType}
        />
      )}
    </main>
  );
}
export default App;

const Input = forwardRef(
  (
    { label, error, required, ...props }: InputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div className='flex flex-col items-stretch gap-y-2'>
        <label className='capitalize'>
          {label}
          {required && '*'} :
        </label>
        <input
          {...props}
          ref={ref}
          className='form-input rounded-md border invalid:border-red-500 focus:border-primary focus:outline-none focus:ring-primary '
        />
        {error && (
          <span className='text-italic -my-1 text-sm italic text-red-500'>
            {error}
          </span>
        )}
      </div>
    );
  }
);

interface ModalProps {
  type: 'success' | 'error';
  msg: string;
}

const Modal = forwardRef(
  ({ msg, type }: ModalProps, ref: Ref<HTMLDialogElement>) => {
    return (
      <dialog
        ref={ref}
        className={cx(
          'text-semibold text-cente z-50 rounded-md border-2 backdrop:bg-gray-600/60',
          {
            'border-teal-800 bg-teal-100 p-6 text-teal-800': type === 'success',
            'border-red-800 bg-red-100 p-6 text-red-800': type === 'error',
          }
        )}
      >
        {msg}
      </dialog>
    );
  }
);
