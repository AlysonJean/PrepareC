const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking Organization Status...');
        const org = await prisma.organization.findFirst(); // Just grab the first one
        console.log('Org found:', org);

        if (org) {
            const updated = await prisma.organization.update({
                where: { id: org.id },
                data: { subscriptionStatus: 'ACTIVE' }
            });
            console.log('Updated Org to ACTIVE:', updated);
        } else {
            console.log("No organization found to update.");
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
