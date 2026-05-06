export default function CatalogCard({ data = [] }) {
    return (
        <>
            {data.map((item, index) => (
                <div key={item.id ?? index}>
                    <img src={item.image} alt={item.name} />
                    <h1>{item.name}</h1>
                </div>
            ))}
        </>

    )
}