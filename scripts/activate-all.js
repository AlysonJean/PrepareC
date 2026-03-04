const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Verificando organizações existentes...');

    const orgs = await prisma.organization.findMany();

    if (orgs.length === 0) {
        console.log('⚠️ Nenhuma organização encontrada. Faça login no site primeiro para criar sua conta!');
        return;
    }

    console.log(`✅ Encontradas ${orgs.length} organizações. Atualizando para PLANO ELITE...`);

    const result = await prisma.organization.updateMany({
        data: {
            subscriptionStatus: 'ACTIVE',
            plan: 'ELITE'
        }
    });

    console.log(`🎉 Sucesso! ${result.count} organizações foram ativadas.`);
    console.log('🔓 O acesso TOTAL ao sistema está liberado.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
