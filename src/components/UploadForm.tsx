import { useForm } from 'react-hook-form';
import { useFileUpload } from '../hooks/useFileUpload';
import styles from './UploadForm.module.css';

interface UploadFormValues {
  file: FileList;
}

interface UploadFormProps {
  onUploaded: () => void;
}

export const UploadForm = ({ onUploaded }: UploadFormProps) => {
  const { isUploading, error, handlers } = useFileUpload();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormValues>();

  const onSubmit = async (values: UploadFormValues) => {
    const file = values.file?.[0];
    if (!file) return;

    const uploaded = await handlers.upload(file);
    if (uploaded) {
      reset();
      onUploaded();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        aria-label="Choose a file"
        className={styles.input}
        {...register('file', { required: 'Please choose a file' })}
      />
      {errors.file && <p className={styles.error}>{errors.file.message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.submit} disabled={isUploading}>
        {isUploading ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  );
};
