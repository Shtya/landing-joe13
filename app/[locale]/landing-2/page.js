import { redirect } from 'next/navigation';

export default function LandingTwoRedirect({ params: { locale } }) {
  redirect(`/${locale}`);
}
