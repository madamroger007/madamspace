
export default function SectionWrapper({
    children,
    className = "",
    id = ""
}: {
    children: React.ReactNode,
    className?: string
    id?: string
}) {
    return (
        <section className={`${className}`} id={id}>
            <div className="section-frame">
                <div className="container mx-auto px-6 relative z-10 py-10 md:py-10">
                    {children}
                </div>
                <div className="absolute inset-0 section-inner-glow pointer-events-none" />
            </div>
        </section>
    );
}