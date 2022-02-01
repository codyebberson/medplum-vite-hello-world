import { Document, Loading, ResourceName, useMedplum } from "@medplum/ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function PatientPage() {
  const medplum = useMedplum();
  const { id } = useParams();
  const [patient, setPatient] = useState();

  useEffect(() => {
    medplum.read("Patient", id).then(setPatient);
  }, [id]);

  if (!patient) {
    return <Loading />;
  }

  return (
    <Document>
      <h1>
        <ResourceName value={patient} />
      </h1>
      <pre>{JSON.stringify(patient, null, 2)}</pre>
    </Document>
  );
}
