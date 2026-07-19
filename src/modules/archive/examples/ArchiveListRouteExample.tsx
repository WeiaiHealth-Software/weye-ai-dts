import { useNavigate } from "react-router";
import ArchiveListContent from "../pages/archive-list/ArchiveListContent";

export default function ArchiveListRouteExample() {
  const navigate = useNavigate();

  return (
    <div className="archive-extract-root">
      <ArchiveListContent
        onOpenDetail={(patientId) => navigate(`/crm/client/${patientId}`)}
        onCreateArchive={() => navigate("/crm/client/new/visit/new")}
      />
    </div>
  );
}
