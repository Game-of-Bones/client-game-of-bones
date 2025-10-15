export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#462E1B] to-[#AC7142] text-white font-cinzel uppercase py-4">
      <div className="flex justify-center items-center gap-4 text-center px-4">
        <p className="text-sm md:text-base">
          Este proyecto ha sido realizado por estudiantes de desarrollo Fullstack en:
        </p>
        <a
          href="https://factoriaf5.org/" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img
            src="/logo-factoriaf5.png" 
            alt="Logo de la escuela"
            className="h-8 md:h-10"
          />
        </a>
      </div>
    </footer>
  );
}
