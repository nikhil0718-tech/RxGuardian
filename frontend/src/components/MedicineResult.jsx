import {
  CheckCircle
} from "lucide-react";

export default function MedicineResult({
  result
}) {

  if (!result) return null;

  return (

    <div className="mt-6">

      <div
        className="
        bg-white
        rounded-xl
        shadow-md
        p-6"
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-2"
        >
          {result.medicine}
        </h2>

        <p>
          Generic Name:
          {" "}
          {result.generic_name}
        </p>

        <p>
          Confidence:
          {" "}
          {result.confidence}%
        </p>

      </div>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        mt-5"
      >

        <InfoCard
          title="Usage"
          value={result.usage}
        />

        <InfoCard
          title="Best Time"
          value={result.best_time}
        />

        <InfoCard
          title="Dosage"
          value={result.dosage}
        />

        <InfoCard
          title="Precautions"
          value={result.precautions}
        />

        <InfoCard
          title="Side Effects"
          value={result.side_effects}
        />

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value
}) {

  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow-md
      p-5"
    >

      <div
        className="
        flex
        items-center
        gap-2
        mb-2"
      >

        <CheckCircle
          size={18}
        />

        <h3
          className="
          font-semibold"
        >
          {title}
        </h3>

      </div>

      <p>{value}</p>

    </div>
  );
}