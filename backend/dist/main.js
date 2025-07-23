"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const logger_guard_1 = require("./common/guards/logger.guard");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
let cachedServer;
async function bootstrap() {
    const expressApp = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    app.enableCors();
    app.useGlobalGuards(new logger_guard_1.LoggingGuard());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.init();
    return expressApp;
}
//# sourceMappingURL=main.js.map