const StatsCard = ({

    title,

    value,

    color
}) => {

    return (

        <div className="
        bg-white
        p-8
        rounded-3xl
        shadow-lg
        ">

            <h2 className="
            text-gray-500
            text-xl
            ">

                {title}

            </h2>

            <h1 className={`
            text-5xl
            font-bold
            mt-4

            ${color}
            `}>

                {value}

            </h1>

        </div>
    );
};

export default StatsCard;