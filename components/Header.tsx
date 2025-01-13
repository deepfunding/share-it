export default function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-80 transition-opacity">
        Share It
      </h1>
      <h2 className="mt-3 text-xl font-medium text-gray-600 sm:text-2xl">
        by{" "}
        <a
          href={"https://deepfunding.org/"}
          className={"text-gray-600 hover:underline"}
        >
          DeepFunding
        </a>
      </h2>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Visualize your submission in a beautiful graph and share it with the
        world.
      </p>
    </div>
  );
}
