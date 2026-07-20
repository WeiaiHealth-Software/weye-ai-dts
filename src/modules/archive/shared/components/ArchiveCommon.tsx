import clsx from "clsx";
import type { PatientProfile } from "../mock/archiveMockData";
import { profileTagStandard } from "../mock/archiveMockData";

export function ArchiveGenderIcon({
  gender,
  className,
  iconClassName,
}: {
  gender: "男" | "女";
  className?: string;
  iconClassName?: string;
}) {
  const isMale = gender === "男";
  const toneClass = isMale
    ? "bg-sky-50 text-sky-600 border-sky-100"
    : "bg-pink-50 text-pink-500 border-pink-100";

  return (
    <span
      className={clsx(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border",
        toneClass,
        className
      )}
    >
      <svg
        className={clsx("h-4 w-4", iconClassName)}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isMale ? (
          <>
            <circle cx="8" cy="12" r="4.2"></circle>
            <path d="M11.2 8.8L16 4"></path>
            <path d="M12.8 4H16v3.2"></path>
          </>
        ) : (
          <>
            <circle cx="10" cy="8" r="4"></circle>
            <path d="M10 12v4.5"></path>
            <path d="M7.5 14.6h5"></path>
          </>
        )}
      </svg>
    </span>
  );
}

export function ArchiveProfileTags({
  profile,
  hideReviewStatus = false,
}: {
  profile?: PatientProfile;
  hideReviewStatus?: boolean;
}) {
  if (!profile) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {profileTagStandard.map((group) => {
        if (hideReviewStatus && group.key === "reviewStatus") return null;
        const value = profile[group.key as keyof PatientProfile];
        if (!value) return null;
        const option = group.options.find((item) => item.value === value);
        const className = option?.className ?? "border-slate-200 bg-white text-slate-500";
        return (
          <span key={`${group.key}-${value}`} className={`rounded-full border px-2.5 py-1 text-[11px] ${className}`}>
            {value}
          </span>
        );
      })}
    </div>
  );
}
