import { Product } from "../types/type";

export async function FetchProductsData() {
    const data: Product[] = [
        {
            id: "1",
            name: "Cyber Warrior #01",
            price: 2500000,
            description: "A rare cyber warrior from the genesis collection.",
            image: "/nft-card-1.png",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            category: "Artwork",
            likes: 1200,
            createdAt: "2024-01-15T10:00:00Z",
        },
        {
            id: "2",
            name: "Neon Matrix #45",
            price: 1800000,
            description:
                "Immersive neon-lit matrix artwork born from the intersection of code and consciousness. Each glowing strand tells a story of the digital world beyond.",
            image: "/nft-card-1.png",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            category: "Virtual Reality",
            likes: 850,
            createdAt: "2024-02-20T08:30:00Z",
        },
        {
            id: "3",
            name: "Ape Rebel #11",
            price: 4200000,
            description:
                "The most rebellious ape in the metaverse. Wearing neon shades and a leather jacket, Ape Rebel #11 is a symbol of the counter-culture digital movement.",
            image: "/nft-card-1.png",
            category: "Artwork",
            likes: 2400,
            createdAt: "2024-03-05T14:00:00Z",
        },
        {
            id: "4",
            name: "Future Soul #99",
            price: 900000,
            description:
                "A soul trapped in digital form, waiting to be released. Captured at the exact moment of digital transcendence by renowned metaverse photographer Zara Solis.",
            image: "/nft-card-1.png",
            category: "Photography",
            likes: 420,
            createdAt: "2024-03-18T09:15:00Z",
        },
        {
            id: "5",
            name: "Digital Ghost #07",
            price: 3100000,
            description:
                "Ethereal ghost rendered in 4K — a first of its kind cinematic NFT. Each frame was hand-rendered over 300 hours using proprietary volumetric simulation.",
            image: "/nft-card-1.png",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            category: "Videos",
            likes: 1100,
            createdAt: "2024-04-01T16:45:00Z",
        },
        {
            id: "6",
            name: "Sonic Pulse #33",
            price: 1500000,
            description:
                "Visualized sonic waves turned into living art. Generated from a real studio recording session, each color shift maps to a unique frequency in the track.",
            image: "/nft-card-1.png",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            category: "Music",
            likes: 670,
            createdAt: "2024-04-12T11:00:00Z",
        },
        {
            id: "7",
            name: "Stadium Legend #88",
            price: 5000000,
            description:
                "A legendary sports moment immortalized on-chain — the final second of the greatest comeback in metaverse sports history. Authenticated by the league.",
            image: "/nft-card-1.png",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            category: "Sports",
            likes: 3200,
            createdAt: "2024-05-01T07:00:00Z",
        },
        {
            id: "8",
            name: "Abstract Void #22",
            price: 2100000,
            description:
                "Abstract void captured at the edge of the universe — a meditation rendered through 11,000 procedurally generated particles. No two renders are ever the same.",
            image: "/nft-card-1.png",
            category: "Artwork",
            likes: 960,
            createdAt: "2024-05-20T13:30:00Z",
        },
    ];
    const result = await data
    return result
}


export const FecthDataUser = async () => {
    try {
        const response = await fetch('/api/auth/users');
        const data = await response.json();
        if (!response.ok) {
            return { message: data.message || 'Failed to fetch users' };
        }
        return data
    } catch {
        console.error('Failed to fetch user');
        return { message: 'An unexpected error occurred' };
    }
}

export const FecthDataVoucher= async () => {
    try {
        const response = await fetch('/api/voucher');
        const data = await response.json();
        if (!response.ok) {
            return { message: data.message || 'Failed to fetch users' };
        }
        return data
    } catch {
        console.error('Failed to fetch user');
        return { message: 'An unexpected error occurred' };
    }
}