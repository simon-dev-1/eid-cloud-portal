import { useEffect, useState } from 'react';

import { toDataURL } from 'qrcode';

interface QrCodeProps {
  value: string;
  size?: number;
}

export const QrCode = ({ value, size = 256 }: QrCodeProps) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void toDataURL(value, { width: size, margin: 1 })
      .then((url) => {
        if (active) {
          setDataUrl(url);
        }
      })
      .catch(() => {
        if (active) {
          setDataUrl(null);
        }
      });

    return () => {
      active = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return null;
  }

  return <img src={dataUrl} alt="Scan with the swiyu Wallet" width={size} height={size} />;
};
