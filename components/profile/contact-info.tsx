'use client';

import { Mail, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface ContactInfoProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export function ContactInfo({ phone, whatsapp, email }: ContactInfoProps) {
  return (
    <div className="space-y-4">
      {phone && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Phone</h3>
          <Link href={`tel:${phone}`} className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <p>{phone}</p>
          </Link>
        </div>
      )}
      {whatsapp && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Whatsapp</h3>
          <Link
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <p>{whatsapp}</p>
          </Link>
        </div>
      )}
      {email && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">E-mail</h3>
          <Link href={`mailto:${email}`} className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <p>{email}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
