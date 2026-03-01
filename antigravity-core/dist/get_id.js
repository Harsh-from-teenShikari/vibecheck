"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const c = await prisma.creatorProfile.findFirst();
    console.log('CreatorID:', c?.id);
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=get_id.js.map