/* eslint-disable @next/next/no-img-element */
export const MovieCard = ({
  image,
  title,
  rating,
}) => {
  return (
    <div>
      <img
        src={image}
        alt={title}
        className="w-full aspect-[229.73/340] object-cover rounded-lg"
      />

      <div className="mt-2">
        <p className="text-sm text-gray-500">
          ⭐ {rating}/10
        </p>

        <h3 className="font-medium">
          {title}
        </h3>
      </div>
    </div>
  );
};