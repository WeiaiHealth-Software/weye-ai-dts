import { useNavigate, useParams } from "react-router";
import ArchiveDetailContent from "../pages/archive-detail/ArchiveDetailContent";

export default function ArchiveDetailRouteExample() {
  const navigate = useNavigate();
  const params = useParams();
  const patientId = String(params.id ?? "");

  return (
    <div className="archive-extract-root">
      <ArchiveDetailContent
        patientId={patientId}
        onBack={() => navigate("/crm/client-list")}
        onCreateArchive={(id) => navigate(`/crm/client/${id}/visit/new`)}
        onCreateFollowup={(id) => navigate(`/crm/client/${id}/followup/new`)}
      />
    </div>
  );
}
