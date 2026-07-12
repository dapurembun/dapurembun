export default function Logo({ size = 46 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.svg"
      alt="Dapur Embun"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", borderRadius: "9999px" }}
    />
  );
}
