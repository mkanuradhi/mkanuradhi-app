import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';
 
export const routing = defineRouting({
  locales: [LANG_EN, LANG_SI],
  defaultLocale: LANG_EN,
});

export const {Link, redirect, usePathname, useRouter} =
createNavigation(routing);