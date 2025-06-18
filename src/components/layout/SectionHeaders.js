
export default function SectionHeaders({ title, subtitle }) {
    return (
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-red-600">{title}</h2>
            <p className="text-lg text-gray-700 mt-2">{subtitle}</p>
        </div>
    );
}