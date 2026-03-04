const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        console.log('Testing DB connection...');
        await prisma.$connect();
        console.log('Connection successful!');

        // Also try to list organizations to ensure schema is pushed
        const count = await prisma.organization.count();
        console.log(`Found ${count} organizations.`);

    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}
main();
