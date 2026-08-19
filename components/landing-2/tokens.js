/** Shared Tailwind class strings for landing-2 */
export const L2_GRAD =
  'bg-[linear-gradient(94deg,#08a1ff_3%,#1f6df8_30%,#6627f5_68%,#bf47ff_100%)] bg-clip-text text-transparent';

export const L2_BTN_BASE =
  'relative inline-flex cursor-pointer items-center justify-center overflow-hidden border-0 font-[inherit] font-semibold leading-none no-underline';

export const L2_BTN_INTERACTION =
  'transition-[transform,box-shadow,filter] duration-[250ms] hover:-translate-y-0.5';

export const L2_BTN_PRIMARY_CORE =
  'bg-[linear-gradient(105deg,#079cff_0%,#236cff_48%,#8129f7_100%)] text-white shadow-[0_8px_28px_rgba(0,106,255,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:brightness-[1.06] hover:shadow-[0_12px_34px_rgba(0,106,255,0.38),inset_0_1px_1px_rgba(255,255,255,0.4)]';

export const L2_BTN =
  `${L2_BTN_BASE} h-[66px] min-w-[min(247px,100%)] rounded-[35px] px-7 text-[1.2rem] ${L2_BTN_INTERACTION} max-[800px]:h-[58px] max-[800px]:w-full max-[800px]:text-[1.05rem]`;

export const L2_BTN_PRIMARY = `${L2_BTN_PRIMARY_CORE} pe-[72px]`;

export const L2_BTN_PRIMARY_LG = `${L2_BTN} ${L2_BTN_PRIMARY}`;

export const L2_BTN_PRIMARY_MD =
  `${L2_BTN_BASE} h-[46px] w-fit min-w-0 rounded-3xl ps-4 pe-[46px] text-[0.9rem] font-medium ${L2_BTN_INTERACTION} ${L2_BTN_PRIMARY_CORE}`;

export const L2_BTN_PRIMARY_SM =
  `${L2_BTN_BASE} h-[52px] min-w-[min(220px,100%)] rounded-[28px] px-[22px] pe-[58px] text-[0.92rem] ${L2_BTN_INTERACTION} ${L2_BTN_PRIMARY_CORE}`;

export const L2_BTN_ARROW_LG =
  'pointer-events-none absolute end-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-[#f8f9ff] text-[#4d42ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_rgba(41,77,240,0.22)]';

export const L2_BTN_ARROW_MD =
  'pointer-events-none absolute end-1.5 top-1/2 grid h-[34px] w-[34px] -translate-y-1/2 place-items-center rounded-full bg-[#f8f9ff] text-[#4d42ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_3px_10px_rgba(41,77,240,0.18)]';

export const L2_BTN_ARROW_SM =
  'pointer-events-none absolute end-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#f8f9ff] text-[#4d42ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_3px_10px_rgba(41,77,240,0.18)]';

/** @deprecated use L2_BTN_PRIMARY_LG + L2_BTN_ARROW_LG via PrimaryButton */
export const L2_BTN_SM =
  'h-[52px] min-w-[min(200px,100%)] rounded-[28px] pe-[58px] ps-[22px] text-[0.92rem]';

/** @deprecated use L2_BTN_ARROW_SM via PrimaryButton */
export const L2_BTN_ARROW =
  'pointer-events-none absolute end-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#f8f9ff] text-[#4d42ff]';

export const L2_BTN_ICON =
  `${L2_BTN_BASE} grid h-[42px] w-[42px] place-items-center rounded-full p-0 ${L2_BTN_INTERACTION} ${L2_BTN_PRIMARY_CORE}`;

export const L2_BTN_CIRCLE =
  `${L2_BTN_BASE} grid h-12 w-12 place-items-center rounded-full p-0 ${L2_BTN_INTERACTION} ${L2_BTN_PRIMARY_CORE} hover:scale-110 active:scale-95`;
