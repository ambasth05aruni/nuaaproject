export default function Hero({ productSectionRef }) {
  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar">
        Free shipping on orders above ₹499 &nbsp;·&nbsp; Use code <strong>NUA10</strong> for 10% off your first order
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Made for every body</p>
          <h1 className="hero-title">Feel good,<br />every day.</h1>
          <p className="hero-sub">Clothes and more, thoughtfully crafted for you.</p>
          <button
            className="hero-cta"
            onClick={() => productSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop All Products
          </button>
        </div>
      </section>
    </>
  );
}
