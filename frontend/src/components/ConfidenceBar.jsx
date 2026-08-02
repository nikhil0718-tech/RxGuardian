export default function ConfidenceBar({
  confidence
}) {

  return (

    <div
      className="
      mt-4"
    >

      <p>
        Detection Confidence
      </p>

      <div
        className="
        w-full
        h-4
        bg-gray-200
        rounded-full"
      >

        <div

          className="
          h-4
          bg-green-500
          rounded-full"

          style={{
            width:
            `${confidence}%`
          }}
        />

      </div>

    </div>
  );
}