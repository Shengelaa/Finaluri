"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingGuard = void 0;
const common_1 = require("@nestjs/common");
let LoggingGuard = class LoggingGuard {
    canActivate(context) {
        const now = Date.now();
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        res.on('finish', () => {
            const duration = Date.now() - now;
            const method = req.method;
            const url = req.originalUrl;
            const statusCode = res.statusCode;
            console.log(`${method} ${url} - ${statusCode} ${duration}ms`);
        });
        return true;
    }
};
exports.LoggingGuard = LoggingGuard;
exports.LoggingGuard = LoggingGuard = __decorate([
    (0, common_1.Injectable)()
], LoggingGuard);
//# sourceMappingURL=logger.guard.js.map