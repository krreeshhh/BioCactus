const { db } = require('./services/firebase.service');

const topics = [
    {
        title: "DNA & Replication",
        description: "Explore the double helix and how DNA copies itself",
        icon: "🧬",
        color: "from-emerald-500 to-teal-600",
        order: 1,
        lessons: 5,
        xp: 100
    },
    {
        title: "RNA & Transcription",
        description: "Learn how RNA carries genetic messages",
        icon: "🔬",
        color: "from-cyan-500 to-blue-600",
        order: 2,
        lessons: 5,
        xp: 100
    },
    {
        title: "CRISPR Gene Editing",
        description: "Discover the revolutionary gene editing tool",
        icon: "✂️",
        color: "from-violet-500 to-purple-600",
        order: 3,
        lessons: 5,
        xp: 100
    },
    {
        title: "Cell Biology",
        description: "Understand the building blocks of life",
        icon: "🦠",
        color: "from-green-500 to-lime-600",
        order: 4,
        lessons: 5,
        xp: 100
    }
];

const seed = async () => {
    try {
        console.log("Starting seeding process...");
        for (const topic of topics) {
            const id = topic.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
            console.log(`Seeding topic: ${topic.title} (ID: ${id})...`);
            await db.collection('topics').doc(id).set(topic);
            console.log(`Successfully seeded topic: ${topic.title}`);
        }
        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Seeding failed with error:");
        console.error("- Message:", error.message);
        console.error("- Code:", error.code);
        if (error.details) console.error("- Details:", error.details);
        if (error.metadata) console.error("- Metadata:", error.metadata);
        console.error(error.stack);
    } finally {
        process.exit();
    }
};

seed();
