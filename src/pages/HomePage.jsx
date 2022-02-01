import {
  Document,
  Loading,
  ResourceBadge,
  useMedplum,
  useMedplumProfile,
} from "@medplum/ui";
import { useEffect, useState } from "react";

export function HomePage() {
  const medplum = useMedplum();
  const profile = useMedplumProfile();
  const [patients, setPatients] = useState();

  useEffect(() => {
    medplum.search({ resourceType: "Patient" }).then(setPatients);
  }, []);

  if (!patients) {
    return <Loading />;
  }

  return (
    <Document>
      <h1>Welcome {profile.name[0].given[0]}</h1>
      <h3>Patients</h3>
      {patients.entry.map((e) => (
        <div key={e.resource.id}>
          <ResourceBadge link={true} value={e.resource} />
        </div>
      ))}
    </Document>
  );
}
