'use client';

export default function Home() {
  const handleGoogleSignUp = () => {
    window.location.href = `http://localhost:8080/api/auth/google`;
  };

  return (
    <>
      <button onClick={() => handleGoogleSignUp()}>Google</button>
    </>
  );
}
