export { default as ArchiveListContent } from "./pages/archive-list/ArchiveListContent";
export type { ArchiveListContentProps } from "./pages/archive-list/ArchiveListContent";
export { default as ArchiveDetailContent } from "./pages/archive-detail/ArchiveDetailContent";
export type { ArchiveDetailContentProps } from "./pages/archive-detail/ArchiveDetailContent";
export { default as BookingContent } from "./pages/booking/BookingContent";
export type { BookingContentProps } from "./pages/booking/BookingContent";
export { default as TagManagementContent } from "./pages/tag-management/TagManagementContent";
export type { TagManagementContentProps } from "./pages/tag-management/TagManagementContent";

export { default as ArchiveSelect } from "./shared/components/ArchiveSelect";
export { ArchiveGenderIcon, ArchiveProfileTags } from "./shared/components/ArchiveCommon";

export * from "./shared/mock/archiveMockData";
export * from "./shared/mock/tagManagementMockData";
export * from "./shared/store/patientArchiveStore";
export * from "./shared/types";
